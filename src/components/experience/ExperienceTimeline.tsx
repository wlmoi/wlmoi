import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Expand } from 'lucide-react'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { experiences } from '../../data/portfolio'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

gsap.registerPlugin(DrawSVGPlugin)
const roles = experiences.filter(item => item.id !== 'tiny-tapeout')
const freelance = experiences.find(item => item.id === 'tiny-tapeout')
const experienceImages: Record<string, string> = {
  Alcon: '/photos/AlconFinalInternshipPresentation.jpeg',
  'Institut Teknologi Bandung': '/proof-of-work/LabCoordinator.png',
  'Microelectronics Center of Institut Teknologi Bandung': '/proof-of-work/MicroelectronicsFPGAEngineer.jpeg',
}

export function ExperienceTimeline() {
  const root = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [readingView, setReadingView] = useState(false)
  const reducedMotion = useReducedMotion()
  const animated = !readingView && !reducedMotion

  useEffect(() => {
    const select = (event: Event) => {
      const id = (event as CustomEvent<string>).detail
      const index = roles.findIndex(item => item.id === id)
      if (index >= 0) setActiveIndex(index)
    }
    window.addEventListener('select-experience', select)
    return () => window.removeEventListener('select-experience', select)
  }, [])

  useEffect(() => {
    const container = root.current
    if (!container) return
    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.experience-gallery-item', container)
      cards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card, start: 'top 55%', end: 'bottom 55%',
          onToggle: self => { if (self.isActive) setActiveIndex(index) },
        })
        if (!animated) return
        // The text remains flat; only the photographic plane moves in depth.
        gsap.timeline({ scrollTrigger: {
          trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.5,
        } })
          .fromTo(card.querySelector('.experience-gallery-photo'),
            { rotationY: index % 2 ? -13 : 13, rotationX: 6, z: -80, y: 28 },
            { rotationY: 0, rotationX: 0, z: 0, y: 0, duration: 0.4, ease: 'none' })
          .to({}, { duration: 0.25 })
          .to(card.querySelector('.experience-gallery-photo'),
            { rotationY: index % 2 ? 8 : -8, rotationX: -4, z: -45, y: -15, duration: 0.35, ease: 'none' })
      })
      gsap.fromTo('.experience-gallery-progress', { drawSVG: '0%' }, {
        drawSVG: '100%', ease: 'none', scrollTrigger: {
          trigger: container.querySelector('.experience-gallery-list'),
          start: 'top 55%', end: 'bottom 55%', scrub: animated ? 0.3 : true,
        },
      })
    }, container)
    const observer = new ResizeObserver(() => ScrollTrigger.refresh())
    observer.observe(container)
    return () => { observer.disconnect(); context.revert() }
  }, [animated])

  function goTo(index: number) {
    const item = roles[index]
    if (!item) return
    setActiveIndex(index)
    const card = document.getElementById(`experience-${item.id}`)
    card?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' })
    card?.focus({ preventScroll: true })
    window.history.replaceState(null, '', `#experience-${item.id}`)
  }

  return (
    <div ref={root} className="experience-gallery" data-view={animated ? '3d' : 'reading'}>
      <div className="experience-gallery-toolbar" role="group" aria-label="Experience navigation">
        <span className="experience-gallery-count" aria-label={`Experience ${activeIndex + 1} of ${roles.length}`}>
          {String(activeIndex + 1).padStart(2, '0')} <span>/ {String(roles.length).padStart(2, '0')}</span>
        </span>
        <label className="experience-jump"><span className="sr-only">Jump to experience</span>
          <select value={activeIndex} onChange={event => goTo(Number(event.target.value))}>
            {roles.map((item, index) => <option key={item.id} value={index}>{item.title}</option>)}
          </select>
        </label>
        <div className="experience-gallery-arrows">
          <button type="button" aria-label="Previous experience" disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)}><ArrowUp size={17} /></button>
          <button type="button" aria-label="Next experience" disabled={activeIndex === roles.length - 1} onClick={() => goTo(activeIndex + 1)}><ArrowDown size={17} /></button>
        </div>
        {!reducedMotion ? <button type="button" className="experience-view-toggle" aria-pressed={readingView} onClick={() => setReadingView(value => !value)}>Reading view</button> : <span className="experience-motion-note">Reduced motion</span>}
        <svg className="experience-gallery-track" viewBox="0 0 1000 4" preserveAspectRatio="none" aria-hidden="true"><path d="M0 2H1000" stroke="#ffffff15" strokeWidth="2" /><path className="experience-gallery-progress" d="M0 2H1000" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
      </div>
      <p className="experience-gallery-hint">Scroll through experience, or choose a role above. Open a card for responsibilities.</p>
      <div className="experience-gallery-list">
        {roles.map((item, index) => (
          <article id={`experience-${item.id}`} key={item.id} tabIndex={-1} className="experience-gallery-item" aria-labelledby={`experience-title-${item.id}`} data-active={activeIndex === index}>
            <div className="experience-gallery-image-stage">
              <button type="button" className="experience-gallery-photo" data-zoom-src={getExperienceImage(item.title, item.organization)} data-zoom-alt={`${item.title} — supporting photo`} aria-label={`Enlarge ${item.title} photo`}>
                <img src={getExperienceImage(item.title, item.organization)} alt={`${item.title} — supporting photo`} loading="lazy" decoding="async" width="680" height="510" />
                <span className="experience-photo-caption"><span>{String(index + 1).padStart(2, '0')} / {item.organization === 'Alcon' ? 'Industry' : item.title.includes('Assistant') || item.title.includes('Coordinator') ? 'Research & teaching' : 'Engineering'}</span><Expand size={16} aria-hidden="true" /></span>
              </button>
            </div>
            <div className="experience-gallery-copy">
              <p className="experience-gallery-date">{item.dates}</p>
              <h3 id={`experience-title-${item.id}`}>{item.title}</h3>
              <p className="experience-gallery-org">{item.organization}</p>
              <p className="experience-gallery-context">{[item.employmentType, item.location].filter(Boolean).join(' · ')}</p>
              <p className="experience-gallery-summary">{item.summary}</p>
              {item.bullets?.length ? <details className="experience-responsibilities">
                <summary>Responsibilities <span>{item.bullets.length}</span></summary>
                <ul>{item.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
              </details> : null}
            </div>
          </article>
        ))}
      </div>
      <div className="experience-gallery-end"><span>End of timeline</span><a href="/resume">Full résumé ↗</a></div>
      <details className="experience-freelance"><summary>Additional freelance engagement <span>Tiny Tapeout · Oct 2026</span></summary><p><strong>RTL Functional Verification Engineer.</strong> {freelance?.summary}</p></details>
    </div>
  )
}

function getExperienceImage(title: string, organization: string) {
  if (title.includes('Edge AI') || title.includes('Partial-Discharge')) return '/proof-of-work/DSPAudioEngineer.jpeg'
  if (title.includes('Chipathon')) return '/proof-of-work/Chipathon2025.jpeg'
  if (title.includes('Programming Problem Solving')) return '/proof-of-work/ProgrammingProblemSolvingAssistant.jpeg'
  if (title.includes('Digital Systems')) return '/proof-of-work/DigitalSystems.jpeg'
  if (title.includes('Electric Circuits')) return '/proof-of-work/ElectricCircuits.jpeg'
  return experienceImages[organization] ?? '/photos/SignalSystems.jpeg'
}
