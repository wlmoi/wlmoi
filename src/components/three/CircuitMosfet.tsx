import { Edges, Line } from '@react-three/drei'
import type { MosfetKind } from '../../data/circuit'
type Vec3=[number,number,number]
type Props={kind:MosfetKind;width:number;height:number;selected:boolean;onSelect:()=>void}
export function CircuitMosfet({kind,width:w,height:h,selected,onSelect}:Props){
 const diffusion=kind==='nmos'?'#63e7c3':'#d99afb'
 const body=kind==='nmos'?'#776a9c':'#557fa8'
 const metal='#96bfeb',poly='#f5bc76'
 const top:Vec3=[w*.25,h*.5,-.06],bottom:Vec3=[w*.25,-h*.5,-.06],gate:Vec3=[-w*.5,-h/3,-.06]
 return <group onClick={event=>{event.stopPropagation();onSelect()}} name={`circuit-${kind}`}>
  <mesh position={[0,0,-.035]}><boxGeometry args={[w,h,.09]}/><meshStandardMaterial color={body} roughness={.5}/>{selected?<Edges color="#e7f9ff"/>:null}</mesh>
  {kind==='pmos'?<mesh position={[0,0,-.09]}><boxGeometry args={[w*1.05,h*1.03,.04]}/><meshStandardMaterial color="#675980"/></mesh>:null}
  {[-1,1].map(side=><group key={side}>
   <mesh position={[w*.1,side*h*.24,.03]}><boxGeometry args={[w*.55,h*.23,.055]}/><meshStandardMaterial color={diffusion} emissive={diffusion} emissiveIntensity={selected?.2:.03}/></mesh>
   <mesh position={[w*.1,side*h*.24,.115]}><boxGeometry args={[w*.14,h*.09,.12]}/><meshStandardMaterial color="#d1dbe5" metalness={.6} roughness={.3}/></mesh>
  </group>)}
  <mesh position={[w*.1,0,.055]}><boxGeometry args={[w*.66,h*.13,.025]}/><meshStandardMaterial color="#b7e6ff"/></mesh>
  <mesh position={[w*.1,0,.105]}><boxGeometry args={[w*.92,h*.09,.06]}/><meshStandardMaterial color={poly} roughness={.4}/></mesh>
  <mesh position={[w*.36,-h*.16,.035]}><boxGeometry args={[w*.15,h*.09,.055]}/><meshStandardMaterial color={kind==='nmos'?'#d99afb':'#63e7c3'}/></mesh>
  <Line points={[top,[w*.25,h*.34,.17],[w*.1,h*.24,.17]]} color={metal} lineWidth={1.6}/>
  <Line points={[bottom,[w*.25,-h*.34,.17],[w*.1,-h*.24,.17]]} color={metal} lineWidth={1.6}/>
  <Line points={[gate,[-w*.43,-h/3,.05],[-w*.43,0,.105],[w*.1,0,.105]]} color={poly} lineWidth={1.4}/>
  <Line points={[[w*.25,0,-.06],[w*.49,0,-.06],[w*.49,-h*.16,.06],[w*.36,-h*.16,.06]]} color={metal} lineWidth={1.1}/>
 </group>
}
