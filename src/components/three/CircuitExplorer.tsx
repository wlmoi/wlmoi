import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import schematics from '../../data/schematics.json'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useIntersection } from '../../hooks/useIntersection'
import { ScrollTrigger } from '../../lib/gsap'
const CircuitScene=lazy(()=>import('./CircuitScene'))
import { circuitBounds } from '../../data/circuit'
class CircuitBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{
 state={failed:false};static getDerivedStateFromError(){return{failed:true}};render(){return this.state.failed?this.props.fallback:this.props.children}
}
export function CircuitExplorer(){
 const [id,setId]=useState('Q4_carry'),[selected,setSelected]=useState(''),[supported,setSupported]=useState(false),[paused,setPaused]=useState(false)
 const reduced=useReducedMotion(),progress=useRef(0)
 const {ref,visible}=useIntersection<HTMLElement>({rootMargin:'100px'})
 const data=schematics.find(s=>s.id===id)!,bounds=circuitBounds(data)
 useEffect(()=>{if(!visible||reduced)return;const frame=requestAnimationFrame(()=>{try{const c=document.createElement('canvas'),gl=c.getContext('webgl2');setSupported(Boolean(gl));gl?.getExtension('WEBGL_lose_context')?.loseContext()}catch{/* SVG remains available. */}});return()=>cancelAnimationFrame(frame)},[visible,reduced])
 useEffect(()=>{if(reduced||!ref.current)return;const trigger=ScrollTrigger.create({trigger:ref.current,start:'top bottom',end:'bottom top',onUpdate:self=>{progress.current=self.progress}});return()=>trigger.kill()},[ref,reduced])
 const fallback=<svg viewBox={`${bounds.x} ${bounds.y} ${bounds.w} ${bounds.h}`} className="circuit-static" aria-label="Original LTspice wire coordinates">
  {data.wires.map((w,i)=><line key={i} x1={w[0]} y1={w[1]} x2={w[2]} y2={w[3]} stroke="#65e8ca" strokeWidth="4" />)}
  {data.symbols.map(s=><g key={s.name}><rect x={s.x} y={s.y} width={s.width} height={s.height} rx="8" fill="#1d324c" stroke="#b7a2ff" strokeWidth="3"/><text x={s.x+8} y={s.y+s.height/2} fill="white" fontSize="23">{s.name}</text></g>)}
 </svg>
 return <section id="schematics" ref={ref} className="section-pad border-t border-white/[0.1]">
  <div className="section-shell"><p className="eyebrow">CIRCUIT ATLAS / EL5013</p><div className="circuit-intro"><h2>From a transistor<br />to a carry chain.</h2><p>Explore 15 of my IC-design schematics. Scroll to turn the circuit in space, then select a component to inspect it. Traces follow the original LTspice coordinates; component blocks are illustrative.</p></div>
   <div className="circuit-card" data-circuit={id}><div className="circuit-toolbar"><label htmlFor="schematic-select">Choose a schematic<select id="schematic-select" value={id} onChange={e=>{setId(e.target.value);setSelected('')}}>{schematics.map(s=><option key={s.id} value={s.id}>{s.id.replaceAll('_',' ')}</option>)}</select></label><button type="button" onClick={()=>setPaused(p=>!p)} aria-pressed={paused}>{paused?'Resume scroll rotation':'Pause scroll rotation'}</button></div>
    <div className="circuit-viewport" role="group" aria-label="Interactive 3D schematic">
     {supported&&!reduced&&visible?<CircuitBoundary fallback={fallback}><Suspense fallback={fallback}><CircuitScene data={data} progress={progress} paused={paused} selected={selected} onSelect={setSelected}/></Suspense></CircuitBoundary>:fallback}
     <span className="circuit-view-label">{supported&&!reduced?'THREE.JS / SCROLL TO ROTATE':'2D SCHEMATIC / STILL VIEW'}</span>
    </div>
    <div className="circuit-info"><div><h3>{data.title}</h3><p>{data.wires.length} wire segments · {data.symbols.length} components · {data.labels.length} net labels</p></div><a href={`/schematics/${id}.asc`} download>Download LTspice source ↗</a></div>
    <div className="circuit-components" role="group" aria-label="Schematic components">{data.symbols.map(s=><button key={s.name} type="button" aria-pressed={selected===s.name} onClick={()=>setSelected(s.name)}>{s.name} <span>{s.kind}</span></button>)}</div>
    <a className="circuit-archive" href="/schematics/EL5013-LTspice-schematics.zip" download>Download complete schematics, symbols and simulation sources (.zip) ↗</a>
    <p className="circuit-inspector" aria-live="polite">{selected?`${selected}: ${data.symbols.find(s=>s.name===selected)?.kind} · Source position (${data.symbols.find(s=>s.name===selected)?.x}, ${data.symbols.find(s=>s.name===selected)?.y})`:'Select a component above or tap its 3D block.'}</p>
   </div>
  </div>
 </section>
}
