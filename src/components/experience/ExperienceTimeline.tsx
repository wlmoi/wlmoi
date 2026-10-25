import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { experiences } from '../../data/portfolio'

const experienceImages: Record<string, string> = {
  Alcon: '/photos/AlconFinalInternshipPresentation.jpeg',
  'Institut Teknologi Bandung': '/proof-of-work/LabCoordinator.png',
  'Microelectronics Center of Institut Teknologi Bandung': '/proof-of-work/MicroelectronicsFPGAEngineer.jpeg',
}

export function ExperienceTimeline() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = experiences[activeIndex]
  useEffect(()=>{const select=(event:Event)=>{const id=(event as CustomEvent<string>).detail;const index=experiences.findIndex(e=>e.id===id);if(index>=0)setActiveIndex(index)};window.addEventListener('select-experience',select);return()=>window.removeEventListener('select-experience',select)},[])

  return (
    <div className="experience-timeline-wrap">
      <div className="experience-detail liquid-glass mb-8 overflow-hidden rounded-[1.5rem] p-4 md:p-5">
        <div className="grid gap-5 md:grid-cols-[0.72fr_1.28fr] md:items-center">
          <div className="experience-detail-image-wrap">
            <button type="button" className="experience-photo-button" data-zoom-src={getExperienceImage(active.title, active.organization)} data-zoom-alt={`${active.title} visual`} aria-label={`Enlarge ${active.title} photo`}><img src={getExperienceImage(active.title, active.organization)} alt={`${active.title} visual`} className="experience-detail-image" /></button>
          </div>
          <div>
            <p className="eyebrow">Active experience / {String(activeIndex + 1).padStart(2, '0')}</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">{active.title}</h3>
            <p className="mt-1 text-sm text-white/[0.62]">{active.organization}{active.location ? ` · ${active.location}` : ''}</p>
            <p className="mt-4 text-sm leading-7 text-white/[0.72]">{active.summary}</p>
          </div>
        </div>
      </div>
      <div className="relative ml-1 border-l border-white/[0.12] pl-6 md:pl-10">
      {experiences.filter(item=>item.id!=='tiny-tapeout').map((item) => {const index=experiences.indexOf(item);return (
        <article id={`experience-${item.id}`} key={`${item.organization}-${item.title}`} className={`experience-row relative py-6 md:py-8 ${activeIndex === index ? 'experience-row--active' : ''}`}>
          <span className="absolute -left-[1.73rem] top-10 h-2.5 w-2.5 rounded-full border border-[hsl(var(--accent))] bg-[hsl(var(--background))] md:-left-[2.57rem]" aria-hidden="true" />
          <button type="button" className="grid w-full gap-4 text-left md:grid-cols-[180px_1fr_auto] md:gap-10" onClick={() => setActiveIndex(index)} aria-expanded={activeIndex === index}>
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-white/[0.4]">{item.dates}</p>
              <p className="mt-2 text-xs text-white/[0.35]">{String(index + 1).padStart(2, '0')}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{item.title}</h3>
              <p className="mt-1 text-sm text-white/[0.58]">{item.organization}{item.employmentType ? ` · ${item.employmentType}` : ''}{item.location ? ` · ${item.location}` : ''}</p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/[0.67]">{item.summary}</p>
              {activeIndex === index && item.bullets?.length ? (
                <ul className="mt-4 grid gap-2 text-sm leading-6 text-white/[0.5]">
                  {item.bullets.map((bullet) => <li key={bullet} className="pl-4 before:mr-2 before:text-[hsl(var(--accent))] before:content-['/']">{bullet}</li>)}
                </ul>
              ) : null}
            </div>
            <ChevronDown className="experience-chevron mt-1" size={18} aria-hidden="true" />
          </button>
        </article>
      )})}
      </div>
      <details className="experience-freelance"><summary>Additional freelance engagement <span>Tiny Tapeout · Oct 2026</span></summary><p><strong>RTL Functional Verification Engineer.</strong> {experiences.find(item=>item.id==='tiny-tapeout')?.summary}</p></details>
    </div>
  )
}

function getExperienceImage(title: string, organization: string) {
  if (title.includes('Edge AI')) return '/proof-of-work/DSPAudioEngineer.jpeg'
  if (title.includes('Partial-Discharge')) return '/proof-of-work/DSPAudioEngineer.jpeg'
  if (title.includes('Chipathon')) return '/proof-of-work/Chipathon2025.jpeg'
  if (title.includes('Programming Problem Solving')) return '/proof-of-work/ProgrammingProblemSolvingAssistant.jpeg'
  if (title.includes('Digital Systems')) return '/proof-of-work/DigitalSystems.jpeg'
  if (title.includes('Electric Circuits')) return '/proof-of-work/ElectricCircuits.jpeg'
  return experienceImages[organization] ?? '/photos/SignalSystems.jpeg'
}
