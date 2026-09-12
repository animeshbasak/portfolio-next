'use client'
import {useEffect,useRef} from 'react'
import {sceneState} from './state'
import {poseAt,poses,type Pose} from './poses'
export default function Scene(){
 const ref=useRef<HTMLCanvasElement>(null)
 useEffect(()=>{
  if(matchMedia('(max-width: 760px)').matches)return
  let disposed=false,cleanup=()=>{}
  import('three').then(T=>{
   if(disposed||!ref.current)return
   const canvas=ref.current
   let renderer:InstanceType<typeof T.WebGLRenderer>
   try{renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'})}catch{return}
   renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0xe8eff1,0)
   const world=new T.Scene(),camera=new T.PerspectiveCamera(36,1,.1,100);camera.position.set(0,2,17);camera.lookAt(0,0,0)
   world.add(new T.HemisphereLight(0xffffff,0x6a7f88,3));const light=new T.DirectionalLight(0xffffff,4);light.position.set(-3,8,6);world.add(light)
   const group=new T.Group();world.add(group)
   const slabs:InstanceType<typeof T.Group>[]=[],materials:InstanceType<typeof T.MeshPhysicalMaterial>[]=[]
   const geo=new T.BoxGeometry(4.7,.045,3),edgeGeo=new T.EdgesGeometry(geo)
   const edgeMat=new T.LineBasicMaterial({color:0x71909d,transparent:true,opacity:.5})
   const traceMat=new T.LineBasicMaterial({color:0xad4527,transparent:true,opacity:.85})
   for(let i=0;i<6;i++){
    const layer=new T.Group(),mat=new T.MeshPhysicalMaterial({color:i===0?0xcbdde3:0xdce8ec,metalness:.05,roughness:.45,transparent:true,opacity:.22,side:T.DoubleSide,depthWrite:false,clearcoat:1})
    layer.add(new T.Mesh(geo,mat));layer.add(new T.LineSegments(edgeGeo,edgeMat));materials.push(mat)
    const pts=[new T.Vector3(-1.95,.032,-1.15),new T.Vector3(1.85,.032,-1.15),new T.Vector3(1.85,.032,.9)]
    const line=new T.Line(new T.BufferGeometry().setFromPoints(pts),i===2?traceMat:edgeMat);layer.add(line)
    for(let j=0;j<4;j++){const g=new T.BufferGeometry().setFromPoints([new T.Vector3(-1.95,.035,-.7+j*.4),new T.Vector3(j===0?.1:1.35,.035,-.7+j*.4)]);layer.add(new T.Line(g,edgeMat))}
    group.add(layer);slabs.push(layer)
   }
   const count=3000,positions=new Float32Array(count*3),base=new Float32Array(count*3),sheet=new Float32Array(count*3),colors=new Float32Array(count*3)
   let seed=839;const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646}
   for(let i=0;i<count;i++){const a=rand()*Math.PI*2,r=1+rand()*4;base[i*3]=Math.cos(a)*r;base[i*3+1]=Math.sin(a)*r;base[i*3+2]=(rand()-.5)*28;sheet[i*3]=(rand()-.5)*4.7;sheet[i*3+1]=(i%6-2.5)*.26;sheet[i*3+2]=(rand()-.5)*3;const color=new T.Color(i%19===0?0xad4527:0x6d8996);colors.set([color.r,color.g,color.b],i*3)}
   const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(positions,3));pg.setAttribute('color',new T.BufferAttribute(colors,3))
   const pm=new T.PointsMaterial({vertexColors:true,size:.028,transparent:true,opacity:0,depthWrite:false});const points=new T.Points(pg,pm);world.add(points)
   const current={...poses[0]},target={...poses[0]},point=new T.Vector3();let raf=0,last=0,visible=true,px=0,py=0,dirty=true,lastField=0,lastPointerX=0,lastPointerY=0,lastBranch=0,lastReplay=0
   const pulse=new T.Mesh(new T.SphereGeometry(.065,10,8),new T.MeshBasicMaterial({color:0xad4527,transparent:true,opacity:.9,depthTest:false}));group.add(pulse)
   const traceGeometry=new T.BufferGeometry();traceGeometry.setAttribute('position',new T.BufferAttribute(new Float32Array(6*3),3));const trace=new T.Line(traceGeometry,traceMat);group.add(trace)
   const resize=()=>{const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();dirty=true};resize()
   const pointer=(e:PointerEvent)=>{px=(e.clientX/innerWidth-.5)*.08;py=(e.clientY/innerHeight-.5)*.04}
   const visibility=()=>{visible=!document.hidden;if(visible&&!raf)raf=requestAnimationFrame(frame)}
   const frame=(time:number)=>{
    raf=0;if(disposed||!visible)return
    const dt=Math.min(.05,(time-last)/1000||.016);last=time
    const mode=sceneState.mode,index={profile:1,work:2,studio:3,writing:4,contact:5}
    Object.assign(target,mode==='home'?poseAt(sceneState.progress):{...poses[index[mode]],x:4.5,spread:0,scale:.85})
    if(sceneState.quiet){Object.assign(target,poses[mode==='home'?Math.round(Math.min(5,sceneState.progress)):index[mode]])}
    let changed=dirty||Math.abs(px-lastPointerX)>.0001||Math.abs(py-lastPointerY)>.0001||lastBranch!==sceneState.branch||lastReplay!==sceneState.replay
    for(const key of Object.keys(current) as (keyof Pose)[]){const diff=target[key]-current[key];if(Math.abs(diff)>.00005)changed=true;current[key]+=diff*(sceneState.quiet?1:1-Math.exp(-dt*6))}
    if(!changed){raf=requestAnimationFrame(frame);return}
    dirty=false;lastPointerX=px;lastPointerY=py;lastBranch=sceneState.branch;lastReplay=sceneState.replay
    const p=current;group.position.set(p.x,p.y,p.z);group.rotation.set(p.rx+(sceneState.quiet?0:py),p.ry+(sceneState.quiet?0:px),p.rz);group.scale.setScalar(p.scale)
    slabs.forEach((layer,i)=>{const split=i<3?-1:1;layer.position.set((i-2.5)*p.spread*1.5+split*p.branch*2.7,(i-2.5)*p.separation,0);layer.rotation.z=(i-2.5)*p.spread*.08;traceGeometry.attributes.position.setXYZ(i,layer.position.x+(i%2===0?-1.7:1.7),layer.position.y+.05,layer.position.z+(i%2===0?-.8:.8));const selected=p.branch>.5&&sceneState.branch===split;materials[i].color.setHex(selected?0xd6b49f:i===0?0xcbdde3:0xdce8ec);materials[i].opacity=(.15+(i===0?.08:0)+(selected?.13:0))*p.opacity*(1-p.fragment*.96)})
    traceGeometry.attributes.position.needsUpdate=true;const path=traceGeometry.attributes.position,travel=Math.max(0,Math.min(.999,sceneState.replay))*5,segment=Math.floor(travel),fraction=travel-segment;pulse.position.set(T.MathUtils.lerp(path.getX(segment),path.getX(segment+1),fraction),T.MathUtils.lerp(path.getY(segment),path.getY(segment+1),fraction),T.MathUtils.lerp(path.getZ(segment),path.getZ(segment+1),fraction));pulse.visible=mode==='studio'&&sceneState.replay>0
    edgeMat.opacity=.46*p.opacity*(1-p.fragment);traceMat.opacity=.9*(1-p.fragment)
    pm.opacity=p.field*.85;points.visible=p.field>.01
    if(p.field>.01&&time-lastField>67){lastField=time;group.updateMatrixWorld();const blend=Math.min(1,p.dive*1.3);for(let i=0;i<count;i++){point.set(sheet[i*3],sheet[i*3+1],sheet[i*3+2]).applyMatrix4(group.matrixWorld);positions[i*3]=T.MathUtils.lerp(point.x,base[i*3],blend);positions[i*3+1]=T.MathUtils.lerp(point.y,base[i*3+1],blend);positions[i*3+2]=T.MathUtils.lerp(point.z,base[i*3+2]+p.dive*15,blend)}pg.attributes.position.needsUpdate=true}
    renderer.render(world,camera);if(canvas.dataset.ready!=='true')canvas.dataset.ready='true';raf=requestAnimationFrame(frame)
   }
   const contextLost=(event:Event)=>{event.preventDefault();visible=false;canvas.dataset.ready='false'};const contextRestored=()=>{visible=true;dirty=true;if(!raf)raf=requestAnimationFrame(frame)};canvas.addEventListener('webglcontextlost',contextLost);canvas.addEventListener('webglcontextrestored',contextRestored);
   addEventListener('resize',resize);addEventListener('pointermove',pointer,{passive:true});document.addEventListener('visibilitychange',visibility);raf=requestAnimationFrame(frame)
   cleanup=()=>{cancelAnimationFrame(raf);canvas.removeEventListener('webglcontextlost',contextLost);canvas.removeEventListener('webglcontextrestored',contextRestored);removeEventListener('resize',resize);removeEventListener('pointermove',pointer);document.removeEventListener('visibilitychange',visibility);world.traverse(obj=>{const o=obj as InstanceType<typeof T.Mesh>;o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose()}});renderer.dispose()}
  }).catch(()=>{})
  return()=>{disposed=true;cleanup()}
 },[])
 return <canvas ref={ref} className="folio-canvas" aria-hidden="true"/>
}
