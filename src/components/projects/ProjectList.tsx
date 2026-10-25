import { useState } from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { projects } from '../../data/portfolio'

const filters = ['All work', 'Hardware & AI', 'Design verification', 'DSP', 'IoT & embedded', 'Software & automation', 'Data analytics'] as const

export function ProjectList() {
  const [open, setOpen] = useState<string | null>('igor')
  const [filter, setFilter] = useState<(typeof filters)[number]>('All work')
  const visible = projects.filter((project) => filter === 'All work' || (project.discipline ?? 'Hardware & AI') === filter)

  return (
    <div>
      <div className="project-filters" role="group" aria-label="Filter projects">
        {filters.map((item) => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}<span>{item === 'All work' ? projects.length : projects.filter((project) => (project.discipline ?? 'Hardware & AI') === item).length}</span></button>)}
      </div>
      <div className="project-results" key={filter}>
        {visible.map((project) => {
          const isOpen = open === project.id
          return (
            <article key={project.id} className={`project-card project-card-interactive ${project.id === 'igor' ? 'project-card-featured' : ''}`}>
              <button id={`project-toggle-${project.id}`} type="button" className="grid w-full gap-5 text-left md:grid-cols-[130px_1fr_auto] md:items-start" aria-expanded={isOpen} aria-controls={`project-${project.id}`} onClick={() => setOpen(isOpen ? null : project.id)}>
                <span className="font-mono text-[0.65rem] uppercase leading-5 tracking-[0.12em] text-white/60">{project.eyebrow}</span>
                <span>
                  <span className="block text-2xl font-semibold tracking-tight md:text-3xl">{project.title}</span>
                  {project.status === 'ongoing' ? <span className="project-status">In progress</span> : null}
                  <span className="mt-3 block max-w-2xl text-sm leading-6 text-white/65">{project.context}</span>
                </span>
                <span className="project-toggle"><ChevronDown size={18} aria-hidden="true" /></span>
              </button>
              <div id={`project-${project.id}`} className="project-disclosure" hidden={!isOpen} role="region" aria-labelledby={`project-toggle-${project.id}`}>
                <div className="project-disclosure-inner">
                  {project.images ? <div className="project-gallery">{project.images.map((item) => <figure key={item.src}><button type="button" data-zoom-src={item.src} data-zoom-alt={item.alt} aria-label={`Enlarge: ${item.caption}`}><img src={item.src} alt={item.alt} loading="lazy" width="720" height="1280" /></button><figcaption>{item.caption}</figcaption></figure>)}</div> : null}
                  {project.metrics ? <dl className="project-metrics">{project.metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> : null}
                  <div className="grid gap-7 md:grid-cols-2">
                    <div><p className="eyebrow">My contribution</p><p className="mt-2 text-sm leading-7 text-white/70">{project.role}</p></div>
                    <div><p className="eyebrow">Engineering challenge</p><p className="mt-2 text-sm leading-7 text-white/70">{project.challenge}</p></div>
                    <div><p className="eyebrow">Built with</p><div className="mt-3 flex flex-wrap gap-2">{project.stack.map((tool) => <span key={tool} className="info-chip">{tool}</span>)}</div></div>
                    <div><p className="eyebrow">Result</p><p className="mt-2 text-sm leading-7 text-white/70">{project.outcome}</p>{project.status === 'ongoing' ? <span className="project-status">In progress</span> : null}</div>
                  </div>
                  {project.href ? <a href={project.href} target="_blank" rel="noreferrer" className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[hsl(var(--accent))]">Explore project <ArrowUpRight size={16} aria-hidden="true" /></a> : null}
                  {project.resources ? <div className="project-resources">{project.resources.map((resource) => <a key={resource.href} href={resource.href} target="_blank" rel="noreferrer"><span>{resource.title}<small>{resource.format}</small></span><ArrowUpRight size={18} aria-hidden="true" /></a>)}</div> : null}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
