import { Component, Suspense, lazy, useCallback, useEffect, useId, useState } from 'react'
import type { ReactNode } from 'react'
import { MoveUpRight, Pause, Play, Sparkles } from 'lucide-react'
import { fluidEffects } from '../../data/fluid'
import type { FluidEffect } from '../../data/fluid'
import { useIntersection } from '../../hooks/useIntersection'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const FluidScene=lazy(()=>import('./FluidScene'))

function hasFluidSupport() {
  try {
    const canvas=document.createElement('canvas')
    const context=canvas.getContext('webgl2')
    if(!context)return false
    const supported=Boolean(context.getExtension('EXT_color_buffer_float'))
    context.getExtension('WEBGL_lose_context')?.loseContext()
    return supported
  } catch { return false }
}

function StaticParticles({ effect }: { effect: FluidEffect }) {
  const shapes=effect==='combined' ? ['lattice','trefoil','vortex'] as const : [effect]
  return <svg className="fluid-static" viewBox="0 0 480 360" aria-hidden="true">
    {shapes.map(shape=><g key={shape} opacity={effect==='combined'?.7:1}>{Array.from({length:240},(_,i)=>{
      const t=i/240*Math.PI*2
      let x:number,y:number
      if(shape==='lattice') {const cell=i%16;x=150+(cell%4)*60+Math.sin(i*2.39)*19;y=105+Math.floor(cell/4)*49+Math.cos(i*3.1)*16}
      else if(shape==='trefoil'){x=240+(2+Math.cos(3*t))*Math.cos(2*t)*47;y=180+(2+Math.cos(3*t))*Math.sin(2*t)*47}
      else {const radius=30+Math.sqrt(i/240)*139;x=240+Math.cos(t*5)*radius;y=180+Math.sin(t*5)*radius*.7}
      return <circle key={i} cx={x} cy={y} r={i%7===0?2:1.2} fill={shape==='lattice'?'#65e8ca':shape==='trefoil'?'#ac95ff':'#6db9f4'} opacity={.45+(i%5)*.1} />
    })}</g>)}
    {(effect==='lattice'||effect==='combined')?Array.from({length:16},(_,i)=><rect key={i} x={126+(i%4)*60} y={83+Math.floor(i/4)*49} width="47" height="37" rx="5" fill="none" stroke="#65e8ca" strokeOpacity=".2" />):null}
  </svg>
}

class FluidBoundary extends Component<{children:ReactNode;fallback:ReactNode;onFailure:()=>void},{failed:boolean}> {
  state={failed:false}
  static getDerivedStateFromError(){return {failed:true}}
  componentDidCatch(){this.props.onFailure()}
  render(){return this.state.failed?this.props.fallback:this.props.children}
}

type Props={title:string;initialEffect?:FluidEffect;compact?:boolean;stage?:number;className?:string;layoutLink?:boolean}

export function FluidShowcase({title,initialEffect='combined',compact=false,stage=0,className='',layoutLink=false}:Props) {
  const {ref,visible}=useIntersection<HTMLElement>({rootMargin:'100px 0px',threshold:0})
  const reducedMotion=useReducedMotion()
  const [support,setSupport]=useState<'pending'|'supported'|'unavailable'>('pending')
  const [effect,setEffect]=useState<FluidEffect>(initialEffect)
  const [ready,setReady]=useState(false)
  const markReady=useCallback(()=>setReady(true),[])
  const fail=useCallback(()=>setSupport('unavailable'),[])
  const [paused,setPaused]=useState(false)
  const [strength,setStrength]=useState(.75)
  const [pulse,setPulse]=useState(0)
  const [tabVisible,setTabVisible]=useState(()=>!document.hidden)
  const [narrow,setNarrow]=useState(()=>window.matchMedia('(max-width: 767px)').matches)
  const rangeId=useId()
  useEffect(()=>{
    if(!visible||reducedMotion||support!=='pending')return
    const frame=requestAnimationFrame(()=>setSupport(hasFluidSupport()?'supported':'unavailable'))
    return ()=>cancelAnimationFrame(frame)
  },[visible,reducedMotion,support])
  useEffect(()=>{
    const change=()=>setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange',change)
    const media=window.matchMedia('(max-width: 767px)')
    const resize=()=>setNarrow(media.matches)
    media.addEventListener('change',resize)
    return ()=>{document.removeEventListener('visibilitychange',change);media.removeEventListener('change',resize)}
  },[])
  const active=support==='supported'&&!reducedMotion&&visible&&tabVisible
  const stopped=paused||reducedMotion||!tabVisible
  const description=fluidEffects.find(item=>item.id===effect)?.description
  const fallback=<StaticParticles effect={effect} />

  return <figure ref={ref} className={`fluid-showcase ${compact?'fluid-showcase-compact':''} ${className}`} data-fluid-effect={effect} data-fluid-state={active ? !ready?'loading':paused?'paused':'live':'still'} aria-label={title}>
    <div className="fluid-heading"><div><p>PARTICLE STUDY / 0{stage+1}</p><h3>{title}</h3></div><span className="fluid-state"><i />{active ? !ready?'Loading':paused?'Paused':'Live flow':reducedMotion?'Still view':support==='unavailable'?'Still view':'Particle study'}</span></div>
    <div className="fluid-effect-tabs" role="group" aria-label={`${title} particle effects`}>
      {fluidEffects.map(item=><button type="button" key={item.id} aria-pressed={effect===item.id} onClick={()=>setEffect(item.id)}>{item.label}</button>)}
    </div>
    <div className="fluid-viewport" role="img" aria-label={`${title}: ${effect} particle visualization, move the pointer to bend the flow`}>
      <div className="fluid-halo" aria-hidden="true" />
      {active ? <FluidBoundary fallback={fallback} onFailure={fail}><Suspense fallback={fallback}><FluidScene effect={effect} paused={stopped} strength={strength} pulse={pulse} stage={stage} compact={compact||narrow} onReady={markReady} onFailure={fail} /></Suspense></FluidBoundary>:fallback}
      {(effect==='lattice'||effect==='combined')?<div className="fluid-ports" aria-hidden="true"><span>Serial host</span><span>SRAM</span><span>Controller</span></div>:null}
      <div className="fluid-viewport-hint" aria-hidden="true">{active&&!paused?'Move to shape the flow':'Form, connection, computation'}</div>
    </div>
    <figcaption className="fluid-description" aria-live="polite">{description}</figcaption>
    <div className="fluid-controls">
      <label htmlFor={rangeId}>Flow <input id={rangeId} aria-label={`${title} flow strength`} type="range" min=".2" max="1.4" step=".1" value={strength} onChange={event=>setStrength(Number(event.target.value))} disabled={!active||!ready||paused} /></label>
      <div><button type="button" disabled={!active||!ready||paused} onClick={()=>setPulse(value=>value+1)} aria-label={`${title} send pulse`}><Sparkles size={13} aria-hidden="true" /> Pulse</button>{!reducedMotion?<button type="button" onClick={()=>setPaused(value=>!value)} aria-label={`${paused?'Resume':'Pause'} ${title} particles`}>{paused?<Play size={13} aria-hidden="true" />:<Pause size={13} aria-hidden="true" />}{paused?'Resume':'Pause'}</button>:null}</div>
    </div>
    {layoutLink?<button type="button" className="fluid-layout-link" data-zoom-src="/GDSLayouting.png" data-zoom-alt="Actual GF180MCU GAN accelerator GDS layout">View actual GDS layout <MoveUpRight size={13} aria-hidden="true" /></button>:null}
    <p className="fluid-footnote">Illustrative motion · Engineering results are reported separately.</p>
  </figure>
}
