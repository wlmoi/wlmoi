import { Component, Suspense, lazy, useEffect, useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { ArrowUpRight, Maximize2, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useIntersection } from '../../hooks/useIntersection'
import { useKeyboardSound } from '../../hooks/useKeyboardSound'
import { keyboardSkills } from '../../data/keyboard'
import type { HeroSceneMode } from '../../data/keyboard'

const HeroScene = lazy(() => import('./HeroScene'))

function supportsScene() {
  if (!window.matchMedia('(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches || (navigator.hardwareConcurrency || 8) <= 4) return false
  try {
    const probe = document.createElement('canvas')
    const context = probe.getContext('webgl2')
    if (!context) return false
    context.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch { return false }
}

function ChipFallback({ paused }: { paused: boolean }) {
  return <div className={`chip-fallback ${paused ? 'is-paused' : ''}`} aria-hidden="true">
    <div className="chip-orbit chip-orbit-one" /><div className="chip-orbit chip-orbit-two" />
    <div className="chip-board"><div className="chip-traces" /><div className="chip-package"><span>WA / COMPUTE</span><div>{Array.from({length:16},(_,i)=><i key={i} />)}</div><small>HARDWARE × INTELLIGENCE</small></div></div>
  </div>
}

function KeyboardFallback({ selectedId, onSelect, paused }: { selectedId: string; onSelect: (id: string) => void; paused: boolean }) {
  return <div className={`keyboard-fallback ${paused ? 'is-paused' : ''}`}>
    <div className="keyboard-case" role="group" aria-label="Skills keyboard keys">{keyboardSkills.map(skill=><button type="button" key={skill.id} className="keyboard-key" aria-label={`Explore ${skill.name}`} aria-pressed={selectedId === skill.id} onClick={()=>onSelect(skill.id)} style={{'--key-color':skill.color} as CSSProperties}><strong>{skill.legend}</strong><small>{skill.shortcut.toUpperCase()}</small></button>)}</div>
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
  const [paused, setPaused] = useState(false)
  const [canRender, setCanRender] = useState(supportsScene)
  const [mode, setMode] = useState<HeroSceneMode>('keyboard')
  const [selectedId, setSelectedId] = useState('python')
  const [pressCount, setPressCount] = useState(0)
  const sound = useKeyboardSound()
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    const update = () => setCanRender(supportsScene())
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const stopped = paused || reducedMotion || !visible
  const selected = keyboardSkills.find(skill=>skill.id===selectedId) ?? keyboardSkills[5]
  const selectSkill = (id: string, withSound = true) => {
    setSelectedId(id)
    setPressCount(count=>count+1)
    if (withSound) sound.play(Math.max(0, keyboardSkills.findIndex(skill=>skill.id===id)))
  }
  const fallback = mode === 'keyboard' ? <KeyboardFallback selectedId={selectedId} onSelect={selectSkill} paused={stopped} /> : <ChipFallback paused={stopped} />
  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (mode !== 'keyboard' || event.ctrlKey || event.metaKey || event.altKey || event.repeat || event.target instanceof HTMLSelectElement || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
    const skill = keyboardSkills.find(item=>item.shortcut===event.key.toLowerCase())
    if (skill) { event.preventDefault(); selectSkill(skill.id) }
  }

  return <div ref={ref} className={`hero-stage keyboard-stage ${stopped ? 'is-still' : ''} ${mode === 'keyboard' ? 'is-keyboard' : 'is-silicon'}`} onKeyDown={handleKey}>
    <div className="stage-corner stage-corner-top" /><div className="stage-corner stage-corner-bottom" />
    <div className="stage-topline"><span><i /> INTERACTIVE / 001</span><span>{mode==='keyboard' ? '15 KEYS · ONE ENGINEERING PRACTICE' : 'COMPUTE FABRIC'}</span></div>
    <div className="stage-mode-switch" role="group" aria-label="Choose 3D scene"><button type="button" aria-pressed={mode==='keyboard'} onClick={()=>setMode('keyboard')}>Skills keyboard</button><button type="button" aria-pressed={mode==='silicon'} onClick={()=>setMode('silicon')}>Silicon board</button></div>
    <div className="hero-stage-canvas" tabIndex={mode==='keyboard' ? 0 : undefined} role="group" aria-label={mode==='keyboard' ? 'Interactive skills keyboard. Click a key or use Q W E R T, A S D F G, Z X C V B while focused.' : 'Illustrative three-dimensional silicon compute board'} onPointerDown={event=>{if(event.target instanceof HTMLCanvasElement)event.currentTarget.focus({preventScroll:true})}}>
      {canRender && !reducedMotion ? <SceneBoundary fallback={fallback} onFailure={()=>setCanRender(false)}><Suspense fallback={fallback}><HeroScene key={mode} paused={stopped} mode={mode} selectedId={selectedId} pressCount={pressCount} onSelect={selectSkill} /></Suspense></SceneBoundary> : fallback}
    </div>
    {mode==='keyboard' ? <div className="keyboard-inspector">
      <div className="keyboard-selection"><label htmlFor="keyboard-skill">Explore a skill</label><select id="keyboard-skill" value={selectedId} onChange={event=>selectSkill(event.target.value,false)}>{keyboardSkills.map(skill=><option key={skill.id} value={skill.id}>{skill.name}</option>)}</select></div>
      <div className="keyboard-skill-copy"><p aria-live="polite" aria-atomic="true"><strong className="sr-only">{selected.name}: </strong>{selected.detail}</p><a href={`#capability-${selected.capability}`} onClick={()=>{const detail=document.getElementById(`capability-${selected.capability}`);if(detail instanceof HTMLDetailsElement)detail.open=true}}>Explore expertise <ArrowUpRight size={12} aria-hidden="true" /></a></div>
      <div className="keyboard-audio"><button type="button" onClick={sound.preview}>Test sound</button><label>Volume <input aria-label="Keyboard volume" type="range" min=".1" max="1" step=".05" value={sound.volume} onChange={event=>sound.setVolume(Number(event.target.value))} /></label></div>
    </div> : <><div className="stage-label stage-label-ai"><i /> Intelligence<span>Python · Edge AI</span></div><div className="stage-label stage-label-rtl"><i /> Silicon<span>RTL · Verification</span></div></>}
    <div className="stage-bottomline"><span><Maximize2 size={12} aria-hidden="true" />{mode==='keyboard' ? canRender && !reducedMotion ? 'Click a key · Drag to orbit' : 'Tap a key to explore' : canRender && !reducedMotion ? 'Drag to explore' : 'Architecture in perspective'}</span>
      <div className="stage-controls">
        {mode==='keyboard' ? <button type="button" onClick={sound.toggle} aria-pressed={sound.enabled} aria-label={sound.enabled ? 'Mute keyboard sound' : 'Enable keyboard sound'} title={sound.enabled ? 'Mute keyboard sound' : 'Enable keyboard sound'}>{sound.enabled ? <Volume2 size={13} aria-hidden="true" /> : <VolumeX size={13} aria-hidden="true" />}<span>Sound {sound.enabled ? 'on' : 'off'}</span></button> : null}
        {!reducedMotion ? <button type="button" onClick={()=>setPaused(value=>!value)} aria-label={paused ? 'Resume 3D motion' : 'Pause 3D motion'}>{paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}{paused ? 'Resume' : 'Pause'}</button> : <span>Still view</span>}
      </div>
    </div>
  </div>
}
