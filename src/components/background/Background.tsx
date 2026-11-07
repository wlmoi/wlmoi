import { Suspense, lazy, useEffect, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { capabilities, skillGroups } from '../../data/portfolio'
import { ExperienceCarousel } from '../experience/ExperienceCarousel'
import { OrganizationExperience } from '../experience/OrganizationExperience'
import { CircuitExplorer } from '../three/CircuitExplorer'
import { EvidenceLibrary } from '../profile/EvidenceLibrary'
import { ProfileSection } from '../profile/ProfileSection'

const HeroStage = lazy(() => import('../three/HeroStage').then((module) => ({ default: module.HeroStage })))

const tabs = [
  { id: 'expertise', label: 'Expertise', blurb: 'Digital hardware and verification, extended by embedded AI.' },
  { id: 'experience', label: 'Experience', blurb: 'Research, industry, and teaching roles.' },
  { id: 'schematics', label: 'Circuits', blurb: 'An atlas of circuits I have simulated and studied.' },
  { id: 'organizations', label: 'Community', blurb: 'Teaching, leadership, and student organizations.' },
  { id: 'profile', label: 'Education', blurb: 'Studies, credentials, and languages.' },
  { id: 'evidence', label: 'Evidence', blurb: 'Reports, recommendations, and original records.' },
] as const
type TabId = (typeof tabs)[number]['id']

function Expertise() {
  return (
    <div className="xb-expertise">
      <div className="xb-capabilities">
        <div className="xb-accordion">
          {capabilities.map((capability) => (
            <details key={capability.id} id={`capability-${capability.id}`} open={capability.id === 'asic'}>
              <summary><span>{capability.title}</span><small>Inspect</small></summary>
              <p>{capability.summary}</p>
              <div className="xb-chips">{[...capability.tools, ...capability.methods].map((item) => <span key={item} className="info-chip">{item}</span>)}</div>
            </details>
          ))}
        </div>
      </div>
      <div className="xb-keyboard">
        <Suspense fallback={<div className="xe-loading" aria-hidden="true" />}><HeroStage /></Suspense>
      </div>
      <details className="xb-skills">
        <summary>Show every skill and tool <ChevronDown size={14} aria-hidden="true" /></summary>
        <div className="xb-skills-grid">
          {Object.entries(skillGroups).map(([group, skills]) => (
            <div key={group}>
              <p className="eyebrow">{group}</p>
              <p>{skills.join(', ')}</p>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}

function Clip({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`xb-clip ${open ? 'is-open' : ''}`}>
      <div className="xb-clip-body">{children}</div>
      <button type="button" className="xb-clip-toggle" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {open ? 'Show less' : 'Show everything'} <ChevronDown size={14} aria-hidden="true" />
      </button>
    </div>
  )
}

export function Background() {
  const [active, setActive] = useState<TabId>('expertise')

  useEffect(() => {
    const fromHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1))
      const match = tabs.find((tab) => hash === tab.id || hash.startsWith(`${tab.id}-`) || (tab.id === 'expertise' && hash.startsWith('capability-')))
      if (match) {
        setActive(match.id)
        requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: 'start' }) ?? document.getElementById('background')?.scrollIntoView({ block: 'start' })))
      }
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const move = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!move) return
    event.preventDefault()
    const target = (index + move + tabs.length) % tabs.length
    setActive(tabs[target].id)
    const list = event.currentTarget.parentElement
    requestAnimationFrame(() => list?.querySelectorAll<HTMLElement>('[role="tab"]')[target]?.focus())
  }
  const current = tabs.find((tab) => tab.id === active)!

  return (
    <section id="background" className="xb-section" aria-labelledby="background-title">
      <div className="xb-shell">
        <header className="xb-head">
          <div>
            <h2 id="background-title">The depth behind the builds.</h2>
          </div>
          <div className="xb-tabs" role="tablist" aria-label="Background topics">
            {tabs.map((tab, index) => (
              <button key={tab.id} type="button" role="tab" id={`xb-tab-${tab.id}`} aria-selected={active === tab.id} aria-controls="xb-panel" tabIndex={active === tab.id ? 0 : -1}
                onClick={() => setActive(tab.id)} onKeyDown={(event) => onKey(event, index)}>{tab.label}</button>
            ))}
          </div>
        </header>
        <div id="xb-panel" role="tabpanel" aria-labelledby={`xb-tab-${active}`} className="xb-panel" key={active}>
          {active === 'expertise' ? <Expertise /> : null}
          {active === 'experience' ? <ExperienceCarousel /> : null}
          {active === 'schematics' ? <Clip key={active}><CircuitExplorer /></Clip> : null}
          {active === 'organizations' ? <Clip key={active}><OrganizationExperience /></Clip> : null}
          {active === 'profile' ? <Clip key={active}><ProfileSection /></Clip> : null}
          {active === 'evidence' ? <Clip key={active}><EvidenceLibrary /></Clip> : null}
        </div>
      </div>
    </section>
  )
}
