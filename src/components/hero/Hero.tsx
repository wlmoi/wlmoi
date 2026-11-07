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

  const portrait = (
    <img src="/photos/WilliamAnthonyCasual.jpg" alt="" width={1200} height={1600} decoding="async" />
  )

  return (
    <section ref={root} id="home" className="xh-hero" aria-label="Introduction">
      <div className="xh-stars" aria-hidden="true" />
      <div className="xh-hero-grid">
        <div className="xh-hero-copy">
          <div className="xh-id" data-hero-reveal>
            <figure className="xh-portrait xh-portrait-inline">
              {portrait}
              <figcaption className="sr-only">William Anthony</figcaption>
            </figure>
            <p className="xh-eyebrow"><span className="xh-name">William Anthony</span><span className="xh-role">Inside the machine</span></p>
          </div>
          <h1 data-hero-reveal>I build intelligence <em>into working systems.</em></h1>
          <p className="xh-lead" data-hero-reveal>I’m William Anthony, an Electrical and Electronics Engineering student at Institut Teknologi Bandung. I enjoy designing chips, exploring intelligent hardware, and turning ideas into systems I can actually build and test.</p>
          <div className="xh-actions" data-hero-reveal>
            <a href="#work" className="xh-btn xh-btn-primary">Explore My Work <ArrowDown size={16} aria-hidden="true" /></a>
            <a href={person.resumeUrl} className="xh-btn xh-btn-ghost xh-btn-resume"><FileText size={16} aria-hidden="true" /> View My Résumé</a>
            <a href="#contact" className="xh-link">Let’s Connect <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
          <dl className="xh-proof" data-hero-reveal>
            <div><dt>EE academic rank</dt><dd>1 of 118</dd></div>
            <div><dt>GPA at ITB</dt><dd>3.70 of 4.00</dd></div>
          </dl>
        </div>
        <div className="xh-hero-stage" data-hero-stage>
          <HeroChip />
          <figure className="xh-portrait xh-portrait-float" data-hero-reveal>
            {portrait}
            <figcaption>William Anthony</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
