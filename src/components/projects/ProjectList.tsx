import { useState } from 'react'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { projects } from '../../data/portfolio'

export function ProjectList() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div>
      {projects.map((project) => {
        const isOpen = open === project.id
        return (
          <article key={project.id} className="project-card">
            <button
              type="button"
              className="grid w-full gap-6 text-left md:grid-cols-[100px_1fr_auto] md:items-start"
              aria-expanded={isOpen}
              aria-controls={`project-${project.id}`}
              onClick={() => setOpen(isOpen ? null : project.id)}
            >
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-white/[0.38]">{project.eyebrow}</span>
              <span>
                <span className="block text-xl font-semibold tracking-tight md:text-2xl">{project.title}</span>
                <span className="mt-2 block max-w-2xl text-sm leading-6 text-white/[0.57]">{project.context}</span>
              </span>
              <span className="inline-flex min-h-11 min-w-11 items-center justify-center self-start rounded-full border border-white/[0.1] text-white/[0.55] transition-transform" style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }}>
                <ChevronDown size={17} aria-hidden="true" />
              </span>
            </button>

            {isOpen ? (
              <div id={`project-${project.id}`} className="ml-0 mt-7 grid gap-7 border-l border-white/[0.1] pl-5 md:ml-[100px] md:grid-cols-2 md:pl-7" role="region">
                <div>
                  <p className="eyebrow">Role</p>
                  <p className="mt-2 text-sm leading-6 text-white/[0.68]">{project.role}</p>
                </div>
                <div>
                  <p className="eyebrow">Engineering challenge</p>
                  <p className="mt-2 text-sm leading-6 text-white/[0.68]">{project.challenge}</p>
                </div>
                <div>
                  <p className="eyebrow">Technical stack</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.stack.map((tool) => <span key={tool} className="rounded-full border border-white/[0.1] px-3 py-1.5 font-mono text-[0.63rem] text-white/[0.55]">{tool}</span>)}
                  </div>
                </div>
                <div>
                  <p className="eyebrow">Outcome</p>
                  <p className="mt-2 text-sm leading-6 text-white/[0.68]">{project.outcome}</p>
                  {project.status === 'ongoing' ? <p className="mt-3 inline-flex rounded-full border border-[hsl(var(--accent))]/35 px-3 py-1.5 font-mono text-[0.63rem] uppercase tracking-[0.1em] text-[hsl(var(--accent))]">Ongoing</p> : null}
                </div>
                {project.href ? (
                  <a href={project.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white hover:text-[hsl(var(--accent))]">
                    Verify project <ExternalLink size={14} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}
