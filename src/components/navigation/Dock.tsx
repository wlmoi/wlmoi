import { useEffect, useState } from 'react'
import { Home, Layers, Mail, Sparkles, User } from 'lucide-react'

const items = [
  { id: 'home', label: 'Intro', icon: Home },
  { id: 'work', label: 'Projects', icon: Sparkles },
  { id: 'background', label: 'Depth', icon: Layers },
  { id: 'about', label: 'About', icon: User },
  { id: 'contact', label: 'Contact', icon: Mail },
] as const

export function Dock() {
  const [active, setActive] = useState<string>('home')

  useEffect(() => {
    const targets = items.map((item) => document.getElementById(item.id)).filter((node): node is HTMLElement => !!node)
    const observer = new IntersectionObserver((entries) => {
      const best = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (best) setActive(best.target.id)
    }, { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.2, 0.5] })
    targets.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const jump = (id: string) => (event: React.MouseEvent) => {
    const node = document.getElementById(id)
    if (!node) return
    event.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    node.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
    if (id === 'contact') node.focus({ preventScroll: true })
  }

  return (
    <nav className="xd-dock" aria-label="Page sections">
      {items.map(({ id, label, icon: Icon }) => (
        <a key={id} href={`#${id}`} onClick={jump(id)} aria-current={active === id ? 'location' : undefined} aria-label={label}>
          <Icon size={17} aria-hidden="true" /><span>{label}</span>
        </a>
      ))}
    </nav>
  )
}
