import type { PointerEvent, ReactNode } from 'react'

function moveSurface(event: PointerEvent<HTMLDivElement>) {
  if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height
  card.style.setProperty('--tilt-x', `${(0.5 - y) * 9}deg`)
  card.style.setProperty('--tilt-y', `${(x - 0.5) * 9}deg`)
  card.style.setProperty('--spot-x', `${x * 100}%`)
  card.style.setProperty('--spot-y', `${y * 100}%`)
}

function resetSurface(event: PointerEvent<HTMLDivElement>) {
  event.currentTarget.style.setProperty('--tilt-x', '0deg')
  event.currentTarget.style.setProperty('--tilt-y', '0deg')
}

export function TiltSurface({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`tilt-surface ${className}`} onPointerMove={moveSurface} onPointerLeave={resetSurface}>{children}</div>
}
