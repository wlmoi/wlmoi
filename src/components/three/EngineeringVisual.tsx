import { Suspense, lazy } from 'react'
import { useEffect, useState } from 'react'
import { useIntersection } from '../../hooks/useIntersection'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const SiliconVisual = lazy(() => import('./SiliconVisual'))

export function EngineeringVisual() {
  const { ref, visible } = useIntersection<HTMLDivElement>({ rootMargin: '250px 0px' })
  const reducedMotion = useReducedMotion()
  const [lowPower, setLowPower] = useState(false)

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)').matches
    const fewCores = (navigator.hardwareConcurrency || 8) <= 4
    setLowPower(mobile || fewCores)
  }, [])

  const renderWebGL = visible && !reducedMotion && !lowPower

  return (
    <div ref={ref} className="relative h-[340px] w-full overflow-hidden rounded-[2rem] border border-white/[0.1] bg-[#071b23] md:h-[470px]" aria-label="Decorative silicon die visualization">
      <div className="absolute inset-0 grid-field opacity-45" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,9,13,0.35))]" aria-hidden="true" />
      {renderWebGL ? (
        <Suspense fallback={<StaticDieFallback />}>
          <SiliconVisual />
        </Suspense>
      ) : <StaticDieFallback />}
      <img src="/GDSLayouting.png" alt="GF180MCU GDS layout and signal route" data-zoom-src="/GDSLayouting.png" className="engineering-layout-image" />
      <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between font-mono text-[0.65rem] uppercase tracking-[0.1em] text-white/[0.38]">
        <span>RTL / FLOORPLAN / SIGNAL ROUTE</span>
        <span>WebGL</span>
      </div>
    </div>
  )
}

function StaticDieFallback() {
  return (
    <div className="absolute inset-0 p-8" aria-hidden="true">
      <div className="relative h-full w-full border border-white/[0.15] bg-white/[0.015]">
        <div className="absolute inset-[13%] border border-white/[0.1]" />
        <div className="absolute left-[29%] top-[27%] h-[46%] w-[42%] border border-[hsl(var(--accent))]/55" />
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="absolute left-[34%] top-[30%] h-px w-[31%] bg-[hsl(var(--accent))]/40" style={{ transform: `translateY(${row * 32}px)` }} />
        ))}
        {[0, 1, 2, 3].map((col) => (
          <div key={col} className="absolute left-[35%] top-[29%] h-[44%] w-px bg-[hsl(var(--accent))]/35" style={{ transform: `translateX(${col * 32}px)` }} />
        ))}
      </div>
    </div>
  )
}
