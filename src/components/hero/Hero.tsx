import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUpRight, FileText } from 'lucide-react'
import { person } from '../../data/portfolio'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { gsap } from '../../lib/gsap'
import { HeroChip } from '../three/HeroChip'

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    if (reducedMotion) return
    const lead = document.body.classList.contains('intro-active') ? 1.45 : 0
    const context = gsap.context(() => {
      gsap.fromTo('[data-hero-reveal]', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.15 + lead })
      gsap.fromTo('[data-hero-stage]', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out', delay: 0.1 + lead })
    }, root)
    return () => context.revert()
  }, [reducedMotion])

  return (
    <section ref={root} id="home" className="xh-hero" aria-label="Introduction">
      <div className="xh-stars" aria-hidden="true" />
      <div className="xh-hero-grid">
        <div className="xh-hero-copy">
          <h1 data-hero-reveal>I build intelligence <em>into working systems.</em></h1>
          <p className="xh-lead" data-hero-reveal>I'm William Anthony, an Electrical and Electronics Engineering from Institut Teknologi Bandung. I enjoy chip design and hardware verification, especially the challenge of turning ideas into reliable systems. Outside engineering, you'll find me at the gym or meeting new people.</p>
          <div className="xh-actions" data-hero-reveal>
            <a href="#work" className="xh-btn xh-btn-primary">Explore My Work <ArrowDown size={16} aria-hidden="true" /></a>
            <a href={person.resumeUrl} className="xh-btn xh-btn-ghost xh-btn-resume"><FileText size={16} aria-hidden="true" /> View My Résumé</a>
            <a href="#contact" className="xh-link">Let’s Connect <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="xh-hero-stage" data-hero-stage>
          <HeroChip />
          <figure className="xh-photo">
            <img src="/photos/WilliamAnthonyCasual.jpg" alt="William Anthony standing on a balcony above a hillside farm" width="600" height="800" decoding="async" />
          </figure>
        </div>
      </div>
    </section>
  )
}
