import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Maximize2 } from 'lucide-react'
import { showcase } from '../../data/exhibition'
import { projects } from '../../data/portfolio'
import { useIntersection } from '../../hooks/useIntersection'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { webglSupported } from '../three/HeroChip'
import { ProjectList } from '../projects/ProjectList'

const ProjectStage3D = lazy(() => import('../three/ProjectStage3D'))
const detailTabs = ['Overview', 'Technical', 'Resources'] as const
type DetailTab = (typeof detailTabs)[number]

function wrap(index: number) {
  return (index + showcase.length) % showcase.length
}

export function Exhibition() {
  const reducedMotion = useReducedMotion()
  const { ref, visible } = useIntersection<HTMLDivElement>({ threshold: 0.1 })
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [view, setView] = useState<'3d' | 'real'>('3d')
  const [tab, setTab] = useState<DetailTab>('Overview')
  const [step, setStep] = useState(0)
  const [photo, setPhoto] = useState(0)
  const [moreOpen, setMoreOpen] = useState(false)
  const [canRender] = useState(webglSupported)
  const [coarse] = useState(() => window.matchMedia('(pointer: coarse)').matches)
  const swipe = useRef<{ x: number, y: number } | null>(null)
  const project = showcase[index]
  const next = showcase[wrap(index + 1)]
  const prev = showcase[wrap(index - 1)]

  const go = useCallback((to: number, dir?: 'next' | 'prev') => {
    const target = wrap(to)
    setDirection(dir ?? (target > index || (index === showcase.length - 1 && target === 0) ? 'next' : 'prev'))
    setIndex(target)
    setStep(0)
    setPhoto(0)
    setTab('Overview')
  }, [index])

  useEffect(() => {
    const open = () => setMoreOpen(true)
    window.addEventListener('open-more-projects', open)
    return () => window.removeEventListener('open-more-projects', open)
  }, [])

  const onTabKey = (event: KeyboardEvent<HTMLElement>, count: number, current: number, set: (value: number) => void) => {
    let target = current
    if (event.key === 'ArrowRight') target = (current + 1) % count
    else if (event.key === 'ArrowLeft') target = (current - 1 + count) % count
    else if (event.key === 'Home') target = 0
    else if (event.key === 'End') target = count - 1
    else return
    event.preventDefault()
    set(target)
    const list = event.currentTarget.closest('[role="tablist"]')
    requestAnimationFrame(() => list?.querySelectorAll<HTMLElement>('[role="tab"]')[target]?.focus())
  }

  const onPointerDown = (event: PointerEvent) => { if (event.pointerType === 'touch') swipe.current = { x: event.clientX, y: event.clientY } }
  const onPointerUp = (event: PointerEvent) => {
    const start = swipe.current
    swipe.current = null
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 'next' : 'prev')
  }

  const image = project.work.images[Math.min(photo, project.work.images.length - 1)]
  const hiddenCount = projects.length

  return (
    <section id="work" className="xe-section" aria-labelledby="work-title" style={{ '--xe-accent': project.accent } as CSSProperties}>
      <div className="xe-shell" ref={ref}>
        <header className="xe-head">
          <div>
            <h2 id="work-title">Three builds, one exhibition.</h2>
          </div>
          <div className="xe-nav">
            <button type="button" className="xe-arrow" onClick={() => go(index - 1, 'prev')} aria-label={`Previous project, ${prev.short}`}>
              <ArrowLeft size={18} aria-hidden="true" /><span><small>Previous</small>{prev.short}</span>
            </button>
            <p className="xe-count" aria-live="polite"><strong>{String(index + 1).padStart(2, '0')}</strong> of {String(showcase.length).padStart(2, '0')}</p>
            <button type="button" className="xe-arrow xe-arrow-next" onClick={() => go(index + 1, 'next')} aria-label={`Next project, ${next.short}`}>
              <span><small>Next</small>{next.short}</span><ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div role="tablist" aria-label="Choose a project" className="xe-dots">
          {showcase.map((item, i) => (
            <button key={item.id} type="button" role="tab" id={`xe-tab-${item.id}`} aria-selected={i === index} aria-controls="xe-slide" tabIndex={i === index ? 0 : -1}
              onClick={() => go(i)} onKeyDown={(event) => onTabKey(event, showcase.length, index, (value) => go(value))}>
              <i aria-hidden="true" /><span>{item.short}</span>
            </button>
          ))}
        </div>

        <div id="xe-slide" className="xe-slide" role="tabpanel" aria-roledescription="slide" aria-labelledby={`xe-tab-${project.id}`}>
          <div className="xe-stage-wrap" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { swipe.current = null }}>
            <div className="xe-stage" data-view={view}>
              <div className="xe-glow" aria-hidden="true" />
              <div className="xe-switch" role="group" aria-label="Choose a view">
                <button type="button" aria-pressed={view === '3d'} onClick={() => setView('3d')}>3D View</button>
                <button type="button" aria-pressed={view === 'real'} onClick={() => setView('real')}>Real Work</button>
              </div>

              {view === '3d' ? (
                <div className="xe-3d" role="img" aria-label={`Rotating 3D model for ${project.title}`}>
                  {canRender ? (
                    <Suspense fallback={<div className="xe-loading" aria-hidden="true" />}>
                      <ProjectStage3D active={index} paused={!visible} still={reducedMotion} rotatable={!coarse} />
                    </Suspense>
                  ) : <div className="xe-fallback-visual" style={{ backgroundImage: `url(${project.preview})` }} />}
                  <p className="xe-caption">{coarse ? 'Swipe to change project.' : 'Drag to rotate.'}</p>
                </div>
              ) : (
                <figure className="xe-real" key={`${project.id}-${photo}`}>
                  <button type="button" className="xe-real-image" data-zoom-src={image.src} data-zoom-alt={image.alt} aria-label={`Enlarge: ${image.caption}`}>
                    <img src={image.src} alt={image.alt} width="1200" height="900" decoding="async" />
                    <span><Maximize2 size={13} aria-hidden="true" /> Enlarge</span>
                  </button>
                  <figcaption>
                    <strong>{image.caption}</strong>
                    <span>{project.work.note}</span>
                  </figcaption>
                  {project.work.images.length > 1 ? (
                    <div className="xe-thumbs" role="group" aria-label="Choose a photograph">
                      {project.work.images.map((item, i) => (
                        <button key={item.src} type="button" aria-pressed={i === photo} aria-label={`Show photograph ${i + 1}`} onClick={() => setPhoto(i)}><img src={item.thumb} alt="" width="64" height="48" loading="lazy" /></button>
                      ))}
                    </div>
                  ) : null}
                </figure>
              )}

              <button type="button" className="xe-peek" onClick={() => go(index + 1, 'next')} aria-label={`Show next project, ${next.short}`}>
                <span className="xe-peek-img" style={{ backgroundImage: `url(${next.preview})` }} aria-hidden="true" />
                <span className="xe-peek-text"><small>Up next</small>{next.short}</span>
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </div>

          <article className={`xe-copy xe-enter-${direction}`} key={project.id} aria-live="polite">
            <h3>{project.title}</h3>
            <p className="xe-blurb">{project.blurb}</p>
            <ul className="xe-tags" aria-label="Technologies">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            <dl className="xe-metrics">{project.metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>

            <div className="xe-tabs" role="tablist" aria-label={`${project.short} details`}>
              {detailTabs.map((name, i) => (
                <button key={name} type="button" role="tab" id={`xe-detail-${name}`} aria-selected={tab === name} aria-controls="xe-detail-panel" tabIndex={tab === name ? 0 : -1}
                  onClick={() => setTab(name)} onKeyDown={(event) => onTabKey(event, detailTabs.length, i, (value) => setTab(detailTabs[value]))}>{name}</button>
              ))}
            </div>
            <div id="xe-detail-panel" className="xe-panel" role="tabpanel" aria-labelledby={`xe-detail-${tab}`}>
              {tab === 'Overview' ? (
                <div>
                  <details className="xe-more">
                    <summary>Read more <ChevronDown size={14} aria-hidden="true" /></summary>
                    <p>{project.more}</p>
                  </details>
                </div>
              ) : null}
              {tab === 'Technical' ? (
                <div>
                  <div className="xe-steps" role="group" aria-label="Technical details">
                    {project.steps.map((item, i) => <button key={item.label} type="button" aria-pressed={i === Math.min(step, project.steps.length - 1)} onClick={() => setStep(i)}>{item.label}</button>)}
                  </div>
                  <div className="xe-step-body" key={`${project.id}-${step}`}>
                    <h4>{project.steps[Math.min(step, project.steps.length - 1)].title}</h4>
                    <p>{project.steps[Math.min(step, project.steps.length - 1)].body}</p>
                  </div>
                </div>
              ) : null}
              {tab === 'Resources' ? (
                <ul className="xe-links">
                  {project.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} {...(link.external ? { target: '_blank', rel: 'noreferrer' } : { download: true })}>
                        <span>{link.title}<small>{link.format}</small></span><ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </article>
        </div>

        <div className="xe-more-projects">
          <button type="button" aria-expanded={moreOpen} aria-controls="xe-all" onClick={() => setMoreOpen((value) => !value)}>
            {moreOpen ? 'Hide the full project list' : `Browse all ${hiddenCount} projects`} <ChevronDown size={15} aria-hidden="true" />
          </button>
          <div id="xe-all" hidden={!moreOpen}>{moreOpen ? <ProjectList /> : null}</div>
        </div>
      </div>
    </section>
  )
}
