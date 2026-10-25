import { useEffect, useRef, useState } from 'react'

export function useIntersection<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')
  const { root = null, rootMargin = '0px', threshold = 0 } = options ?? {}

  useEffect(() => {
    const target = ref.current
    if (!target || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setVisible(entry.isIntersecting)
    }, { root, rootMargin, threshold })

    observer.observe(target)
    return () => observer.disconnect()
  }, [root, rootMargin, threshold])

  return { ref, visible }
}
