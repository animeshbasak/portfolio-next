"""Lab prototypes, version 2: each clip tells a three-beat story.

Layout (1280x720, 10 s loop): a big kinetic headline on the left says what is happening,
a beat counter sits above it, the product moment plays on the right inside a "camera"
that pushes in on the key detail, and a three-part progress bar runs along the bottom.
Only approved facts; insaneFit stays abstract.
"""
import json, shutil
from pathlib import Path

ROOT = Path(__file__).parent
DUR = 10
BEATS = [(0.0, 3.2), (3.2, 3.2), (6.4, 3.2)]

SKELETON = """<!doctype html>
<html lang="en" data-composition-variables='[{{"id":"theme","type":"string","label":"Theme","default":"light"}}]'>
<head>
<meta charset="utf-8">
<title>{title}</title>
<link rel="stylesheet" href="assets/kit.css">
<script src="assets/gsap.min.js"></script>
<style>
  #brand {{ position: absolute; left: 64px; top: 52px; }}
  .hlwrap {{ position: absolute; left: 64px; top: 210px; width: 500px; }}
  .kick {{ position: absolute; left: 0; top: 0; font-size: 16px; letter-spacing: .22em; text-transform: uppercase; color: var(--red); opacity: 0; }}
  .hl {{ position: absolute; left: 0; top: 34px; width: 500px; overflow: hidden; padding-bottom: 6px; }}
  .hl .in {{ display: block; font-family: 'Bebas', sans-serif; font-size: 104px; line-height: .92; letter-spacing: .01em; }}
  .hl .in em {{ font-style: normal; color: var(--red); }}
  #view {{ position: absolute; left: 600px; top: 72px; width: 616px; height: 536px; overflow: hidden; background: var(--panel); border: 1px solid var(--ink3); }}
  #stage {{ position: absolute; left: 0; top: 0; width: 616px; height: 536px; transform-origin: 0 0; }}
  #prog {{ position: absolute; left: 64px; right: 64px; top: 640px; display: flex; gap: 16px; }}
  .seg {{ flex: 1; }}
  .seg b {{ display: block; height: 3px; background: var(--ink3); position: relative; overflow: hidden; }}
  .seg b i {{ position: absolute; inset: 0; background: var(--red); transform-origin: left center; transform: scaleX(0); }}
  .seg span {{ display: block; margin-top: 10px; font-size: 15px; letter-spacing: .2em; text-transform: uppercase; color: var(--ink2); }}
  #cur {{ position: absolute; left: 0; top: 0; width: 26px; height: 32px; z-index: 30; opacity: 0; }}
  #rip {{ position: absolute; left: 0; top: 0; width: 46px; height: 46px; margin: -23px 0 0 -23px; border: 2px solid var(--red); border-radius: 50%; z-index: 29; opacity: 0; }}
  {css}
</style>
</head>
<body>
<div id="root" data-composition-id="{id}" data-width="1280" data-height="720" data-start="0" data-duration="{dur}">
  <div id="brand" class="label">{brand}</div>
  {headlines}
  <div id="view"><div id="stage">
{stage}
    <svg id="cur" viewBox="0 0 26 32"><path d="M2 2 L2 26 L8.5 20 L13 30 L17 28 L12.5 18.5 L21 18.5 Z" fill="var(--ink)" stroke="var(--panel)" stroke-width="2" stroke-linejoin="round"/></svg>
    <div id="rip"></div>
  </div></div>
  <div id="prog">{segs}</div>
</div>
<script>
  const vars = (window.__hyperframes && window.__hyperframes.getVariables) ? window.__hyperframes.getVariables() : {{}};
  document.documentElement.dataset.theme = vars.theme === 'dark' ? 'dark' : 'light';
  const out = 'power2.out', inn = 'power2.in', io = 'power2.inOut', snap = 'power3.out';
  const tl = gsap.timeline({{ paused: true }});
  const BEATS = {beats};
  document.querySelectorAll('.hl .in').forEach(el => {{ let f = 104; while (el.scrollWidth > 496 && f > 60) {{ f -= 4; el.style.fontSize = f + 'px'; }} }});
  // Beats: progress bar (linear, it is progress), kicker and masked headline in and out.
  BEATS.forEach(([t, d], i) => {{
    tl.fromTo('#seg' + i + ' i', {{ scaleX: 0 }}, {{ scaleX: 1, duration: d, ease: 'none' }}, t)
      .to('#seg' + i + ' span', {{ color: 'var(--ink)', duration: 0.2 }}, t)
      .to('#seg' + i + ' span', {{ color: 'var(--ink2)', duration: 0.2 }}, t + d)
      .fromTo('#k' + i, {{ opacity: 0, y: 8 }}, {{ opacity: 1, y: 0, duration: 0.35, ease: out }}, t + 0.05)
      .fromTo('#h' + i + ' .in', {{ yPercent: 110 }}, {{ yPercent: 0, duration: 0.6, ease: snap }}, t + 0.1)
      .to('#h' + i + ' .in', {{ yPercent: -110, duration: 0.4, ease: inn }}, t + d - 0.42)
      .to('#k' + i, {{ opacity: 0, duration: 0.3, ease: inn }}, t + d - 0.35);
  }});
  tl.set(['#seg0 i', '#seg1 i', '#seg2 i'], {{ scaleX: 0 }}, {dur} - 0.02);
  const rise = (sel, at, d = 0.4) => tl.fromTo(sel, {{ opacity: 0, y: 10 }}, {{ opacity: 1, y: 0, duration: d, ease: out }}, at);
  const fade = (sel, at, d = 0.35) => tl.to(sel, {{ opacity: 0, duration: d, ease: inn }}, at);
  const typeIn = (sel, at, d, n) => {{ const el = document.querySelector(sel); const w = el.scrollWidth; tl.set(sel, {{ width: 0 }}, 0).to(sel, {{ width: w, duration: d, ease: 'steps(' + n + ')' }}, at); }};
  // Camera: focus a stage point (cx, cy) at scale s.
  const cam = (s, cx, cy, at, d = 0.9) => tl.to('#stage', {{ scale: s, x: 308 - cx * s, y: 268 - cy * s, duration: d, ease: io }}, at);
  const cur = (x, y, at, d = 0.6) => tl.to('#cur', {{ x, y, duration: d, ease: io }}, at);
  const click = (x, y, at) => tl.set('#rip', {{ x, y, scale: 0.3, opacity: 1 }}, at).to('#rip', {{ scale: 1.4, opacity: 0, duration: 0.5, ease: out }}, at);
{js}
  window.__timelines = window.__timelines || {{}};
  window.__timelines['{id}'] = tl;
</script>
</body>
</html>
"""

P = {}

# ─────────────────────────────── PAARTH ───────────────────────────────
P['paarth'] = dict(brand='PAARTH · open source · v4.0.0', titles=['Ask', 'Route', 'Guard'],
  heads=['Ask<br>once.', 'It picks<br>the <em>route.</em>', 'Danger?<br><em>Blocked.</em>'],
  css="""
#term { position: absolute; left: 0; top: 0; width: 616px; height: 536px; padding: 30px 32px; font-size: 24px; }
.chip2 { position: absolute; left: 70px; width: 470px; padding: 14px 18px; border: 1px solid var(--ink3); background: var(--bg); opacity: 0; font-size: 22px; }
.chip2 small { display: block; font-size: 14px; letter-spacing: .18em; text-transform: uppercase; color: var(--ink2); }
#wire { position: absolute; left: 50px; top: 130px; width: 2px; height: 270px; background: var(--red); transform-origin: top center; }
.nd { position: absolute; left: 44px; width: 14px; height: 14px; background: var(--red); }
#bad { position: absolute; left: 32px; top: 128px; font-size: 24px; opacity: 0; }
#stamp2 { position: absolute; left: 110px; top: 210px; padding: 10px 26px; border: 4px solid var(--red); color: var(--red); font-family: 'Bebas', sans-serif; font-size: 96px; letter-spacing: .04em; transform: rotate(-5deg); opacity: 0; }
#guard { position: absolute; left: 32px; top: 420px; opacity: 0; font-size: 21px; }
""", stage="""
<div id="term">
  <div class="label">Claude Code · PAARTH underneath</div>
  <div style="margin-top:24px"><span class="red">$</span> <span id="cmd" class="type">/paarth "fix the dark mode bug"</span><span class="caret"></span></div>
</div>
<div id="wire"></div>
<div class="nd" id="nd1" style="top:150px"></div><div class="nd" id="nd2" style="top:250px"></div><div class="nd" id="nd3" style="top:350px"></div>
<div class="chip2" id="c1" style="top:126px"><small>Intent</small>bug fix</div>
<div class="chip2" id="c2" style="top:226px"><small>Memory</small>project context recalled</div>
<div class="chip2" id="c3" style="top:326px"><small>Skills</small>debug, then test</div>
<div id="bad">agent wants to run <span class="dim">rm -rf ./build</span></div>
<div id="stamp2">Blocked</div>
<div id="guard"><span class="amber">cost guard</span> <span class="dim">· budget hit → free local model</span></div>
""", js="""
  cam(1.12, 300, 120, 0.0, 0.01); typeIn('#cmd', 0.6, 1.3, 30);
  cam(1, 308, 268, 2.6, 0.8);
  tl.fromTo('#wire', { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: io }, 3.4);
  [0, 1, 2].forEach(i => { tl.fromTo('#nd' + (i + 1), { scale: 0 }, { scale: 1, duration: 0.25, ease: out }, 3.5 + i * 0.4); rise('#c' + (i + 1), 3.55 + i * 0.4); });
  tl.to(['#c1', '#c2', '#c3', '#wire', '.nd'], { opacity: 0, duration: 0.3, ease: inn }, 6.1);
  rise('#bad', 6.5);
  tl.fromTo('#stamp2', { opacity: 0, scale: 1.35 }, { opacity: 1, scale: 1, duration: 0.3, ease: snap }, 7.1);
  cam(1.18, 300, 270, 7.1, 0.5);
  cam(1, 308, 268, 8.0, 0.6); rise('#guard', 8.2);
  fade(['#bad', '#stamp2', '#guard'], 9.4); tl.to('#cmd', { width: 0, duration: 0.3, ease: inn }, 9.4);
  cam(1.12, 300, 120, 9.6, 0.38);
""")

# ─────────────────────────────── Paarth One ───────────────────────────
P['paarth-one'] = dict(brand='Paarth One · part of PAARTH', titles=['Ask', 'Route', 'Local'],
  heads=['Your apps<br><em>ask.</em>', 'One node<br><em>routes.</em>', 'One local<br><em>API.</em>'],
  css="""
.bx { position: absolute; background: var(--bg); border: 1px solid var(--ink3); padding: 14px 16px; font-size: 20px; opacity: 0; }
.bx small { display: block; font-size: 13px; letter-spacing: .16em; text-transform: uppercase; color: var(--ink2); margin-top: 4px; }
.ln { position: absolute; height: 2px; background: var(--ink3); transform-origin: left center; }
.pk { position: absolute; width: 14px; height: 14px; background: var(--red); opacity: 0; }
#node { left: 214px; top: 178px; width: 188px; height: 180px; padding: 18px; }
#node .display { font-size: 52px; }
.pick { color: var(--red); font-size: 13px; letter-spacing: .18em; opacity: 0; }
#fence { position: absolute; left: 14px; top: 64px; width: 430px; height: 448px; border: 2px dashed var(--red); opacity: 0; }
#fenceL { position: absolute; left: 26px; top: 40px; font-size: 14px; letter-spacing: .2em; color: var(--red); opacity: 0; }
""", stage="""
<div id="fence"></div><div id="fenceL">THIS MACHINE · LOOPBACK</div>
<div class="bx" id="a1" style="left:30px; top:120px; width:150px">Local app<small>asks for a model</small></div>
<div class="bx" id="a2" style="left:30px; top:330px; width:150px">My scripts<small>want a playbook</small></div>
<div class="ln" style="left:180px; top:160px; width:34px"></div><div class="ln" style="left:180px; top:370px; width:34px"></div>
<div class="bx" id="node"><div class="display">Paarth<br>One</div><small id="rt">route · playbook</small></div>
<div class="ln" style="left:402px; top:200px; width:60px"></div><div class="ln" style="left:402px; top:330px; width:60px"></div>
<div class="bx" id="m1" style="left:462px; top:150px; width:140px">Cloud<small>hard tasks</small><div class="pick" id="pk1">CHOSEN</div></div>
<div class="bx" id="m2" style="left:462px; top:290px; width:140px">Local<small>free, private</small><div class="pick" id="pk2">CHOSEN</div></div>
<div class="pk" id="p1" style="left:173px; top:153px"></div><div class="pk" id="p2" style="left:173px; top:363px"></div>
""", js="""
  rise(['#a1', '#a2'], 0.3); tl.fromTo('.ln', { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: io, stagger: 0.08 }, 0.6); rise('#node', 0.9); rise(['#m1', '#m2'], 1.2);
  cam(1.25, 160, 270, 1.4, 0.7);
  tl.set('#p1', { opacity: 1, x: 0, y: 0 }, 1.8).to('#p1', { x: 41, y: 60, duration: 0.5, ease: io }, 1.8).to('#p1', { opacity: 0, duration: 0.1 }, 2.3);
  tl.set('#p2', { opacity: 1, x: 0, y: 0 }, 2.2).to('#p2', { x: 41, y: -90, duration: 0.5, ease: io }, 2.2).to('#p2', { opacity: 0, duration: 0.1 }, 2.7);
  tl.to('#node', { borderColor: 'var(--red)', duration: 0.2 }, 2.4);
  cam(1.2, 420, 268, 3.3, 0.8);
  tl.set('#p1', { x: 236, y: 40, opacity: 1 }, 4.0).to('#p1', { x: 296, y: 170, duration: 0.5, ease: io }, 4.0).to('#p1', { opacity: 0, duration: 0.1 }, 4.5);
  tl.to('#m2', { borderColor: 'var(--red)', duration: 0.2 }, 4.5).to('#pk2', { opacity: 1, duration: 0.25 }, 4.5);
  tl.set('#p2', { x: 236, y: -170, opacity: 1 }, 5.0).to('#p2', { x: 296, y: -200, duration: 0.5, ease: io }, 5.0).to('#p2', { opacity: 0, duration: 0.1 }, 5.5);
  tl.to('#m1', { borderColor: 'var(--red)', duration: 0.2 }, 5.5).to('#pk1', { opacity: 1, duration: 0.25 }, 5.5);
  cam(0.94, 308, 268, 6.4, 0.9);
  tl.fromTo('#fence', { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.5, ease: out }, 7.0); rise('#fenceL', 7.2);
  fade(['#fence', '#fenceL', '#pk1', '#pk2'], 9.3); tl.to(['#node', '#m1', '#m2'], { borderColor: 'var(--ink3)', duration: 0.3 }, 9.3);
  fade(['#a1', '#a2', '#node', '#m1', '#m2'], 9.5); tl.to('.ln', { scaleX: 0, duration: 0.3, ease: inn }, 9.5);
  cam(1, 308, 268, 9.5, 0.45);
""")

# ─────────────────────────────── Trinetra ─────────────────────────────
P['trinetra'] = dict(brand='Trinetra · open source · macOS', titles=['Wake', 'Lid', 'Sleep'],
  heads=['Agent<br>working? <em>Stay<br>awake.</em>', 'Lid shut.<br><em>Still on.</em>', 'Done?<br><em>Sleep.</em>'],
  css="""
#bar { position: absolute; left: 0; right: 0; top: 0; height: 46px; border-bottom: 1px solid var(--ink3); display: flex; justify-content: flex-end; align-items: center; gap: 16px; padding: 0 22px; font-size: 17px; }
#mini { width: 26px; height: 16px; }
#eye { position: absolute; left: 158px; top: 92px; width: 300px; height: 170px; }
#eyeG { transform-origin: 150px 85px; transform-box: view-box; }
#agent { position: absolute; left: 150px; top: 300px; width: 316px; padding: 12px 16px; border: 1px solid var(--ink3); background: var(--bg); font-size: 20px; opacity: 0; }
#lap { position: absolute; left: 208px; top: 372px; width: 200px; }
#scr { width: 200px; height: 118px; border: 2px solid var(--ink); border-bottom: none; background: var(--bg); transform-origin: bottom center; }
#kb { width: 236px; height: 12px; margin-left: -18px; border: 2px solid var(--ink); }
#note { position: absolute; left: 0; width: 616px; top: 506px; text-align: center; font-size: 17px; letter-spacing: .16em; text-transform: uppercase; color: var(--ink2); opacity: 0; }
""", stage="""
<div id="bar"><span class="dim">21:30</span>
  <svg id="mini" viewBox="0 0 26 16"><path d="M1 8 Q13 -4 25 8 Q13 20 1 8 Z" fill="none" stroke="var(--ink)" stroke-width="2"/><circle cx="13" cy="8" r="3.4" fill="var(--red)"/></svg>
  <span id="st">Sleep allowed</span></div>
<svg id="eye" viewBox="0 0 300 170"><g id="eyeG">
  <clipPath id="ec"><path d="M10 85 Q150 -35 290 85 Q150 205 10 85 Z"/></clipPath>
  <path d="M10 85 Q150 -35 290 85 Q150 205 10 85 Z" fill="var(--bg)" stroke="var(--ink)" stroke-width="5"/>
  <g clip-path="url(#ec)"><g id="pupil"><circle cx="150" cy="85" r="42" fill="var(--ink)"/><circle cx="150" cy="85" r="16" fill="var(--red)"/></g></g>
</g></svg>
<div id="agent"><span class="green">●</span> Claude Code · <span id="ag">working</span></div>
<div id="lap"><div id="scr"></div><div id="kb"></div></div>
<div id="note">lid closed · still awake</div>
""", js="""
  // The eye starts closed (lid drawn over it), opens when an agent starts.
  tl.set('#eyeG', { scaleY: 0.06 }, 0);
  rise('#agent', 0.6);
  tl.to('#eyeG', { scaleY: 1, duration: 0.6, ease: snap }, 1.1);
  tl.set('#st', { textContent: 'Awake · 1 agent' }, 1.4);
  cam(1.08, 308, 236, 1.0, 1.4);
  cam(1.1, 308, 400, 3.3, 0.8);
  tl.to('#scr', { scaleY: 0.04, duration: 0.9, ease: io }, 4.0);
  tl.to('#pupil', { y: 22, duration: 0.5, ease: io }, 4.6); rise('#note', 4.9);
  cam(1, 308, 268, 6.4, 0.7); fade('#note', 6.4); tl.to('#pupil', { y: 0, duration: 0.4, ease: io }, 6.5);
  tl.set('#ag', { textContent: 'finished' }, 6.9).to('#agent', { borderColor: 'var(--ink2)', duration: 0.2 }, 6.9);
  tl.to('#eyeG', { scaleY: 0.06, duration: 0.6, ease: io }, 7.5).set('#st', { textContent: 'Sleep allowed' }, 7.9);
  fade('#agent', 9.2); tl.to('#scr', { scaleY: 1, duration: 0.6, ease: io }, 9.2);
  tl.set('#ag', { textContent: 'working' }, 9.95).set('#agent', { borderColor: 'var(--ink3)' }, 9.95);
""")

# ─────────────────────────────── fireTV ───────────────────────────────
P['firetv'] = dict(brand='fireTV by insanemesh · built on dumbtv', titles=['Search', 'Learn', 'Agents'],
  heads=['Search<br><em>every app.</em>', 'Picks that<br><em>learn you.</em>', 'Agents on<br>the <em>TV.</em>'],
  css="""
#tv { position: absolute; left: 24px; top: 40px; width: 568px; height: 340px; border: 3px solid var(--ink); background: var(--bg); overflow: hidden; padding: 18px 20px; }
#stand { position: absolute; left: 258px; top: 380px; width: 100px; height: 12px; background: var(--ink); }
#q { margin-top: 10px; border: 1px solid var(--ink3); padding: 6px 10px; width: 300px; font-size: 16px; }
.res { display: inline-block; width: 92px; height: 112px; margin-right: 8px; border: 1px solid var(--ink3); padding: 6px; vertical-align: top; font-size: 11px; letter-spacing: .12em; color: var(--ink2); text-transform: uppercase; opacity: 0; background: var(--panel); }
.res i { display: block; height: 70px; margin-bottom: 6px; background: var(--red2); }
.tile { position: absolute; top: 268px; width: 96px; height: 52px; border: 1px solid var(--ink3); padding: 6px 8px; font-size: 14px; background: var(--panel); }
.tile.f { border: 2px solid var(--red); }
#learn { position: absolute; left: 20px; top: 244px; font-size: 12px; letter-spacing: .16em; color: var(--red); opacity: 0; }
#ag { position: absolute; right: -230px; top: 0; width: 220px; height: 340px; background: var(--panel); border-left: 3px solid var(--red); padding: 16px; font-size: 15px; }
#ag .a { border-top: 1px solid var(--ink3); padding: 8px 0; }
#send { display: inline-block; margin-top: 8px; padding: 6px 10px; border: 1px solid var(--ink3); font-size: 13px; letter-spacing: .1em; }
#remote { position: absolute; left: 470px; top: 410px; width: 56px; height: 110px; border: 2px solid var(--ink); border-radius: 18px; opacity: 0; }
#remote b { position: absolute; left: 16px; top: 18px; width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--ink); }
""", stage="""
<div id="tv">
  <div class="display" style="font-size:34px">Good evening</div>
  <div id="q"><span class="dim">search ›</span> <span id="qt" class="type">thrillers</span></div>
  <div style="margin-top:10px; white-space:nowrap">
    <span class="res" id="r1"><i></i>app 1</span><span class="res" id="r2"><i></i>app 2</span><span class="res" id="r3"><i></i>app 3</span><span class="res" id="r4"><i></i>app 1</span><span class="res" id="r5"><i></i>app 4</span>
  </div>
  <div id="learn">EVENING · YOUR USUAL ORDER</div>
  <div class="tile f" id="t1" style="left:20px">Movies</div><div class="tile" id="t2" style="left:126px">Shows</div><div class="tile" id="t3" style="left:232px">Music</div><div class="tile" id="t4" style="left:338px">HDMI 1</div><div class="tile" id="t5" style="left:444px">Mac</div>
  <div id="ag"><div class="display" style="font-size:30px">Agents</div>
    <div class="a"><span id="cdot" class="dim">○</span> Claude Code<div class="dim" id="cst" style="font-size:12px">idle</div></div>
    <div class="a"><span class="dim">○</span> Codex<div class="dim" style="font-size:12px">idle</div></div>
    <div id="send">send a task ▸</div></div>
</div>
<div id="stand"></div>
<div id="remote"><b></b></div>
""", js="""
  cam(1.08, 308, 190, 0, 0.01); typeIn('#qt', 0.5, 0.7, 9);
  cam(1, 308, 268, 1.3, 0.8);
  tl.fromTo(['#r1', '#r2', '#r3', '#r4', '#r5'], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, ease: out, stagger: 0.1 }, 1.5);
  rise('#learn', 3.5);
  // Learned order: Shows moves to the front for the evening.
  tl.to('#t2', { x: -106, duration: 0.6, ease: io }, 4.1).to('#t1', { x: 106, duration: 0.6, ease: io }, 4.1)
    .to('#t1', { borderColor: 'var(--ink3)', borderWidth: 1, duration: 0.2 }, 4.1).to('#t2', { borderColor: 'var(--red)', borderWidth: 2, duration: 0.2 }, 4.1);
  cam(1.25, 200, 300, 4.1, 0.8); cam(1, 308, 268, 5.6, 0.7);
  rise('#remote', 6.5);
  tl.to('#ag', { x: -230, duration: 0.6, ease: out }, 6.7);
  cam(1.18, 400, 220, 7.0, 0.8);
  tl.to('#send', { borderColor: 'var(--red)', color: 'var(--red)', duration: 0.2 }, 7.6).to('#remote b', { backgroundColor: 'var(--red)', duration: 0.1 }, 7.9).to('#remote b', { backgroundColor: 'transparent', duration: 0.2 }, 8.1)
    .set('#cst', { textContent: 'running tests' }, 8.0).set('#cdot', { textContent: '●', color: 'var(--green)' }, 8.0);
  cam(1, 308, 268, 9.0, 0.5);
  tl.to('#ag', { x: 0, duration: 0.4, ease: inn }, 9.2); fade(['#r1', '#r2', '#r3', '#r4', '#r5', '#learn', '#remote'], 9.2);
  tl.to(['#t1', '#t2'], { x: 0, duration: 0.4, ease: io }, 9.3).to('#t2', { borderColor: 'var(--ink3)', borderWidth: 1, duration: 0.2 }, 9.3).to('#t1', { borderColor: 'var(--red)', borderWidth: 2, duration: 0.2 }, 9.3)
    .to('#qt', { width: 0, duration: 0.3, ease: inn }, 9.4).to('#send', { borderColor: 'var(--ink3)', color: 'var(--ink)', duration: 0.2 }, 9.4)
    .set('#cst', { textContent: 'idle' }, 9.5).set('#cdot', { textContent: '○', color: 'var(--ink2)' }, 9.5);
  cam(1.08, 308, 190, 9.6, 0.38);
""")

# ─────────────────────────────── PAARTH Agent ─────────────────────────
P['paarth-agent'] = dict(brand='PAARTH Agent · formerly FRIDAY · in development', titles=['Loop', 'Model', 'Check'],
  heads=['Plan.<br>Act.<br><em>Verify.</em>', 'Any model<br><em>behind it.</em>', 'Same steps,<br><em>every time.</em>'],
  css="""
#ring { position: absolute; left: 128px; top: 88px; width: 360px; height: 360px; border: 2px solid var(--ink3); border-radius: 50%; }
#orbit { position: absolute; left: 128px; top: 88px; width: 360px; height: 360px; transform-origin: 180px 180px; }
#orbit i { position: absolute; left: 172px; top: -9px; width: 16px; height: 16px; background: var(--red); border-radius: 50%; }
.st { position: absolute; width: 150px; padding: 10px 0; text-align: center; background: var(--panel); border: 1px solid var(--ink3); font-family: 'Bebas', sans-serif; font-size: 44px; line-height: 1; }
#mod { position: absolute; left: 168px; top: 220px; width: 280px; height: 96px; text-align: center; }
#mod small { display: block; font-size: 13px; letter-spacing: .2em; color: var(--ink2); }
#mwin { position: relative; height: 50px; overflow: hidden; margin-top: 6px; }
#mwin div { position: absolute; left: 0; right: 0; font-size: 28px; }
#ok { position: absolute; left: 380px; top: 360px; width: 84px; height: 84px; border: 4px solid var(--green); border-radius: 50%; color: var(--green); font-size: 50px; text-align: center; line-height: 74px; opacity: 0; }
""", stage="""
<div id="ring"></div>
<div id="orbit"><i></i></div>
<div class="st" id="sP" style="left:233px; top:56px">Plan</div>
<div class="st" id="sA" style="left:389px; top:326px">Act</div>
<div class="st" id="sV" style="left:77px; top:326px">Verify</div>
<div id="mod"><small>MODEL</small><div id="mwin"><div id="mA">Anthropic</div><div id="mG">Groq</div><div id="mO">Ollama · local</div></div></div>
<div id="ok">✓</div>
""", js="""
  const hit = (s, at) => tl.to(s, { borderColor: 'var(--red)', color: 'var(--red)', duration: 0.15 }, at).to(s, { borderColor: 'var(--ink3)', color: 'var(--ink)', duration: 0.3 }, at + 0.45);
  const lap = (at, d, first) => { tl.fromTo('#orbit', { rotation: 0 }, { rotation: 360, duration: d, ease: 'none', immediateRender: !!first }, at); hit('#sP', at); hit('#sA', at + d / 3); hit('#sV', at + 2 * d / 3); };
  lap(0.4, 2.4, true);
  lap(3.3, 2.7);
  tl.set(['#mG', '#mO'], { yPercent: 110 }, 0);
  tl.to('#mA', { yPercent: -110, duration: 0.4, ease: io }, 3.9).fromTo('#mG', { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: io, immediateRender: false }, 3.9);
  tl.to('#mG', { yPercent: -110, duration: 0.4, ease: io }, 5.1).fromTo('#mO', { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: io, immediateRender: false }, 5.1);
  cam(1.15, 308, 268, 3.4, 0.8); cam(1, 308, 268, 5.9, 0.6);
  lap(6.5, 2.4);
  tl.fromTo('#ok', { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 0.3, ease: snap }, 8.7);
  fade('#ok', 9.5);
  tl.to('#mO', { yPercent: -110, duration: 0.35, ease: io }, 9.5).fromTo('#mA', { yPercent: 110 }, { yPercent: 0, duration: 0.35, ease: io, immediateRender: false }, 9.5).set('#mG', { yPercent: 110 }, 9.6);
""")

# ─────────────────────────────── PAARTH-TRADER ────────────────────────
P['paarth-trader'] = dict(brand='PAARTH-TRADER · research lab · in development', titles=['Paper', 'Decide', 'Record'],
  heads=['Fake money.<br><em>Real research.</em>', 'An agent<br>crew <em>decides.</em>', 'Every call<br><em>on record.</em>'],
  css="""
#bigstamp { position: absolute; left: 60px; top: 200px; padding: 10px 24px; border: 5px solid var(--red); color: var(--red); font-family: 'Bebas', sans-serif; font-size: 64px; white-space: nowrap; letter-spacing: .04em; transform-origin: 0 0; opacity: 0; }
.tab { position: absolute; top: 28px; font-size: 16px; letter-spacing: .16em; text-transform: uppercase; color: var(--ink2); opacity: 0; }
#chart { position: absolute; left: 30px; top: 110px; width: 556px; height: 200px; border-left: 1px solid var(--ink3); border-bottom: 1px solid var(--ink3); opacity: 0; }
#cr { position: absolute; left: 0; top: 0; width: 0; height: 200px; overflow: hidden; }
#cr svg { width: 556px; height: 200px; display: block; }
.agt { position: absolute; top: 334px; width: 168px; padding: 10px 12px; border: 1px solid var(--ink3); background: var(--bg); font-size: 17px; opacity: 0; }
.agt small { display: block; font-size: 12px; letter-spacing: .16em; color: var(--ink2); text-transform: uppercase; }
#dec { position: absolute; left: 30px; top: 420px; width: 556px; padding: 12px 16px; border: 2px solid var(--ink); background: var(--bg); font-size: 19px; opacity: 0; }
.row { position: absolute; left: 30px; width: 556px; padding: 10px 0; border-top: 1px solid var(--ink3); font-size: 18px; opacity: 0; }
""", stage="""
<div class="tab" id="tb1" style="left:30px">India</div><div class="tab" id="tb2" style="left:130px">US</div><div class="tab" id="tb3" style="left:200px">Crypto · 24/7</div>
<div id="chart"><div id="cr"><svg viewBox="0 0 556 200"><polyline fill="none" stroke="var(--ink)" stroke-width="3" points="0,160 50,150 100,166 150,130 200,140 250,104 300,116 350,86 400,96 450,64 500,76 556,48"/></svg></div></div>
<div class="agt" id="g1" style="left:30px"><small>Signal</small>spotted</div>
<div class="agt" id="g2" style="left:224px"><small>Risk</small>checked</div>
<div class="agt" id="g3" style="left:418px"><small>Review</small>agreed</div>
<div id="dec">→ paper order placed <span class="dim">· fake money</span></div>
<div class="row" id="w1" style="top:110px"><span class="green">✓</span> signal and its inputs saved</div>
<div class="row" id="w2" style="top:160px"><span class="green">✓</span> paper order logged</div>
<div class="row" id="w3" style="top:210px"><span class="green">✓</span> decision explained in the journal</div>
<div class="row" id="w4" style="top:260px"><span class="red">✕</span> live trading: no code path, by design</div>
<div id="bigstamp">Paper money only</div>
""", js="""
  tl.fromTo('#bigstamp', { opacity: 0, scale: 1.4, rotation: -4 }, { opacity: 1, scale: 1, rotation: -4, duration: 0.35, ease: snap }, 0.5);
  tl.to('#bigstamp', { x: 352, y: -180, scale: 0.4, rotation: 0, duration: 0.8, ease: io }, 2.2);
  rise(['#tb1', '#tb2', '#tb3'], 2.5); tl.to('#tb1', { color: 'var(--ink)', duration: 0.2 }, 2.6);
  tl.to('#chart', { opacity: 1, duration: 0.3 }, 2.7).to('#cr', { width: 556, duration: 1.4, ease: 'power1.inOut' }, 2.8);
  [1, 2, 3].forEach(i => { rise('#g' + i, 3.6 + i * 0.45); tl.to('#g' + i, { borderColor: 'var(--red)', duration: 0.15 }, 3.7 + i * 0.45).to('#g' + i, { borderColor: 'var(--ink3)', duration: 0.3 }, 4.1 + i * 0.45); });
  tl.fromTo('#dec', { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.4, ease: snap }, 5.4);
  cam(1.2, 308, 400, 5.2, 0.7);
  cam(1, 308, 268, 6.4, 0.6); fade(['#chart', '#g1', '#g2', '#g3', '#dec'], 6.4);
  tl.fromTo(['#w1', '#w2', '#w3', '#w4'], { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.4, ease: out, stagger: 0.4 }, 6.9);
  cam(1.06, 320, 240, 8.3, 0.6);
  fade(['#w1', '#w2', '#w3', '#w4', '#tb1', '#tb2', '#tb3', '#bigstamp'], 9.4); cam(1, 308, 268, 9.4, 0.4);
  tl.set('#bigstamp', { x: 0, y: 0, scale: 1 }, 9.9).set('#cr', { width: 0 }, 9.9).set('#tb1', { color: 'var(--ink2)' }, 9.9);
""")

# ─────────────────────────────── Lakshya Hub ──────────────────────────
P['lakshya'] = dict(brand='Lakshya Hub · concept · in development', titles=['Paste', 'Score', 'Fix'],
  heads=['Paste<br>a <em>job.</em>', 'See your<br><em>fit.</em>', 'Fix it<br>before you<br><em>apply.</em>'],
  css="""
#doc { position: absolute; left: 30px; top: 30px; width: 556px; padding: 18px 22px; border: 1px solid var(--ink3); background: var(--bg); font-size: 20px; }
#doc .l { opacity: 0; margin-top: 6px; }
#paste { position: absolute; left: 300px; top: 4px; padding: 4px 10px; background: var(--ink); color: var(--panel); font-size: 15px; letter-spacing: .1em; opacity: 0; }
#gauge { position: absolute; left: 168px; top: 120px; width: 280px; height: 280px; opacity: 0; }
#gauge svg { width: 280px; height: 280px; transform: rotate(-90deg); }
#num { position: absolute; left: 0; right: 0; top: 78px; text-align: center; font-family: 'Bebas', sans-serif; font-size: 110px; line-height: 1; }
#numS { position: absolute; left: 0; right: 0; top: 186px; text-align: center; font-size: 15px; letter-spacing: .2em; color: var(--ink2); }
.fx { position: absolute; left: 30px; width: 556px; padding: 14px 18px; border: 1px solid var(--ink3); background: var(--bg); font-size: 21px; opacity: 0; }
.fx .gap { color: var(--red); } .fx .fix { color: var(--green); opacity: 0; position: absolute; left: 18px; top: 14px; }
""", stage="""
<div id="doc">
  <div class="label">Job description</div>
  <div class="l" id="d1" style="margin-top:12px">Senior Frontend Engineer</div>
  <div class="l dim" id="d2">React and TypeScript</div>
  <div class="l dim" id="d3">Design systems</div>
  <div class="l dim" id="d4">GraphQL APIs</div>
  <div class="l dim" id="d5">Mentor the team</div>
</div>
<div id="paste">⌘V PASTED</div>
<div id="gauge"><svg viewBox="0 0 280 280"><circle cx="140" cy="140" r="120" fill="none" stroke="var(--ink3)" stroke-width="18"/><circle id="arc" cx="140" cy="140" r="120" fill="none" stroke="var(--red)" stroke-width="18" stroke-dasharray="754" stroke-dashoffset="754"/></svg>
  <div id="num">0</div><div id="numS">FIT / 100</div></div>
<div class="fx" id="f1" style="top:150px"><span class="gap" id="g1">✕ GraphQL in production</span><span class="fix" id="x1">✓ add the API work you have done</span></div>
<div class="fx" id="f2" style="top:226px"><span class="gap" id="g2">✕ Design system not shown</span><span class="fix" id="x2">✓ lead with the design system</span></div>
""", js="""
  rise('#paste', 0.4); fade('#paste', 1.6);
  tl.fromTo(['#d1', '#d2', '#d3', '#d4', '#d5'], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: out, stagger: 0.12 }, 0.6);
  cam(1.2, 250, 140, 1.2, 1.2);
  cam(1, 308, 268, 3.1, 0.5); fade('#doc', 3.2, 0.3);
  tl.to('#gauge', { opacity: 1, duration: 0.3 }, 3.4).to('#arc', { strokeDashoffset: 754 * 0.28, duration: 1.4, ease: out }, 3.5);
  const n = { v: 0 }; tl.to(n, { v: 72, duration: 1.4, ease: out, onUpdate: () => { document.getElementById('num').textContent = Math.round(n.v); } }, 3.5);
  cam(1.15, 308, 260, 3.5, 1.4);
  cam(1, 308, 268, 6.2, 0.5); fade('#gauge', 6.3, 0.3);
  rise('#f1', 6.6); rise('#f2', 6.9);
  tl.to('#g1', { opacity: 0, duration: 0.25 }, 7.6).to('#x1', { opacity: 1, duration: 0.3 }, 7.75).to('#f1', { borderColor: 'var(--green)', duration: 0.2 }, 7.75);
  tl.to('#g2', { opacity: 0, duration: 0.25 }, 8.2).to('#x2', { opacity: 1, duration: 0.3 }, 8.35).to('#f2', { borderColor: 'var(--green)', duration: 0.2 }, 8.35);
  fade(['#f1', '#f2'], 9.4);
  tl.set(['#g1', '#g2'], { opacity: 1 }, 9.85).set(['#x1', '#x2'], { opacity: 0 }, 9.85).set(['#f1', '#f2'], { borderColor: 'var(--ink3)' }, 9.85)
    .set('#arc', { strokeDashoffset: 754 }, 9.85).set(n, { v: 0 }, 9.85).call(() => { document.getElementById('num').textContent = '0'; }, null, 9.86)
    .to('#doc', { opacity: 1, duration: 0.1 }, 9.88).set(['#d1', '#d2', '#d3', '#d4', '#d5'], { opacity: 0 }, 9.88);
""")

# ─────────────────────────────── insaneFit (abstract) ─────────────────
P['insanefit'] = dict(brand='insaneFit · iPhone app · in design', titles=['Train', 'Eat', 'Progress'],
  heads=['<em>Training.</em>', '<em>Food.</em>', '<em>Progress.</em>'],
  css="""
svg.rings { position: absolute; left: 88px; top: 48px; width: 440px; height: 440px; transform: rotate(-90deg); }
svg.rings circle { fill: none; stroke-width: 30; }
#lock { position: absolute; left: 0; right: 0; top: 486px; text-align: center; font-size: 15px; letter-spacing: .22em; text-transform: uppercase; color: var(--ink2); opacity: 0; }
""", stage="""
<svg class="rings" id="rg" viewBox="0 0 440 440">
  <circle cx="220" cy="220" r="190" stroke="var(--ink3)"/><circle cx="220" cy="220" r="145" stroke="var(--ink3)"/><circle cx="220" cy="220" r="100" stroke="var(--ink3)"/>
  <circle id="a1" cx="220" cy="220" r="190" stroke="var(--red)" stroke-dasharray="1193.8" stroke-dashoffset="1193.8"/>
  <circle id="a2" cx="220" cy="220" r="145" stroke="var(--ink)" stroke-dasharray="911.1" stroke-dashoffset="911.1"/>
  <circle id="a3" cx="220" cy="220" r="100" stroke="var(--amber)" stroke-dasharray="628.3" stroke-dashoffset="628.3"/>
</svg>
<div id="lock">insaneFit · in design</div>
""", js="""
  tl.to('#a1', { strokeDashoffset: 1193.8 * 0.22, duration: 1.8, ease: out }, 0.4);
  cam(1.08, 308, 268, 0.4, 2.4);
  tl.to('#a2', { strokeDashoffset: 911.1 * 0.36, duration: 1.8, ease: out }, 3.6);
  tl.to('#a3', { strokeDashoffset: 628.3 * 0.12, duration: 1.8, ease: out }, 6.8);
  cam(1, 308, 268, 6.4, 1.2); rise('#lock', 7.6);
  fade('#lock', 9.3);
  tl.to('#a1', { strokeDashoffset: 1193.8, duration: 0.5, ease: inn }, 9.35).to('#a2', { strokeDashoffset: 911.1, duration: 0.5, ease: inn }, 9.4).to('#a3', { strokeDashoffset: 628.3, duration: 0.5, ease: inn }, 9.45);
""")


def main():
    for pid, s in P.items():
        d = ROOT / 'p2' / pid
        if d.exists():
            shutil.rmtree(d)
        d.mkdir(parents=True)
        shutil.copytree(ROOT / 'assets', d / 'assets')
        shutil.copy(ROOT / 'hyperframes.json', d / 'hyperframes.json')
        (d / 'meta.json').write_text(json.dumps({'id': pid, 'name': s['brand']}))
        heads = '\n  '.join(
            f'<div class="hlwrap"><div class="kick" id="k{i}">0{i + 1} · {t}</div><div class="hl" id="h{i}"><span class="in">{h}</span></div></div>'
            for i, (t, h) in enumerate(zip(s['titles'], s['heads'])))
        segs = ''.join(f'<div class="seg" id="seg{i}"><b><i></i></b><span>0{i + 1} {t}</span></div>' for i, t in enumerate(s['titles']))
        html = SKELETON.format(id=pid, title=s['brand'], brand=s['brand'], css=s['css'], stage=s['stage'], js=s['js'],
                               headlines=heads, segs=segs, beats=json.dumps(BEATS), dur=DUR)
        (d / 'index.html').write_text(html)
    print('built', ', '.join(P))


if __name__ == '__main__':
    main()
