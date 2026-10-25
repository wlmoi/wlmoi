import { CircuitMosfet } from './CircuitMosfet'
import { useEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { CanvasTexture } from 'three'
import type { Group } from 'three'
import type { Schematic } from '../../data/circuit'
import { circuitBounds, mosfetKind } from '../../data/circuit'
type Props={data:Schematic;progress:RefObject<number>;paused:boolean;manualAngle:number|null;zoom:number;selected:string;onSelect:(name:string)=>void}
function Label({text,position,size}:{text:string;position:[number,number,number];size:number}){
 const texture=useMemo(()=>{const canvas=document.createElement('canvas');canvas.width=256;canvas.height=64;const ctx=canvas.getContext('2d')!;ctx.font='500 38px monospace';ctx.fillStyle='#e0f5ef';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,128,32);return new CanvasTexture(canvas)},[text])
 useEffect(()=>()=>texture.dispose(),[texture])
 return <sprite position={position} scale={[size*4,size,1]}><spriteMaterial map={texture} transparent depthTest={false}/></sprite>
}
function Circuit({data,progress,paused,manualAngle,zoom,selected,onSelect}:Props){
 const group=useRef<Group>(null)
 const {camera,size}=useThree()
 const bounds=useMemo(()=>circuitBounds(data),[data])
 const scale=8/Math.max(bounds.w,bounds.h)
 useEffect(()=>{const tangent=Math.tan(46*Math.PI/360);camera.position.set(0,0,Math.max(4.5,1.2*Math.max(bounds.w*scale/(2*tangent*(size.width/size.height)),bounds.h*scale/(2*tangent)))/zoom);camera.updateProjectionMatrix()},[camera,size.width,size.height,bounds,scale,zoom])
 const point=(x:number,y:number,z=0):[number,number,number]=>[(x-bounds.x-bounds.w/2)*scale,-(y-bounds.y-bounds.h/2)*scale,z]
 useFrame(()=>{if(!group.current)return;if(manualAngle!==null){group.current.rotation.set(-.1,manualAngle,0);return}if(paused)return;group.current.rotation.x=-.45+progress.current*.7;group.current.rotation.y=(progress.current-.5)*Math.PI*1.6})
 return <group ref={group} rotation={[-.22,-.35,0]}>
  <mesh position={[0,0,-.16]}><boxGeometry args={[bounds.w*scale+.3,bounds.h*scale+.3,.12]}/><meshStandardMaterial color="#102036" metalness={.5} roughness={.4}/></mesh>
  {data.wires.map((w,i)=><Line key={`${data.id}-${i}`} points={[point(w[0],w[1],.04),point(w[2],w[3],.04)]} color="#65e8ca" lineWidth={1.8} />)}
  {data.symbols.map(s=>{const kind=mosfetKind(s.kind);return <group key={`${data.id}-${s.name}`} position={point(s.x+s.width/2,s.y+s.height/2,.1)}>
   {kind?<CircuitMosfet kind={kind} width={s.width*scale} height={s.height*scale} selected={selected===s.name} onSelect={()=>onSelect(s.name)}/>:<mesh onClick={e=>{e.stopPropagation();onSelect(s.name)}}><boxGeometry args={[Math.max(.12,s.width*scale),Math.max(.12,s.height*scale),.23]}/><meshStandardMaterial color={selected===s.name?'#65e8ca':'#7763ae'} emissive={selected===s.name?'#164b41':'#171029'} emissiveIntensity={.6} metalness={.4} roughness={.3}/></mesh>}
   <Label position={kind?[0,-s.height*scale/2-.12,.16]:[0,0,.15]} size={Math.max(.13,36*scale)} text={`${s.name}${kind?kind==='nmos'?' / N':' / P':''}`} />
  </group>})}
  {data.labels.filter((_,i)=>i%Math.max(1,Math.floor(data.labels.length/24))===0).map((l,i)=><Label key={i} position={point(l.x,l.y-18,.05)} size={Math.max(.065,20*scale)} text={l.name} />)}
 </group>
}
export default function CircuitScene(props:Props){return <Canvas frameloop={props.paused?'demand':'always'} dpr={[1,1.4]} camera={{position:[0,0,10],fov:46}} gl={{alpha:true,powerPreference:'low-power'}}><ambientLight intensity={1.6}/><directionalLight position={[3,4,6]} intensity={3}/><Circuit {...props}/></Canvas>}
