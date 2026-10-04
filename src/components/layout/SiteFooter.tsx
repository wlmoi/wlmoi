import { ArrowUp, BriefcaseBusiness, Camera, Code, Mail } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { person } from '../../data/portfolio'

export function SiteFooter() {
  const reducedMotion = useReducedMotion()

  return (
    <footer className="border-t border-white/[0.1] bg-black/[0.18] py-10">
      <div className="section-shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg">{person.name}</p>
          <p className="mt-1 max-w-md text-xs leading-5 text-white/[0.5]">{person.location} · Designed around precision, verification, and measurable engineering. Code, create, connect.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-4 text-sm text-white/[0.72] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(83,240,210,0.5)] hover:text-white" href={person.linkedin} target="_blank" rel="noreferrer">
            <BriefcaseBusiness size={15} aria-hidden="true" /> LinkedIn
          </a>
          <a className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-4 text-sm text-white/[0.72] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(83,240,210,0.5)] hover:text-white" href={person.github} target="_blank" rel="noreferrer">
            <Code size={15} aria-hidden="true" /> GitHub
          </a>
          <a className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-4 text-sm text-white/[0.72] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(83,240,210,0.5)] hover:text-white" href={person.instagram} target="_blank" rel="noreferrer">
            <Camera size={15} aria-hidden="true" /> Instagram
          </a>
          <a className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-4 text-sm text-white/[0.72] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(83,240,210,0.5)] hover:text-white" href={person.githubRepository} target="_blank" rel="noreferrer">
            Source
          </a>
          <a className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-4 text-sm text-white/[0.72] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(83,240,210,0.5)] hover:text-white" href={`mailto:${person.email}`}>
            <Mail size={15} aria-hidden="true" /> Email
          </a>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.03] text-white/[0.7] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(83,240,210,0.5)] hover:text-[hsl(var(--accent))]"
            onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })}
            aria-label="Back to top"
          >
            <ArrowUp size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="section-shell mt-6 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-white/[0.35]">© {new Date().getFullYear()} {person.name}</p>
    </footer>
  )
}
