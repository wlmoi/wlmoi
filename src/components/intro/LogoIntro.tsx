import { Suspense, lazy, useEffect, useState } from 'react'
import { webglSupported } from '../three/HeroChip'

const LogoScene = lazy(() => import('./LogoScene'))
const KEY = 'founding-intro-seen'
const TURN = 4.1

function shouldPlay() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (new URLSearchParams(window.location.search).get('intro') === 'off') return false
    if (sessionStorage.getItem(KEY)) return false
  } catch { /* storage unavailable, play once */ }
  return true
}

const TRACES = [
  'M0 120 H220 L270 170 H395',
  'M0 300 H300 L340 260 H395',
  'M0 470 H200 L260 410 H395',
  'M1000 130 H780 L730 180 H605',
  'M1000 300 H700 L660 340 H605',
  'M1000 460 H800 L740 400 H605',
  'M500 0 V120 L520 140 V195',
  'M500 600 V480 L480 460 V405',
]

export function LogoIntro() {
  const [phase, setPhase] = useState<'off' | 'play' | 'leave'>(() => (shouldPlay() ? 'play' : 'off'))
  const [lite] = useState(() => window.innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4)
  const [webgl] = useState(() => !lite && webglSupported())

  useEffect(() => {
    if (phase === 'off') return
    try { sessionStorage.setItem(KEY, '1') } catch { /* ignore */ }
    document.body.classList.add('intro-active')
    const leave = window.setTimeout(() => setPhase('leave'), TURN * 1000 + 250)
    const end = window.setTimeout(() => setPhase('off'), TURN * 1000 + 250 + 650)
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setPhase('off') }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(leave); window.clearTimeout(end)
      window.removeEventListener('keydown', onKey)
    }
  }, [phase === 'off']) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase === 'off') document.body.classList.remove('intro-active')
    return () => document.body.classList.remove('intro-active')
  }, [phase])

  if (phase === 'off') return null
  return (
    <div className={`xi-intro ${lite ? 'is-lite' : ''} ${phase === 'leave' ? 'is-leaving' : ''}`} role="presentation">
      <svg className="xi-traces" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {TRACES.map((d, i) => <path key={`b${i}`} d={d} className="xi-trace" />)}
        {TRACES.map((d, i) => <path key={`p${i}`} d={d} className="xi-pulse" style={{ animationDelay: `${0.1 + i * 0.1}s` }} pathLength={1000} />)}
      </svg>
      <div className="xi-logo" aria-hidden="true">
        {webgl ? <Suspense fallback={null}><LogoScene duration={TURN} /></Suspense> : <svg className="xi-bolts" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="16" className="xi-orb" />
          <polyline points="100,100 88,78 104,64 90,40 100,10" className="xi-bolt b1" />
          <polyline points="100,100 124,92 118,70 142,60 160,30" className="xi-bolt b2" />
          <polyline points="100,100 78,112 92,128 70,146 76,190" className="xi-bolt b3" />
          <polyline points="100,100 122,118 112,138 134,152 150,186" className="xi-bolt b4" />
          <polyline points="100,100 70,96 60,80 36,84 8,62" className="xi-bolt b5" />
          <polyline points="100,100 132,104 144,122 170,120 194,142" className="xi-bolt b6" />
        </svg>}
      </div>
      <button type="button" className="xi-skip" onClick={() => setPhase('off')} autoFocus>Skip Intro</button>
    </div>
  )
}
