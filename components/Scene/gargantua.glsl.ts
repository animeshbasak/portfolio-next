export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uDescent;
  uniform float uTier;

  varying vec2 vUv;

  #define PI 3.14159265359
  #define RS 1.0

  // --- Noise (simplex-ish, 2D) ---------------------------------------
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)),
             dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float snoise(vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x);
    vec2 o = vec2(m, 1.0 - m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(
      dot(a, hash2(i)),
      dot(b, hash2(i + o)),
      dot(c, hash2(i + 1.0))
    );
    return dot(n, vec3(70.0));
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      v += amp * snoise(p);
      p *= 2.1;
      amp *= 0.5;
    }
    return v;
  }

  // --- Starfield ------------------------------------------------------
  float hash3(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float stars(vec3 dir) {
    vec3 p = dir * 80.0;
    vec3 ip = floor(p);
    vec3 fp = fract(p) - 0.5;
    float s = 0.0;
    float r = hash3(ip);
    if (r > 0.996) {
      float d = length(fp);
      float bright = smoothstep(0.45, 0.0, d);
      float twinkle = 0.75 + 0.25 * sin(uTime * 2.0 + r * 40.0);
      s += bright * twinkle * (0.4 + r * 0.6);
    }
    return s;
  }

  // --- Accretion disk color ------------------------------------------
  vec3 blackbody(float T) {
    // T in [0..1], 1 = hottest (white-hot), 0 = cool (deep red)
    T = clamp(T, 0.0, 1.0);
    vec3 col;
    col.r = mix(0.7, 1.0, T);
    col.g = mix(0.25, 0.95, pow(T, 1.3));
    col.b = mix(0.05, 0.75, pow(T, 3.0));
    // Ember bias (film grade)
    col = mix(col, vec3(1.0, 0.5, 0.15), 0.15);
    return col * 1.4;
  }

  vec3 diskColor(vec3 hit) {
    float r = length(hit.xz);
    float theta = atan(hit.z, hit.x);

    float rin = 2.4;
    float rout = 8.0;
    if (r < rin || r > rout) return vec3(0.0);

    float u = (r - rin) / (rout - rin);
    float T = pow(1.0 - u, 1.1);

    // Swirling turbulence (spirals following log-spiral)
    float swirl = theta * 3.0 + log(r) * 6.0 - uTime * 0.35;
    float n = fbm(vec2(swirl, r * 1.2)) * 0.5 + 0.5;
    n = mix(n, pow(n, 2.2), 0.55);

    vec3 c = blackbody(T) * (0.45 + n * 1.2);

    // Soft edges
    float edgeIn = smoothstep(rin, rin + 0.25, r);
    float edgeOut = 1.0 - smoothstep(rout - 1.4, rout, r);
    c *= edgeIn * edgeOut;

    // Doppler brightening (disk rotates counter-clockwise viewed from +y)
    float dop = 0.55 + 0.9 * smoothstep(-1.0, 1.0, sin(theta));
    c *= dop;

    return c;
  }

  // --- Main ----------------------------------------------------------
  void main() {
    vec2 uv = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

    // Camera (slightly above disk plane, pulled back)
    float camZ = mix(10.0, 4.5, uDescent);
    float camY = mix(0.55, 0.15, uDescent);
    vec3 ro = vec3(0.0, camY, camZ);
    vec3 lookAt = vec3(0.0, 0.0, 0.0);
    vec3 fwd = normalize(lookAt - ro);
    vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, fwd);
    float fov = 0.9;
    vec3 rd = normalize(fwd + uv.x * fov * right + uv.y * fov * up);

    // Impact parameter
    vec3 L = -ro;
    float tca = dot(L, rd);
    float d2 = dot(L, L) - tca * tca;
    float b = sqrt(max(d2, 0.0));

    vec3 color = vec3(0.0);
    bool captured = false;

    // Event horizon capture
    float photonSphere = 1.5 * RS * (1.0 + uDescent * 0.3);
    if (tca > 0.0 && b < photonSphere) {
      captured = true;
      color = vec3(0.0);
    }

    // Direct disk hit (no bending)
    float tDiskDirect = -ro.y / rd.y;
    vec3 diskDirect = vec3(0.0);
    if (rd.y < 0.0 && tDiskDirect > 0.0) {
      vec3 hitD = ro + rd * tDiskDirect;
      float rD = length(hitD.xz);
      if (rD > 2.4 && rD < 8.0 && b > photonSphere) {
        diskDirect = diskColor(hitD);
      }
    }

    // Bent ray (for wrap-around lensing)
    vec3 diskBent = vec3(0.0);
    vec3 starCol = vec3(0.0);
    if (!captured && tca > 0.0) {
      // Deflection angle approximation
      float alpha = 2.0 * RS / b + 0.5 * pow(RS / b, 3.0);
      alpha = clamp(alpha, 0.0, 3.0);
      // Strengthen near photon sphere
      if (b < 3.0 * RS) {
        alpha += (3.0 * RS - b) * 0.8;
      }

      vec3 perihelion = ro + rd * tca;
      vec3 radial = length(perihelion) > 0.001 ? normalize(perihelion) : vec3(1.0, 0.0, 0.0);
      vec3 axis = normalize(cross(rd, radial));
      float ca = cos(alpha);
      float sa = sin(alpha);
      vec3 rdNew = rd * ca + cross(axis, rd) * sa + axis * dot(axis, rd) * (1.0 - ca);

      // Bent ray disk intersection (emerging from perihelion)
      if (abs(rdNew.y) > 0.001) {
        float tDiskBent = -perihelion.y / rdNew.y;
        if (tDiskBent > 0.0) {
          vec3 hitB = perihelion + rdNew * tDiskBent;
          float rB = length(hitB.xz);
          if (rB > 2.4 && rB < 8.0) {
            diskBent = diskColor(hitB) * 0.85;
          }
        }
      }

      starCol = vec3(stars(rdNew)) * 0.9;
    } else if (!captured) {
      starCol = vec3(stars(rd));
    }

    // Composite (disk wins over stars)
    color = starCol + max(diskDirect, diskBent);

    // Vignette + descent haze
    float vig = smoothstep(1.4, 0.3, length(uv));
    color *= mix(0.55, 1.0, vig);

    // Ember color grade
    color = mix(color, color * vec3(1.05, 0.85, 0.6), 0.35);

    // Gravitational redshift near horizon (pulls toward ember)
    float horizonNear = 1.0 - smoothstep(photonSphere, photonSphere * 2.5, b);
    if (tca > 0.0) {
      color = mix(color, color * vec3(1.2, 0.45, 0.15), horizonNear * 0.6);
    }

    // Tone map (filmic-ish)
    color = color / (color + vec3(0.85));
    color = pow(color, vec3(0.88));

    gl_FragColor = vec4(color, 1.0);
  }
`
