import { useEffect, useRef } from 'react'

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const length = document.documentElement.scrollHeight - window.innerHeight
        const progress = length > 0 ? Math.min(1, Math.max(0, window.scrollY / length)) : 0
        if (bar.current) bar.current.style.transform = `scaleX(${progress})`
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  return <div className="reading-progress" aria-hidden="true"><div ref={bar} /></div>
}
