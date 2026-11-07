import { Suspense, lazy, useEffect, useState } from 'react'
import { webglSupported } from '../three/HeroChip'

const LogoScene = lazy(() => import('./LogoScene'))
const KEY = 'founding-intro-seen'
const TURN = 1.3

function shouldPlay() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
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
  const [webgl] = useState(webglSupported)

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
    <div className={`xi-intro ${phase === 'leave' ? 'is-leaving' : ''}`} role="presentation">
      <svg className="xi-traces" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {TRACES.map((d, i) => <path key={`b${i}`} d={d} className="xi-trace" />)}
        {TRACES.map((d, i) => <path key={`p${i}`} d={d} className="xi-pulse" style={{ animationDelay: `${0.1 + i * 0.14}s` }} pathLength={1000} />)}
        <rect x="395" y="195" width="210" height="210" rx="14" className="xi-outline" />
        <path className="xi-wave" d="M0 520 H180 V490 H260 V520 H340 V490 H400 V520 H480 V490 H520 V520 H620 V490 H700 V520 H800 V490 H860 V520 H1000" />
      </svg>
      <div className="xi-logo" aria-hidden="true">
        {webgl ? <Suspense fallback={null}><LogoScene duration={TURN} /></Suspense> : <span className="xi-logo-flat" />}
      </div>
      <p className="xi-word" aria-hidden="true">Made on Founding.dev</p>
      <button type="button" className="xi-skip" onClick={() => setPhase('off')} autoFocus>Skip Intro</button>
    </div>
  )
}
