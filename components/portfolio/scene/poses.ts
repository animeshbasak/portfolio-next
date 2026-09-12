export type Pose={x:number;y:number;z:number;rx:number;ry:number;rz:number;separation:number;spread:number;fragment:number;field:number;dive:number;branch:number;scale:number;opacity:number}
export const poses:Pose[]=[
 {x:3.6,y:-.3,z:0,rx:.65,ry:-.6,rz:-.18,separation:.65,spread:0,fragment:0,field:0,dive:0,branch:0,scale:1,opacity:1},
 {x:0,y:-1.15,z:-1,rx:.55,ry:.05,rz:0,separation:1.05,spread:1,fragment:0,field:0,dive:0,branch:0,scale:.82,opacity:.8},
 {x:-3.2,y:-.3,z:.3,rx:.8,ry:.42,rz:.12,separation:.26,spread:0,fragment:0,field:0,dive:0,branch:0,scale:1.12,opacity:1},
 {x:0,y:-.55,z:-1,rx:.7,ry:0,rz:0,separation:.36,spread:0,fragment:0,field:.14,dive:0,branch:1,scale:.85,opacity:.75},
 {x:3.5,y:-.2,z:-1,rx:.7,ry:-.18,rz:-.08,separation:.14,spread:0,fragment:0,field:0,dive:0,branch:0,scale:.88,opacity:.65},
 {x:3.6,y:-.3,z:0,rx:.65,ry:-.6,rz:-.18,separation:.65,spread:0,fragment:0,field:0,dive:0,branch:0,scale:1,opacity:1},
]
const ease=(x:number)=>{const k=Math.max(0,Math.min(1,x));return k*k*(3-2*k)}
export function poseAt(input:number):Pose {
  const p=Number.isFinite(input)?Math.max(0,Math.min(5,input)):0
  const i=Math.min(4,Math.floor(p)),f=p-i,t=ease((f-.2)/.8)
  const result={...poses[i]}
  for(const key of Object.keys(result) as (keyof Pose)[])result[key]=poses[i][key]+(poses[i+1][key]-poses[i][key])*t
  if(i===2){
    const enter=ease((f-.15)/.3),leave=ease((f-.62)/.32)
    result.fragment=enter*(1-leave)
    result.field=Math.max(result.field,ease((f-.3)/.2)*(1-leave))
    result.dive=Math.sin(ease((f-.2)/.65)*Math.PI)*1.0
    result.x*=1-result.dive
  }
  return result
}
export function progressFromAnchors(y:number,anchors:number[]):number {
  if(anchors.length<2||!Number.isFinite(y))return 0
  for(let i=0;i<anchors.length-1;i++)if(y<anchors[i+1])return Math.max(0,i+(y-anchors[i])/Math.max(1,anchors[i+1]-anchors[i]))
  return anchors.length-1
}
