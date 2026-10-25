import { Component, Suspense, lazy, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Maximize2, Pause, Play } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useIntersection } from '../../hooks/useIntersection'

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
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    const update = () => setCanRender(supportsScene())
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const stopped = paused || reducedMotion || !visible
  const fallback = <ChipFallback paused={stopped} />

  return <div ref={ref} className={`hero-stage ${stopped ? 'is-still' : ''}`}>
    <div className="stage-corner stage-corner-top" /><div className="stage-corner stage-corner-bottom" />
    <div className="stage-topline"><span><i /> SYSTEM STUDY / 001</span><span>COMPUTE FABRIC</span></div>
    <div className="hero-stage-canvas" role="img" aria-label="A three-dimensional silicon compute board with a four-by-four processing array">
      {canRender && !reducedMotion ? <SceneBoundary fallback={fallback} onFailure={() => setCanRender(false)}><Suspense fallback={fallback}><HeroScene paused={stopped} /></Suspense></SceneBoundary> : fallback}
    </div>
    <div className="stage-label stage-label-ai"><i /> Intelligence<span>Python · Edge AI</span></div>
    <div className="stage-label stage-label-rtl"><i /> Silicon<span>RTL · Verification</span></div>
    <div className="stage-bottomline"><span><Maximize2 size={12} aria-hidden="true" />{canRender && !reducedMotion ? 'Drag to explore' : 'Architecture in perspective'}</span>
      {!reducedMotion ? <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume 3D motion' : 'Pause 3D motion'}>{paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}{paused ? 'Resume' : 'Pause'}</button> : <span>Still view</span>}
    </div>
  </div>
}
