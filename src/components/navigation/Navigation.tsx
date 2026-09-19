import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { person } from '../../data/portfolio'

const links = [
  ['Home', 'home'],
  ['Profile', 'profile'],
  ['Expertise', 'expertise'],
  ['Experience', 'experience'],
  ['Selected Work', 'work'],
  ['Recognition', 'recognition'],
  ['Contact', 'contact'],
] as const

export function Navigation({ activeId }: { activeId: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) {
      if (wasOpen.current) triggerRef.current?.focus()
      wasOpen.current = false
      return
    }
    wasOpen.current = true

    const first = menuRef.current?.querySelector<HTMLElement>('a, button')
    first?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        return
      }

      if (event.key !== 'Tab' || !menuRef.current) return
      const nodes = [...menuRef.current.querySelectorAll<HTMLElement>('a, button')].filter((el) => !el.hasAttribute('disabled'))
      if (nodes.length === 0) return
      const firstNode = nodes[0]
      const lastNode = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === firstNode) {
        event.preventDefault()
        lastNode.focus()
      } else if (!event.shiftKey && document.activeElement === lastNode) {
        event.preventDefault()
        firstNode.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 md:hidden" aria-label="Mobile site navigation">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between rounded-full px-2 py-2">
          <a href="#home" className="font-display px-3 text-lg tracking-tight text-white" aria-label="William Anthony home">
            William Anthony<span className="align-super ml-0.5 text-[0.5em] text-white/[0.65]">®</span>
          </a>
          <button
            ref={triggerRef}
            type="button"
            className="liquid-glass inline-flex min-h-11 min-w-11 items-center justify-center rounded-full"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>

        {menuOpen ? (
          <div id="mobile-navigation" ref={menuRef} className="liquid-glass mt-3 rounded-[1.75rem] p-5" role="dialog" aria-modal="true" aria-label="Mobile navigation menu">
            <p className="eyebrow mb-5">Navigation</p>
            <div className="grid gap-1">
              {links.map(([label, id]) => (
                <a key={id} href={`#${id}`} onClick={closeMenu} className={`flex min-h-12 items-center justify-between border-b border-white/[0.1] py-2 text-lg ${activeId === id ? 'text-white' : 'text-white/[0.7] hover:text-white'}`}>
                  <span>{label}</span>
                  <span className="font-mono text-[0.65rem] text-white/[0.35]">{id.toUpperCase()}</span>
                </a>
              ))}
            </div>
            <a href={`mailto:${person.email}`} onClick={closeMenu} className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-[hsl(var(--background))]">Discuss an Opportunity</a>
          </div>
        ) : null}
      </div>
    </header>
  )
}
