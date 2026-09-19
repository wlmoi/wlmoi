import { useEffect, useRef, useState } from 'react'

export function useIntersection<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const target = ref.current
    if (!target || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setVisible(entry.isIntersecting)
    }, options)

    observer.observe(target)
    return () => observer.disconnect()
  }, [options])

  return { ref, visible }
}
