import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ArrowDown, ArrowUpRight, Code, BriefcaseBusiness, Trophy } from 'lucide-react'
import { person } from '../../data/portfolio'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { gsap } from '../../lib/gsap'
import { ParticleTitle } from './ParticleTitle'
import { ResumeAction } from './ResumeAction'
import { HeroStage } from '../three/HeroStage'

export function Hero({ activeId }: { activeId: string }) {
  const root = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    if (reducedMotion) return
    const context = gsap.context(() => {
      gsap.fromTo('[data-hero-reveal]', {y:28,opacity:0}, {y:0,opacity:1,duration:.8,stagger:.07,ease:'power3.out',delay:.1})
    }, root)
    return () => context.revert()
  }, [reducedMotion])

  return (
    <section ref={root} id="home" className="hero-home hero-cosmic" aria-label="William Anthony introduction">
      <div className="cosmic-stars" aria-hidden="true" /><div className="cosmic-glow cosmic-glow-one" aria-hidden="true" /><div className="cosmic-glow cosmic-glow-two" aria-hidden="true" />
      {createPortal(<div className="hero-desktop-nav">
        <div className="liquid-glass flex items-center justify-between rounded-full px-5 py-3">
          <a href="#home" className="hero-wordmark" aria-label="William Anthony home"><span>WA<span className="wordmark-dot">.</span></span>William Anthony</a>
          <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary navigation">
            {[
              ['Home','home'],['Profile','profile'],['Expertise','expertise'],['Circuits','schematics'],['Experience','experience'],['Selected Work','work'],['Community','organizations'],['Evidence','evidence'],['Recognition','recognition'],['Contact','contact'],
            ].map(([label,id])=><a key={id} href={`#${id}`} className={`hero-nav-link text-xs transition-colors ${activeId===id ? 'is-active text-white' : 'text-white/60 hover:text-white'}`}>{label}</a>)}
            <a href="#contact" className="nav-contact">Let’s talk <ArrowUpRight size={13} aria-hidden="true" /></a>
          </nav>
        </div>
      </div>, document.getElementById('site-navigation-root') ?? document.body)}
      <div className="hero-cosmic-shell">
        <div className="hero-introduction">
          <div className="hero-intro-marker" aria-hidden="true"><i /><span /></div>
          <div className="hero-intro-copy">
            <p className="hero-kicker" data-hero-reveal>HARDWARE, SOFTWARE & APPLIED AI</p>
            <ParticleTitle />
            <p className="hero-statement" data-hero-reveal>I build intelligence<br /><em>into working systems.</em></p>
            <p className="hero-description" data-hero-reveal>Junior Edge AI Engineer and Microelectronics Research Assistant at ITB. Manufacturing internship experience at Alcon. I connect digital hardware, embedded intelligence, and practical automation.</p>
            <div className="hero-actions" data-hero-reveal>

              <ResumeAction />
              <a href="#work" className="hero-secondary-action">Explore selected work <ArrowUpRight size={14} aria-hidden="true" /></a>
            </div>
            <div className="hero-awards" aria-label="Selected awards">
            <a href="#work" className="hero-award" data-hero-reveal><Trophy size={14} aria-hidden="true" /><span>2nd Place — PERURI Chip Hackathon 2026<small>FPGA and chip design</small></span><ArrowUpRight size={13} aria-hidden="true" /></a>
            <a href="https://www.linkedin.com/feed/update/urn:li:activity:7412029754188414976/" target="_blank" rel="noreferrer" className="hero-award hero-agentic" data-hero-reveal><Trophy size={14} aria-hidden="true" /><span>Winner — IEEE Chipathon 2025<small>Agentic AI and chip design</small></span><ArrowUpRight size={13} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
        <div className="hero-scene-column" data-hero-reveal><HeroStage /></div>
        <div className="hero-cosmic-footer">
          <div className="hero-proof"><span><strong>1 / 118</strong> EE academic rank</span><span><strong>3.70 / 4.00</strong> GPA at ITB</span><span><strong>138.32 µs</strong> IGOR inference</span></div>
          <div className="hero-footer-links"><a href={person.github} target="_blank" rel="noreferrer"><Code size={15} aria-hidden="true" /> GitHub</a><a href={person.linkedin} target="_blank" rel="noreferrer"><BriefcaseBusiness size={15} aria-hidden="true" /> LinkedIn</a><a href="#profile" className="hero-scroll-cue" aria-label="Scroll to profile"><span /><ArrowDown size={15} aria-hidden="true" /></a></div>
        </div>
      </div>
    </section>
  )
}
