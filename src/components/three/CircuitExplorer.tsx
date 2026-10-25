import { PlanarInverter } from './PlanarInverter'
import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import schematics from '../../data/schematics.json'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useIntersection } from '../../hooks/useIntersection'
import { ScrollTrigger } from '../../lib/gsap'
const CircuitScene=lazy(()=>import('./CircuitScene'))
import { circuitBounds, mosfetKind } from '../../data/circuit'
class CircuitBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{
 state={failed:false};static getDerivedStateFromError(){return{failed:true}};render(){return this.state.failed?this.props.fallback:this.props.children}
}
export function CircuitExplorer(){
 const [id,setId]=useState('Q4_carry'),[selected,setSelected]=useState(''),[supported,setSupported]=useState(false),[paused,setPaused]=useState(false),[manualAngle,setManualAngle]=useState<number|null>(null),[zoom,setZoom]=useState(1)
 const reduced=useReducedMotion(),progress=useRef(0)
 const {ref:libraryRef,visible}=useIntersection<HTMLDivElement>({rootMargin:'100px'})
 useEffect(()=>{const select=(event:Event)=>{if((event as CustomEvent<string>).detail==='Cell_INV'){setId('Cell_INV');setSelected('MP')}};window.addEventListener('select-schematic',select);return()=>window.removeEventListener('select-schematic',select)},[])
 const data=schematics.find(s=>s.id===id)!,bounds=circuitBounds(data)
 useEffect(()=>{if(!visible||reduced)return;const frame=requestAnimationFrame(()=>{try{const c=document.createElement('canvas'),gl=c.getContext('webgl2');setSupported(Boolean(gl));gl?.getExtension('WEBGL_lose_context')?.loseContext()}catch{/* SVG remains available. */}});return()=>cancelAnimationFrame(frame)},[visible,reduced])
 useEffect(()=>{if(reduced||!libraryRef.current)return;const trigger=ScrollTrigger.create({trigger:libraryRef.current,start:'top bottom',end:'bottom top',onUpdate:self=>{progress.current=self.progress}});return()=>trigger.kill()},[libraryRef,reduced])
 const component=data.symbols.find(s=>s.name===selected)
 const selectedMosfet=component?mosfetKind(component.kind):null
 const fallback=<svg style={{transform:`scale(${zoom})`,transformOrigin:'center'}} viewBox={`${bounds.x} ${bounds.y} ${bounds.w} ${bounds.h}`} className="circuit-static" aria-label="Original LTspice wire coordinates">
  {data.wires.map((w,i)=><line key={i} x1={w[0]} y1={w[1]} x2={w[2]} y2={w[3]} stroke="#65e8ca" strokeWidth="4" />)}
  {data.symbols.map(s=>{const kind=mosfetKind(s.kind);const color=kind==='nmos'?'#63e7c3':'#d99afb';return <g key={s.name} role="button" tabIndex={0} aria-label={`Inspect ${s.name} ${s.kind}`} aria-pressed={selected===s.name} onClick={()=>setSelected(s.name)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(s.name)}}}>
   <rect x={s.x} y={s.y} width={s.width} height={s.height} rx="8" fill={kind?kind==='nmos'?'#6e618f':'#4f7297':selected===s.name?'#226252':'#1d324c'} stroke={selected===s.name?'#e5fff5':'#b7a2ff'} strokeWidth="3"/>
   {kind?<><rect x={s.x+s.width*.32} y={s.y+s.height*.14} width={s.width*.55} height={s.height*.22} fill={color}/><rect x={s.x+s.width*.32} y={s.y+s.height*.63} width={s.width*.55} height={s.height*.22} fill={color}/><rect x={s.x+s.width*.24} y={s.y+s.height*.43} width={s.width*.7} height={s.height*.08} fill="#b7e6ff"/><path d={`M${s.x} ${s.y+80}H${s.x+s.width*.12}V${s.y+s.height*.48}H${s.x+s.width*.9}`} fill="none" stroke="#f5bc76" strokeWidth="5"/><text x={s.x+6} y={s.y+s.height+27} fill="white" fontSize="20">{s.name} / {kind==='nmos'?'N':'P'}</text></>:<text x={s.x+8} y={s.y+s.height/2} fill="white" fontSize="23">{s.name}</text>}
  </g>})}
 </svg>
 return <section id="schematics" className="section-pad border-t border-white/[0.1]">
  <div className="section-shell"><p className="eyebrow">CIRCUIT ATLAS / EL5013</p><div className="circuit-intro"><h2>From a transistor<br />to a carry chain.</h2><p>Explore 15 of my IC-design schematics with their original wire coordinates. NMOS and PMOS symbols now show physical layers; select a transistor to inspect it, or open the larger planar CMOS study below.</p></div>
   <div id="schematic-library" ref={libraryRef} className="circuit-card" data-circuit={id}><div className="circuit-toolbar"><label htmlFor="schematic-select">Choose a schematic<select id="schematic-select" value={id} onChange={e=>{setId(e.target.value);setSelected('')}}>{schematics.map(s=><option key={s.id} value={s.id}>{s.id.replaceAll('_',' ')}</option>)}</select></label><button type="button" onClick={()=>{setId('Cell_INV');setSelected('MN');setZoom(1);setManualAngle(0);setPaused(true)}}>NMOS / PMOS example</button><button type="button" disabled={!supported||reduced} onClick={()=>{setPaused(p=>!p);setManualAngle(null)}} aria-pressed={paused}>{paused?'Resume scroll rotation':'Pause scroll rotation'}</button></div>
    <div className="circuit-viewport" role="group" aria-label="Interactive 3D schematic">
     {supported&&!reduced&&visible?<CircuitBoundary fallback={fallback}><Suspense fallback={fallback}><CircuitScene data={data} progress={progress} paused={paused} manualAngle={manualAngle} zoom={zoom} selected={selected} onSelect={setSelected}/></Suspense></CircuitBoundary>:fallback}
     <span className="circuit-view-label">{supported&&!reduced?'THREE.JS / SCROLL TO ROTATE':'2D SCHEMATIC / STILL VIEW'}</span>
    </div>
    {supported&&!reduced?<div className="circuit-turn-controls" role="group" aria-label="Rotate schematic"><button type="button" onClick={()=>{setPaused(true);setManualAngle(value=>(value??progress.current*Math.PI*1.6-Math.PI*.8)-Math.PI/6)}}>Rotate left</button><button type="button" onClick={()=>{setPaused(true);setManualAngle(0)}}>Front view</button><button type="button" onClick={()=>{setPaused(true);setManualAngle(value=>(value??progress.current*Math.PI*1.6-Math.PI*.8)+Math.PI/6)}}>Rotate right</button></div>:null}
    <div className="circuit-detail-tools"><label>Detail zoom <input aria-label="Circuit detail zoom" type="range" min=".8" max="2" step=".1" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/><output>{zoom.toFixed(1)}×</output></label><span><i style={{background:'#63e7c3'}}/> n+ <i style={{background:'#d99afb'}}/> p+ <i style={{background:'#f5bc76'}}/> Gate</span></div>
    <div className="circuit-info"><div><h3>{data.title}</h3><p>{data.wires.length} wire segments · {data.symbols.length} components · {data.labels.length} net labels</p></div><a href={`/schematics/${id}.asc`} download>Download LTspice source ↗</a></div>
    <div className="circuit-components" role="group" aria-label="Schematic components">{data.symbols.map(s=><button key={s.name} type="button" aria-pressed={selected===s.name} onClick={()=>setSelected(s.name)}>{s.name} <span>{s.kind}</span></button>)}</div>
    <a className="circuit-archive" href="/schematics/EL5013-LTspice-schematics.zip" download>Download complete schematics, symbols and simulation sources (.zip) ↗</a>
    {selectedMosfet&&component?<div className="circuit-mosfet-inspector"><div><span>{selectedMosfet.toUpperCase()} / {component.name}</span><p>{selectedMosfet==='nmos'?'n+ source and drain in a p-type body':'p+ source and drain in an n-well'}. The model shows oxide, gate, contacts, and separate body connection.</p></div><a href="#planar-inverter" onClick={()=>window.dispatchEvent(new CustomEvent('inspect-transistor',{detail:selectedMosfet}))}>Explore {selectedMosfet.toUpperCase()} layers ↗</a></div>:null}
    <p className="circuit-inspector" aria-live="polite">{selected?`${selected}: ${data.symbols.find(s=>s.name===selected)?.kind} · Source position (${data.symbols.find(s=>s.name===selected)?.x}, ${data.symbols.find(s=>s.name===selected)?.y})`:'Select a component above or tap its 3D block.'}</p>
   </div>
   <PlanarInverter />
  </div>
 </section>
}
