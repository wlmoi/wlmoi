import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { ArrowUpRight, Volume2, VolumeX } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useIntersection } from '../../hooks/useIntersection'
import { useKeyboardSound } from '../../hooks/useKeyboardSound'
import { keyboardSkills } from '../../data/keyboard'
import type { HeroSceneMode } from '../../data/keyboard'
import { siliconBoardModuleIds } from '../../data/heroBoard'
import type { SiliconBoardModuleId } from '../../data/heroBoard'

function paintFallbackOrbit(element: HTMLDivElement | null, pose: { pitch: number; yaw: number; zoom: number }) {
  if (element) element.style.transform = `perspective(850px) rotateX(${pose.pitch}deg) rotateY(${pose.yaw}deg) scale(${pose.zoom})`
}

const HeroScene = lazy(() => import('./HeroScene'))

function supportsScene() {
  try {
    const probe = document.createElement('canvas')
    const context = probe.getContext('webgl2')
    if (!context) return false
    context.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch { return false }
}

function VolumeFaces() {
  return <span className="model-volume" aria-hidden="true"><i className="volume-bottom" /><i className="volume-front" /><i className="volume-back" /><i className="volume-left" /><i className="volume-right" /></span>
}
function ChipFallback({ paused, selectedPart, onSelect }: { paused: boolean; selectedPart: SiliconBoardModuleId; onSelect: (id: SiliconBoardModuleId) => void }) {
  const [hoveredPart, setHoveredPart] = useState<SiliconBoardModuleId | null>(null)
  const activePart = hoveredPart ?? selectedPart
  const hotspots = [
    { id: 'compute', region: 'compute', name: 'compute area' },
    { id: 'memory', region: 'memory-left', name: 'memory area' },
    { id: 'memory', region: 'memory-right', name: 'memory area' },
    { id: 'control', region: 'control', name: 'input and output area' },
  ] as const
  return <div className={`chip-fallback ${paused ? 'is-paused' : ''}`} data-selected-part={activePart}>
    <div className="chip-orbit chip-orbit-one" aria-hidden="true" /><div className="chip-orbit chip-orbit-two" aria-hidden="true" />
    <div className="chip-board" onPointerEnter={() => setHoveredPart('implementation')} onPointerLeave={() => setHoveredPart(null)} onClick={() => onSelect('implementation')}>
      <VolumeFaces /><div className="chip-traces" aria-hidden="true" />
      <div className="chip-memory chip-memory-left" aria-hidden="true"><i /><i /><i /><i /></div><div className="chip-memory chip-memory-right" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="chip-io chip-io-top" aria-hidden="true"><i /><i /><i /><i /><i /></div><div className="chip-io chip-io-bottom" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className="chip-package"><VolumeFaces /><div>{Array.from({length:16},(_,i)=><i key={i} />)}</div></div>
      <div className="chip-hotspots">
        {hotspots.map(hotspot => <button key={hotspot.region} type="button" className={`chip-hotspot chip-hotspot-${hotspot.region}`} aria-label={`Highlight ${hotspot.name}`} aria-pressed={selectedPart === hotspot.id} onPointerEnter={() => setHoveredPart(hotspot.id)} onPointerLeave={() => setHoveredPart(current => current === hotspot.id ? 'implementation' : current)} onFocus={() => setHoveredPart(hotspot.id)} onBlur={() => setHoveredPart(null)} onClick={event => { event.stopPropagation(); onSelect(hotspot.id) }} />)}
      </div>
    </div>
  </div>
}

function KeyboardFallback({ selectedId, onSelect, paused }: { selectedId: string; onSelect: (id: string) => void; paused: boolean }) {
  return <div className={`keyboard-fallback ${paused ? 'is-paused' : ''}`}>
    <div className="keyboard-case" role="group" aria-label="Skills keyboard keys"><VolumeFaces />{keyboardSkills.map(skill=><button type="button" key={skill.id} className="keyboard-key" aria-label={`Explore ${skill.name}`} aria-pressed={selectedId === skill.id} onClick={()=>onSelect(skill.id)} style={{'--key-color':skill.color} as CSSProperties}><VolumeFaces /><strong>{skill.legend}</strong><small>{skill.shortcut.toUpperCase()}</small></button>)}</div>
  </div>
}

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFailure() }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

export function HeroStage() {
  const reducedMotion = useReducedMotion()
  const { ref, visible } = useIntersection<HTMLDivElement>({ threshold: .05 })
  const [viewVersion, setViewVersion] = useState(0)
  const fallbackOrbit = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef({ x: 0, y: 0, startX: 0, startY: 0, yaw: 0, pitch: 0, moved: false, pointerId: -1, zoom: 1, pinchDistance: 0, startZoom: 1 })
  const [canRender, setCanRender] = useState(supportsScene)
  const [mode, setMode] = useState<HeroSceneMode>('keyboard')
  const [selectedId, setSelectedId] = useState('python')
  const [selectedBoardModule, setSelectedBoardModule] = useState<SiliconBoardModuleId>('compute')
  const [pressCount, setPressCount] = useState(0)
  const sound = useKeyboardSound()

  useEffect(() => {
    const node = viewport.current
    if (!node || canRender) return
    const wheel = (event: WheelEvent) => {
      event.preventDefault()
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? node.clientHeight : 1)
      gesture.current.zoom = Math.max(0.4, Math.min(3.5, gesture.current.zoom * Math.exp(-delta * 0.0015)))
      paintFallbackOrbit(fallbackOrbit.current, gesture.current)
    }
    node.addEventListener('wheel', wheel, { passive: false })
    return () => node.removeEventListener('wheel', wheel)
  }, [canRender])
  function resetOrientation() {
    gesture.current.yaw=0;gesture.current.pitch=0;gesture.current.zoom=1
    gesture.current.pinchDistance=0;gesture.current.pointerId=-1;pointers.current.clear()
  }
  const stopped = reducedMotion || !visible
  const selected = keyboardSkills.find(skill=>skill.id===selectedId) ?? keyboardSkills[5]
  const selectSkill = (id: string, withSound = true) => {
    setSelectedId(id)
    setPressCount(count=>count+1)
    if (withSound) sound.play(Math.max(0, keyboardSkills.findIndex(skill=>skill.id===id)))
  }
  const fallback = mode === 'keyboard' ? <KeyboardFallback selectedId={selectedId} onSelect={selectSkill} paused={stopped} /> : <ChipFallback paused={stopped} selectedPart={selectedBoardModule} onSelect={setSelectedBoardModule} />
  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.repeat || event.target instanceof HTMLSelectElement || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
    if (mode === 'silicon') {
      const index = Number(event.key) - 1
      const moduleId = siliconBoardModuleIds[index]
      if (moduleId) { event.preventDefault(); setSelectedBoardModule(moduleId) }
      return
    }
    const skill = keyboardSkills.find(item=>item.shortcut===event.key.toLowerCase())
    if (skill) { event.preventDefault(); selectSkill(skill.id) }
  }

  return <div ref={ref} className={`hero-stage keyboard-stage is-rotating ${stopped ? 'is-still' : ''} ${mode === 'keyboard' ? 'is-keyboard' : 'is-silicon'}`} onKeyDown={handleKey}>
    <div className="stage-corner stage-corner-top" /><div className="stage-corner stage-corner-bottom" />
    <div className="stage-mode-switch" role="group" aria-label="Choose 3D scene"><button type="button" aria-pressed={mode==='keyboard'} onClick={()=>{setMode('keyboard');resetOrientation()}}>Skills keyboard</button><button type="button" aria-pressed={mode==='silicon'} onClick={()=>{setMode('silicon');resetOrientation()}}>Silicon board</button></div>
    <div ref={viewport} className="hero-stage-canvas" data-renderer={canRender ? 'webgl' : 'fallback'} tabIndex={0} role="group" aria-label={mode==='keyboard' ? 'Interactive skills keyboard. Click a key or use Q W E R T, A S D F G, Z X C V B while focused.' : 'Illustrative 3D silicon board. Hover or click components to change their glow; focus the board and press 1 to 4 to select a highlight.'} onPointerDown={event=>{
        gesture.current.moved=false
        if(event.target instanceof HTMLCanvasElement)event.currentTarget.focus({preventScroll:true})
        if(canRender) return
        pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY})
        if(pointers.current.size===2){
          const [a,b]=[...pointers.current.values()]
          gesture.current.pinchDistance=Math.hypot(a.x-b.x,a.y-b.y)
          gesture.current.startZoom=gesture.current.zoom
          gesture.current.moved=true
          event.currentTarget.setPointerCapture(event.pointerId)
          return
        }
        gesture.current.x=event.clientX;gesture.current.y=event.clientY
        gesture.current.startX=gesture.current.yaw;gesture.current.startY=gesture.current.pitch
        gesture.current.pointerId=event.pointerId
      }}
      onPointerMove={event=>{
        if(canRender || !pointers.current.has(event.pointerId)) return
        pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY})
        if(pointers.current.size>=2){
          const [a,b]=[...pointers.current.values()]
          const distance=Math.hypot(a.x-b.x,a.y-b.y)
          gesture.current.zoom=Math.max(.4,Math.min(3.5,gesture.current.startZoom*distance/Math.max(1,gesture.current.pinchDistance)))
          gesture.current.moved=true
          paintFallbackOrbit(fallbackOrbit.current,gesture.current)
          return
        }
        const dx=event.clientX-gesture.current.x,dy=event.clientY-gesture.current.y
        if(Math.hypot(dx,dy)>8){gesture.current.moved=true;event.currentTarget.setPointerCapture(event.pointerId)}
        gesture.current.yaw=gesture.current.startX+dx*.45
        gesture.current.pitch=gesture.current.startY-dy*.3
        paintFallbackOrbit(fallbackOrbit.current,gesture.current)
      }}
      onPointerUp={event=>{
        pointers.current.delete(event.pointerId)
        const remaining=[...pointers.current.entries()][0]
        if(remaining){gesture.current.pointerId=remaining[0];gesture.current.x=remaining[1].x;gesture.current.y=remaining[1].y;gesture.current.startX=gesture.current.yaw;gesture.current.startY=gesture.current.pitch}
        else gesture.current.pointerId=-1
      }} onPointerCancel={()=>{pointers.current.clear();gesture.current.pointerId=-1}} onClickCapture={event=>{if(gesture.current.moved){event.preventDefault();event.stopPropagation()}}}>
      {canRender ? <SceneBoundary fallback={fallback} onFailure={()=>setCanRender(false)}><Suspense fallback={fallback}><HeroScene key={`${mode}-${viewVersion}`} paused={stopped} mode={mode} selectedId={selectedId} pressCount={pressCount} onSelect={selectSkill} selectedBoardModule={selectedBoardModule} onBoardModuleSelect={setSelectedBoardModule} /></Suspense></SceneBoundary> : <div key={`${mode}-${viewVersion}`} ref={fallbackOrbit} className="hero-fallback-orbit">{fallback}</div>}
    </div>
    {mode==='keyboard' ? <div className="keyboard-inspector">
      <div className="keyboard-selection"><label htmlFor="keyboard-skill">Explore a skill</label><select id="keyboard-skill" value={selectedId} onChange={event=>selectSkill(event.target.value,false)}>{keyboardSkills.map(skill=><option key={skill.id} value={skill.id}>{skill.name}</option>)}</select></div>
      <div className="keyboard-skill-copy"><p aria-live="polite" aria-atomic="true"><strong className="sr-only">{selected.name}: </strong>{selected.detail}</p><a href={`#capability-${selected.capability}`} onClick={()=>{const detail=document.getElementById(`capability-${selected.capability}`);if(detail instanceof HTMLDetailsElement)detail.open=true}}>Explore expertise <ArrowUpRight size={12} aria-hidden="true" /></a></div>
      <div className="keyboard-audio"><button type="button" onClick={sound.preview}>Test sound</button><label>Volume <input aria-label="Keyboard volume" type="range" min=".1" max="1" step=".05" value={sound.volume} onChange={event=>sound.setVolume(Number(event.target.value))} /></label></div>
    </div> : null}
    <div className="stage-bottomline">
      {mode === 'keyboard' ? <span className="stage-gesture-hint">Drag to rotate · select a key to explore</span> : null}
      <div className="stage-controls"><button type="button" onClick={()=>{setViewVersion(value=>value+1);resetOrientation()}}>Reset view</button>
        {mode==='keyboard' ? <button type="button" onClick={sound.toggle} aria-pressed={sound.enabled} aria-label={sound.enabled ? 'Mute keyboard sound' : 'Enable keyboard sound'} title={sound.enabled ? 'Mute keyboard sound' : 'Enable keyboard sound'}>{sound.enabled ? <Volume2 size={13} aria-hidden="true" /> : <VolumeX size={13} aria-hidden="true" />}<span>Sound {sound.enabled ? 'on' : 'off'}</span></button> : null}

      </div>
    </div>
  </div>
}
