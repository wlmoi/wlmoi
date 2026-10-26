import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { person } from '../../data/portfolio'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const links = [
  ['Home', 'home'], ['Profile', 'profile'], ['Expertise', 'expertise'],
  ['Circuit atlas', 'schematics'], ['Experience', 'experience'],
  ['Selected Work', 'work'], ['Community', 'organizations'],
  ['Evidence archive', 'evidence'], ['Recognition', 'recognition'], ['Contact', 'contact'],
] as const

export function Navigation({ activeId }: { activeId: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDialogElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return
    let animation: Animation | undefined
    if (menuOpen) {
      if (!menu.open) menu.showModal()
      document.body.classList.add('menu-open')
      animation = menu.animate([
        { opacity: 0, transform: 'translateY(-12px) scale(.98)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' },
      ], { duration: reducedMotion ? 0 : 220, easing: 'cubic-bezier(.2,.8,.2,1)' })
    } else if (menu.open) {
      animation = menu.animate([
        { opacity: 1, transform: 'translateY(0) scale(1)' },
        { opacity: 0, transform: 'translateY(-8px) scale(.99)' },
      ], { duration: reducedMotion ? 0 : 150, easing: 'ease-in' })
      animation.onfinish = () => {
        menu.close()
        document.body.classList.remove('menu-open')
      }
    }
    return () => { if (animation) { animation.onfinish = null; animation.cancel() } }
  }, [menuOpen, reducedMotion])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1280px)')
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false) }
    const closeOnHashChange = () => setMenuOpen(false)
    desktop.addEventListener('change', closeOnDesktop)
    window.addEventListener('hashchange', closeOnHashChange)
    return () => {
      desktop.removeEventListener('change', closeOnDesktop)
      window.removeEventListener('hashchange', closeOnHashChange)
      document.body.classList.remove('menu-open')
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="mobile-site-header fixed inset-x-0 top-0 z-40 px-4 pt-4 xl:hidden" aria-label="Mobile site navigation">
      <div className="mx-auto max-w-7xl">
        <div className="mobile-nav-shell flex items-center justify-between rounded-full px-2 py-2">
          <a href="#home" className="font-display px-3 text-lg tracking-tight text-white" aria-label="William Anthony home">
            William Anthony<span className="align-super ml-0.5 text-[0.5em] text-white/[0.65]">®</span>
          </a>
          <button type="button" className="mobile-menu-trigger liquid-glass inline-flex min-h-11 min-w-11 items-center justify-center rounded-full"
            onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-haspopup="dialog" aria-label="Open navigation menu">
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
        <dialog id="mobile-navigation" ref={menuRef} className="mobile-navigation-dialog" aria-labelledby="mobile-menu-title"
          onCancel={event => { event.preventDefault(); closeMenu() }} onClose={closeMenu}
          onKeyDown={event => {
            if (event.key !== 'Tab') return
            const items = [...event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]')]
            const first = items[0]
            const last = items[items.length - 1]
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
          }}
          onClick={event => {
            if (event.target !== event.currentTarget) return
            const box = event.currentTarget.getBoundingClientRect()
            if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeMenu()
          }}>
          <div className="mobile-menu-heading">
            <h2 id="mobile-menu-title">Explore</h2>
            <button type="button" onClick={closeMenu} aria-label="Close navigation menu" autoFocus><X size={20} aria-hidden="true" /></button>
          </div>
          <nav aria-label="Page sections" className="mobile-menu-links">
            {links.map(([label, id], index) => (
              <a key={id} href={`#${id}`} onClick={closeMenu} aria-current={activeId === id ? 'location' : undefined}>
                <span className="mobile-menu-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span>{label}</span><ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ))}
          </nav>
          <div className="mobile-menu-footer"><a href={`mailto:${person.email}`} onClick={closeMenu}>Discuss an opportunity <ArrowUpRight size={16} aria-hidden="true" /></a></div>
        </dialog>
      </div>
    </header>
  )
}
