import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { experiences } from '../../data/portfolio'

const experienceImages: Record<string, string> = {
  Alcon: '/photos/AlconFinalInternshipPresentation.jpeg',
  'Institut Teknologi Bandung': '/proof-of-work/LabCoordinator.png',
  'Microelectronics Center of Institut Teknologi Bandung': '/GDSLayouting.png',
}

export function ExperienceTimeline() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = experiences[activeIndex]

  return (
    <div className="experience-timeline-wrap">
      <div className="experience-detail liquid-glass mb-8 overflow-hidden rounded-[1.5rem] p-4 md:p-5">
        <div className="grid gap-5 md:grid-cols-[0.72fr_1.28fr] md:items-center">
          <div className="experience-detail-image-wrap">
            <img src={getExperienceImage(active.title, active.organization)} alt={`${active.title} visual`} data-zoom-src={getExperienceImage(active.title, active.organization)} className="experience-detail-image" />
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
      {experiences.map((item, index) => (
        <article key={`${item.organization}-${item.title}`} className={`experience-row relative py-6 md:py-8 ${activeIndex === index ? 'experience-row--active' : ''}`}>
          <span className="absolute -left-[1.73rem] top-10 h-2.5 w-2.5 rounded-full border border-[hsl(var(--accent))] bg-[hsl(var(--background))] md:-left-[2.57rem]" aria-hidden="true" />
          <button type="button" className="grid w-full gap-4 text-left md:grid-cols-[180px_1fr_auto] md:gap-10" onClick={() => setActiveIndex(index)} aria-expanded={activeIndex === index}>
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-white/[0.4]">{item.dates}</p>
              <p className="mt-2 text-xs text-white/[0.35]">{String(index + 1).padStart(2, '0')}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{item.title}</h3>
              <p className="mt-1 text-sm text-white/[0.58]">{item.organization}{item.location ? ` · ${item.location}` : ''}</p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/[0.67]">{item.summary}</p>
              {item.bullets && item.bullets.length > 1 ? (
                <ul className="mt-4 grid gap-2 text-sm leading-6 text-white/[0.5]">
                  {item.bullets.slice(1).map((bullet) => <li key={bullet} className="pl-4 before:mr-2 before:text-[hsl(var(--accent))] before:content-['/']">{bullet}</li>)}
                </ul>
              ) : null}
            </div>
            <ChevronDown className="experience-chevron mt-1" size={18} aria-hidden="true" />
          </button>
        </article>
      ))}
      </div>
    </div>
  )
}

function getExperienceImage(title: string, organization: string) {
  if (title.includes('Edge AI')) return '/proof-of-work/AudioDSP.jpeg'
  if (title.includes('Partial-Discharge')) return '/proof-of-work/AudioDSP.jpeg'
  if (title.includes('Chipathon')) return '/proof-of-work/Chipathon2025.jpeg'
  if (title.includes('Digital Systems')) return '/proof-of-work/LabAssistant.png'
  if (title.includes('Electric Circuits')) return '/proof-of-work/LabAssistant.png'
  return experienceImages[organization] ?? '/photos/WilliamAnthonyCasual.jpg'
}
