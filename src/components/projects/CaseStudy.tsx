import { useEffect, useState } from 'react'
import { featuredCaseStudy } from '../../data/portfolio'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { gsap, ScrollTrigger } from '../../lib/gsap'

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

  useEffect(() => {
    if (reducedMotion) return
    const context = gsap.context(() => {
      gsap.to('.case-node', { scale: 1.12, transformOrigin: 'center', duration: 1.1, repeat: -1, yoyo: true, stagger: 0.08, ease: 'sine.inOut' })
      gsap.to('.case-trace', { strokeDashoffset: -36, duration: 2.4, repeat: -1, ease: 'none' })
    })
    return () => context.revert()
  }, [reducedMotion])

  return (
    <section id="case-study" className="section-pad border-t border-white/[0.1]">
      <div className="section-shell">
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">Featured case study</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">{featuredCaseStudy.title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/[0.62]">{featuredCaseStudy.intro}</p>
          </div>
          <div className="case-study-kicker fx-negative" data-text="GF180MCU · 180 nm · SIGNED INT8">GF180MCU · 180 nm · SIGNED INT8</div>
        </div>

        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="order-2 lg:order-1">
            <div className="space-y-28">
              {featuredCaseStudy.stages.map((item, index) => (
                <article key={item.label} data-case-step className={`case-step relative min-h-[42vh] max-w-xl ${active === index ? 'case-step--active' : ''}`}>
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
              <div className="case-study-schematic relative overflow-hidden rounded-[2rem] border border-white/[0.1] bg-[#071b23] p-6 md:p-8">
                <div className="flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.1em] text-white/[0.38]">
                  <span>{stage.label}</span>
                  <span>0{active + 1} / 05</span>
                </div>
                <div className="relative mt-8 aspect-square max-h-[560px] w-full">
                  <Schematic active={active} />
                </div>
                <div className="mt-5 border-t border-white/[0.1] pt-4">
                  <p className="text-sm text-white/[0.7]">{stage.kicker}</p>
                </div>
              </div>

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

function Schematic({ active }: { active: number }) {
  const opacities = [0.38, 0.54, 0.72, 0.88, 1]
  const fill = opacities[active] ?? 1
  return (
    <svg viewBox="0 0 500 500" className="h-full w-full" role="img" aria-label="Simplified accelerator architecture schematic">
      <rect x="42" y="42" width="416" height="416" rx="10" fill="none" stroke="rgba(255,255,255,0.12)" />
      <rect x="76" y="112" width="348" height="276" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.09)" />
      {[0,1,2,3].map((row) => [0,1,2,3].map((col) => (
        <rect className="case-node" key={`${row}-${col}`} x={100 + col * 72} y={145 + row * 52} width="42" height="28" rx="5" fill={`rgba(83,240,210,${0.08 + fill * 0.06})`} stroke={`rgba(83,240,210,${0.25 + fill * 0.25})`} />
      )))}
      <rect x="76" y="72" width="105" height="24" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
      <text x="92" y="88" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="IBM Plex Mono">SERIAL HOST</text>
      <rect x="319" y="72" width="105" height="24" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
      <text x="345" y="88" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="IBM Plex Mono">SRAM</text>
      <path className="case-trace" strokeDasharray="8 10" d="M128 100V138M371 100V138M53 250H95M405 250H447" stroke={`rgba(83,240,210,${0.35 + fill * 0.55})`} strokeWidth="2" />
      <path d="M95 250H405M250 138V388" stroke="rgba(255,255,255,0.1)" strokeDasharray="6 7" />
      <rect x="184" y="407" width="132" height="28" rx="5" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />
      <text x="208" y="425" fill="rgba(255,255,255,0.54)" fontSize="10" fontFamily="IBM Plex Mono">CONTROLLER</text>
      <circle cx="72" cy="250" r="5" fill={`rgba(83,240,210,${0.45 + fill * 0.5})`} />
      <circle cx="428" cy="250" r="5" fill={`rgba(83,240,210,${0.35 + fill * 0.55})`} />
    </svg>
  )
}
