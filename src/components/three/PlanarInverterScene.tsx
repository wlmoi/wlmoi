import { useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Edges, OrbitControls } from '@react-three/drei'
import { CanvasTexture } from 'three'
import type { OrthographicCamera } from 'three'
import type { InverterPart, InverterView, LogicInput } from '../../data/inverter'
import { inverterLogic } from '../../data/inverter'
type Vec3=[number,number,number]
type Props={input:LogicInput;selected:InverterPart;onSelect:(part:InverterPart)=>void;explode:number;metal:boolean;view:InverterView;spin:boolean;reset:number}
type BlockProps={position:Vec3;size:Vec3;color:string;part:InverterPart;selected:InverterPart;onSelect:Props['onSelect'];active?:boolean;opacity?:number}
function Block({position,size,color,part,selected,onSelect,active=false,opacity=1}:BlockProps){return <mesh name={`inverter-${part}`} position={position} onClick={event=>{event.stopPropagation();onSelect(part)}}><boxGeometry args={size}/><meshStandardMaterial color={color} metalness={part==='metal'?.65:.12} roughness={.4} transparent={opacity<1} opacity={opacity} depthWrite={opacity>=1} emissive={color} emissiveIntensity={active?.5:part===selected?.13:0}/>{part===selected?<Edges color="#e9f8ff" threshold={20}/>:null}</mesh>}
function Label({text,position,width=1.15,color='#ecf5ff'}:{text:string;position:Vec3;width?:number;color?:string}){
 const label=useMemo(()=>{const c=document.createElement('canvas');const context=c.getContext('2d')!;context.font='600 64px Arial';c.width=Math.ceil(context.measureText(text).width)+28;c.height=96;context.font='600 64px Arial';context.textAlign='center';context.textBaseline='middle';context.fillStyle=color;context.fillText(text,c.width/2,48);return {texture:new CanvasTexture(c),aspect:c.height/c.width}},[text,color])
 useEffect(()=>()=>label.texture.dispose(),[label])
 return <sprite position={position} scale={[width,width*label.aspect,1]}><spriteMaterial map={label.texture} transparent depthTest={false}/></sprite>
}
function frameCamera(camera:OrthographicCamera,position:Vec3,zoom:number,target:Vec3){camera.position.set(...position);camera.zoom=zoom;camera.lookAt(...target);camera.updateProjectionMatrix()}
function ViewRig({view,explode,reset}:{view:InverterView;explode:number;reset:number}){
 const {camera,size,invalidate}=useThree()
 useEffect(()=>{
  const p:Vec3=view==='top'?[0,16,.02]:view==='section'?[0,1.9,16]:[9.4,8.4,11.2]
  const zoom=Math.min(size.width/11.4,size.height/(5.8+explode*1.6))
  frameCamera(camera as OrthographicCamera,p,zoom,[0,.45+explode*.35,0]);invalidate()
 },[camera,size.width,size.height,view,reset,explode,invalidate])
 return null
}
function InverterWorld({input,selected,onSelect,explode,metal,view,spin,reset}:Props){
 const logic=inverterLogic(input),oxideY=.14+explode*.45,gateY=.30+explode*.9,contactY=.57+explode*1.2,metalY=1.03+explode*1.6
 const shared={selected,onSelect}
 return <>
  <ViewRig view={view} explode={explode} reset={reset}/>
  <ambientLight intensity={1.8}/><directionalLight position={[2,8,6]} intensity={3.1} color="#e1ebff"/><directionalLight position={[-6,4,-3]} intensity={1.9} color="#bca4fa"/>
  <group position={[0,-.05,0]}>
   <Block {...shared} part="body" position={[0,-.83,0]} size={[9.4,.5,3.4]} color="#393c63"/>
   <Block {...shared} part="body" position={[-2.36,-.25,0]} size={[4.68,.66,3.4]} color="#7c719f"/>
   <Block {...shared} part="body" position={[2.36,-.25,0]} size={[4.68,.66,3.4]} color="#557aa0"/>
   <Block {...shared} part="oxide" position={[0,.11,0]} size={[.22,.12,3.4]} color="#b7e6ff"/>
   {selected==='body'?<><Label text="p-SUBSTRATE" position={[-2.2,-.32,1.8]} width={2.8} color="#dbd4f1"/><Label text="n-WELL" position={[2.2,-.32,1.8]} width={2.2} color="#c1e3ff"/></>:null}
   {/* NMOS n+ source/drain; PMOS p+ drain/source. Both channels run along x. */}
   {[-3.12,-1.38].map(x=><Block key={x} {...shared} part="nmos" position={[x,-.01,0]} size={[1.04,.22,1.45]} color="#63e7c3" active={logic.nmosOn}/>)}
   {[1.38,3.12].map(x=><Block key={x} {...shared} part="pmos" position={[x,-.01,0]} size={[1.04,.22,1.45]} color="#d99afb" active={logic.pmosOn}/>)}
   <Block {...shared} part="nmos" position={[-2.25,.085,0]} size={[.72,.035,1.25]} color={logic.nmosOn?'#c9fff0':'#5b647a'} active={logic.nmosOn}/>
   <Block {...shared} part="pmos" position={[2.25,.085,0]} size={[.72,.035,1.25]} color={logic.pmosOn?'#f4d9ff':'#5b647a'} active={logic.pmosOn}/>
   {/* p+ body tap at GND and n+ well tap at VDD. */}
   <Block {...shared} part="body" position={[-4.12,-.01,0]} size={[.46,.22,.75]} color="#d99afb"/>
   <Block {...shared} part="body" position={[4.12,-.01,0]} size={[.46,.22,.75]} color="#63e7c3"/>
   {([-2.25,2.25] as const).map(x=><group key={x}>
    <Block {...shared} part="oxide" position={[x,oxideY,0]} size={[.76,.075,1.6]} color="#b7e6ff" opacity={selected==='oxide'?1:.72}/>
    <Block {...shared} part="gate" position={[x,gateY,0]} size={[.38,.22,1.95]} color="#f5bc76"/>
    {selected===(x<0?'nmos':'pmos')?<><Label text={x<0?'S / n+':'D / p+'} position={[x-.87,.23,.8]} width={.65} color={x<0?'#91f7d8':'#edb9ff'}/><Label text={x<0?'D / n+':'S / p+'} position={[x+.87,.23,.8]} width={.65} color={x<0?'#91f7d8':'#edb9ff'}/></>:null}
   </group>)}
   <Block {...shared} part="gate" position={[0,gateY,.91]} size={[4.9,.18,.22]} color="#f5bc76"/>
   <Block {...shared} part="gate" position={[0,gateY,1.32]} size={[.22,.18,1.03]} color="#f5bc76"/>
   <Label text={`A = ${input}`} position={[0,gateY+.28,1.97]} width={1.2} color="#ffce91"/>
   {metal?<group>
    {[-4.12,-3.12,-1.38,1.38,3.12,4.12].map(x=><Block key={x} {...shared} part="metal" position={[x,contactY,0]} size={[.23,.82,.28]} color="#bccddb"/>)}
    <Block {...shared} part="metal" position={[-3.62,metalY,0]} size={[1.65,.2,.52]} color="#83b9f2"/>
    <Block {...shared} part="metal" position={[3.62,metalY,0]} size={[1.65,.2,.52]} color="#83b9f2"/>
    <Block {...shared} part="metal" position={[0,metalY,0]} size={[3.0,.2,.43]} color={logic.output?'#dbb4f8':'#8ce9d0'} active/>
    <Block {...shared} part="metal" position={[0,metalY,-.92]} size={[.28,.2,1.93]} color={logic.output?'#dbb4f8':'#8ce9d0'} active/>
    <Label text="GND" position={[-3.62,metalY+.42,0]} width={1} color="#b7ddff"/>
    <Label text="VDD" position={[3.62,metalY+.42,0]} width={1.2} color="#b7ddff"/>
    <Label text={`Y = ${logic.output}`} position={[0,metalY+.25,-2.1]} width={1.4} color={logic.output?'#edc7ff':'#a9ffe5'}/>
   </group>:null}
   {selected!=='body'?<><Label text="NMOS" position={[-2.3,-.12,2.1]} width={1.6} color="#91f7d8"/><Label text="PMOS" position={[2.3,-.12,2.1]} width={1.6} color="#edb9ff"/></>:null}
  </group>
  <OrbitControls key={`${view}-${reset}`} makeDefault target={[0,.45+explode*.35,0]} enablePan={false} enableZoom={false} enableDamping autoRotate={spin} autoRotateSpeed={.65} minPolarAngle={.035} maxPolarAngle={Math.PI*.495}/>
 </>
}
export default function PlanarInverterScene(props:Props){return <Canvas orthographic dpr={[1,1.5]} frameloop={props.spin?'always':'demand'} camera={{position:[9.4,8.4,11.2],zoom:65}} gl={{alpha:true,antialias:true,powerPreference:'low-power'}}><InverterWorld {...props}/></Canvas>}
