import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { experiences } from '../../data/portfolio'

const roles = experiences.filter((item) => item.id !== 'tiny-tapeout')
const freelance = experiences.find((item) => item.id === 'tiny-tapeout')
const byOrg: Record<string, string> = {
  Alcon: '/photos/AlconFinalInternshipPresentation.jpeg',
  'Institut Teknologi Bandung': '/proof-of-work/LabCoordinator.png',
  'Microelectronics Center of Institut Teknologi Bandung': '/proof-of-work/MicroelectronicsFPGAEngineer.jpeg',
}

function imageFor(title: string, organization: string) {
  if (title.includes('Edge AI') || title.includes('Partial-Discharge')) return '/proof-of-work/DSPAudioEngineer.jpeg'
  if (title.includes('Chipathon')) return '/proof-of-work/Chipathon2025.jpeg'
  if (title.includes('Programming Problem Solving')) return '/proof-of-work/ProgrammingProblemSolvingAssistant.jpeg'
  if (title.includes('Digital Systems')) return '/proof-of-work/DigitalSystems.jpeg'
  if (title.includes('Electric Circuits')) return '/proof-of-work/ElectricCircuits.jpeg'
  return byOrg[organization] ?? '/photos/SignalSystems.jpeg'
}

const links: Record<string, string> = { 'circuits-assistant': 'https://www.instagram.com/reel/DfEmYs6xV3H/' }

export function ExperienceCarousel() {
  const [index, setIndex] = useState(0)
  const item = roles[index]
  const go = (to: number) => setIndex((to + roles.length) % roles.length)
  const src = imageFor(item.title, item.organization)

  return (
    <div className="xx-wrap" id="experience">
      <div className="xx-pick" role="tablist" aria-label="Choose a role">
        {roles.map((role, i) => (
          <button key={role.id} type="button" role="tab" aria-selected={i === index} tabIndex={i === index ? 0 : -1} onClick={() => setIndex(i)}>
            <small>{role.dates.split(' - ')[0]}</small>{role.title}
          </button>
        ))}
      </div>
      <article className="xx-card" key={item.id} id={`experience-${item.id}`}>
        <button type="button" className="xx-photo" data-zoom-src={src} data-zoom-alt={`${item.title}, supporting photo`} aria-label={`Enlarge ${item.title} photo`}>
          <img src={src} alt={`${item.title}, supporting photo`} width="680" height="510" loading="lazy" />
        </button>
        <div className="xx-copy">
          <p className="xh-eyebrow">{item.dates}</p>
          <h3>{item.title}</h3>
          <p className="xx-org">{item.organization}</p>
          <p>{item.summary}</p>
          {links[item.id] ? <p><a className="xh-link" href={links[item.id]} target="_blank" rel="noreferrer">See it on Instagram</a></p> : null}
          {item.bullets?.length ? (
            <details className="xe-more"><summary>Responsibilities ({item.bullets.length})</summary><ul>{item.bullets.map((b) => <li key={b}>{b}</li>)}</ul></details>
          ) : null}
        </div>
      </article>
      <div className="xx-nav">
        <button type="button" onClick={() => go(index - 1)} aria-label="Previous role"><ArrowLeft size={16} aria-hidden="true" /></button>
        <span aria-live="polite">{index + 1} of {roles.length}</span>
        <button type="button" onClick={() => go(index + 1)} aria-label="Next role"><ArrowRight size={16} aria-hidden="true" /></button>
        <a href="/resume" className="xx-resume">Full résumé</a>
      </div>
      <details className="xe-more"><summary>Additional freelance engagement</summary><p><strong>RTL Functional Verification Engineer, Tiny Tapeout.</strong> {freelance?.summary}</p></details>
    </div>
  )
}
