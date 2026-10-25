import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { featuredCaseStudy, person } from '../../data/portfolio'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { FluidShowcase } from '../three/FluidShowcase'

export function CaseStudy() {
  const [active, setActive] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const triggers: ScrollTrigger[] = []
    const steps = gsap.utils.toArray<HTMLElement>('[data-case-step]')
    if (reducedMotion || steps.length === 0) return

    steps.forEach((step, index) => {
      triggers.push(ScrollTrigger.create({
        trigger: step,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActive(index),
        onEnterBack: () => setActive(index),
      }))
    })

    return () => triggers.forEach((trigger) => trigger.kill())
  }, [reducedMotion])

  const stage = featuredCaseStudy.stages[active]


  return (
    <section id="case-study" className="section-pad border-t border-white/[0.1]">
      <div className="section-shell">
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">Featured case study</p>
            <VoltageHeading text={featuredCaseStudy.title} className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl" />
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/[0.62]">{featuredCaseStudy.intro}</p>
          </div>
          <div className="case-study-kicker fx-negative" data-text="GF180MCU · 180 nm · SIGNED INT8">GF180MCU · 180 nm · SIGNED INT8</div>
        </div>

        <div className="case-study-resources project-resources">
          <a href="/presentations/APSIPA-2026-GAN-Accelerator.pptx" download><span>GAN accelerator — complete presentation<small>PPTX · 38 slides · 4.3 MB</small></span><ArrowUpRight size={18} aria-hidden="true" /></a>
          <a href={person.paperUrl} target="_blank" rel="noreferrer"><span>Read the research paper<small>PDF · Architecture, results, and verification</small></span><ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>

        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="order-2 lg:order-1">
            <div className="space-y-28">
              {featuredCaseStudy.stages.map((item, index) => (
                <article key={item.label} data-case-step className={`case-step relative w-full max-w-xl ${active === index ? 'case-step--active' : ''}`}>
                  <span className="case-step-indicator" aria-hidden="true"><span /></span>
                  <p className="eyebrow">{String(index + 1).padStart(2, '0')} / {item.label}</p>
                  <h3 className="mt-4 text-2xl font-semibold md:text-3xl">{item.kicker}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/[0.62] md:text-base">{item.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="sticky top-28">
              <div className="case-stage-select" role="group" aria-label="GAN architecture stages">
                {featuredCaseStudy.stages.map((item,index)=><button type="button" key={item.label} aria-pressed={active===index} onClick={()=>setActive(index)}><span>0{index+1}</span>{item.label}</button>)}
              </div>
              <FluidShowcase title="GAN compute fabric" initialEffect="lattice" stage={active} layoutLink />
              <p className="case-stage-caption">{stage.kicker}</p>

              <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-5 md:grid-cols-4">
                {featuredCaseStudy.metrics.map(([label, value]) => (
                  <div className="project-metric" key={label}>
                    <p className="font-mono text-[0.62rem] uppercase leading-4 tracking-[0.08em] text-white/[0.38]">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-[hsl(var(--accent))]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function VoltageHeading({ text, className }: { text: string; className: string }) {
  return <h2 className={`fx-voltage ${className}`} data-text={text}>{text}</h2>
}
