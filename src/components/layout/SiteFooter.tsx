import { ArrowUp, Github, Instagram, Linkedin, Mail } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { person } from '../../data/portfolio'

export function SiteFooter() {
  const reducedMotion = useReducedMotion()

  return (
    <footer className="border-t border-white/[0.1] py-8">
      <div className="section-shell flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold">{person.name}</p>
          <p className="mt-1 text-xs text-white/[0.5]">{person.location} · Designed around precision, verification, and measurable engineering. Code, create, connect.</p>
        </div>
        <div className="flex items-center gap-5">
          <a className="inline-flex min-h-11 items-center gap-2 text-sm text-white/[0.7] hover:text-white" href={person.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={15} aria-hidden="true" /> LinkedIn
          </a>
          <a className="inline-flex min-h-11 items-center gap-2 text-sm text-white/[0.7] hover:text-white" href={person.github} target="_blank" rel="noreferrer">
            <Github size={15} aria-hidden="true" /> GitHub
          </a>
          <a className="inline-flex min-h-11 items-center gap-2 text-sm text-white/[0.7] hover:text-white" href={person.instagram} target="_blank" rel="noreferrer">
            <Instagram size={15} aria-hidden="true" /> Instagram
          </a>
          <a className="inline-flex min-h-11 items-center gap-2 text-sm text-white/[0.7] hover:text-white" href={person.githubRepository} target="_blank" rel="noreferrer">
            Source
          </a>
          <a className="inline-flex min-h-11 items-center gap-2 text-sm text-white/[0.7] hover:text-white" href={`mailto:${person.email}`}>
            <Mail size={15} aria-hidden="true" /> Email
          </a>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/[0.1] text-white/[0.7] hover:border-white/[0.3] hover:text-white"
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
