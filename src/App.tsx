import { useEffect, useMemo, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Hero } from './components/hero/Hero'
import { Navigation } from './components/navigation/Navigation'
import { ExperienceTimeline } from './components/experience/ExperienceTimeline'
import { ProjectList } from './components/projects/ProjectList'
import { CaseStudy } from './components/projects/CaseStudy'
import { EngineeringVisual } from './components/three/EngineeringVisual'
import { ContactForm } from './components/contact/ContactForm'
import { SiteFooter } from './components/layout/SiteFooter'
import { ProfileSection } from './components/profile/ProfileSection'
import { capabilities, person, recognitions, skillGroups } from './data/portfolio'
import { ResumePage } from './pages/ResumePage'
import { gsap } from './lib/gsap'
import { ImageLightbox } from './components/ui/ImageLightbox'

const sections = ['home', 'profile', 'expertise', 'experience', 'work', 'recognition', 'contact']

function PortfolioPage() {
  const [activeId, setActiveId] = useState('home')

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveId(visible.target.id)
    }, { rootMargin: '-32% 0px -52% 0px', threshold: [0.1, 0.3, 0.6] })

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-spectrum-copy], [data-skill-group], [data-capability-row], [data-motion-copy], [data-motion-list], [data-motion-card]').forEach((element) => {
        gsap.fromTo(element, { opacity: 0, y: 24 }, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 86%', once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-skill-chip]').forEach((chip) => {
        const lift = () => gsap.to(chip, { y: -5, scale: 1.04, color: '#ffffff', duration: 0.25, ease: 'power2.out' })
        const settle = () => gsap.to(chip, { y: 0, scale: 1, color: 'rgba(255,255,255,0.52)', duration: 0.35, ease: 'power2.out' })
        chip.addEventListener('mouseenter', lift)
        chip.addEventListener('mouseleave', settle)
      })
    })
    return () => context.revert()
  }, [])

  useEffect(() => {
    const siteUrl = import.meta.env.VITE_SITE_URL?.trim() || 'https://wlmoi.vercel.app'
    document.title = 'William Anthony | ASIC, FPGA, Verification & Edge AI'
    document.documentElement.lang = 'en'

    const setMeta = (selector: string, attribute: string, content: string) => {
      const node = document.querySelector(selector)
      if (node) node.setAttribute(attribute, content)
    }

    setMeta('meta[name="description"]', 'content', 'Portfolio of William Anthony, an Electrical and Electronics Engineering student working across ASIC design, FPGA systems, RTL verification, Edge AI, embedded systems, and digital signal processing.')
    setMeta('meta[property="og:url"]', 'content', siteUrl)
    setMeta('meta[property="og:image"]', 'content', `${siteUrl.replace(/\/$/, '')}/og-placeholder.svg`)
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonical) canonical.href = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`

    const ld = document.getElementById('portfolio-jsonld')
    if (ld) {
      ld.textContent = JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: person.name,
          url: siteUrl,
          email: `mailto:${person.email}`,
          jobTitle: person.role,
          alumniOf: { '@type': 'CollegeOrUniversity', name: person.institution },
          sameAs: [person.linkedin, person.github, person.instagram],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: `${person.name} Portfolio`,
          url: siteUrl,
        },
      ])
    }
  }, [])

  const capabilitySummary = useMemo(() => capabilities.map((item) => `${item.title} · ${item.summary}`), [])

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-white">
      <Navigation activeId={activeId} />
      <main id="main-content">
        <Hero activeId={activeId} />
        <ProfileSection />

        <section id="expertise" className="section-pad border-t border-white/[0.1]">
          <div className="section-shell">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div data-spectrum-copy>
                <p className="eyebrow">02 / Engineering spectrum</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">A connected system of engineering capabilities.</h2>
              </div>
              <div data-motion-copy>
                <p className="max-w-2xl text-base leading-7 text-white/[0.62]">Not a stack of badges. A progression from architecture and RTL, through verification and physical implementation, into embedded intelligence and engineering software.</p>
              </div>
            </div>

            <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
              <div className="grid gap-2">
                {capabilities.map((capability) => (
                  <CapabilityAccordion key={capability.id} capability={capability} />
                ))}
              </div>
              <EngineeringVisual />
            </div>

            <div className="mt-14 grid gap-8 border-t border-white/[0.1] pt-8 md:grid-cols-4">
              {Object.entries(skillGroups).map(([group, skills]) => (
                <div key={group} data-skill-group>
                  <p className="eyebrow">{group}</p>
                  <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-sm leading-6 text-white/[0.52]">{skills.map((skill) => <span key={skill} data-skill-chip className="inline-block cursor-default transition-colors">{skill}</span>)}</p>
                </div>
              ))}
            </div>
            <div className="sr-only">{capabilitySummary.join(' ')}</div>
          </div>
        </section>

        <CaseStudy />

        <section id="work" className="section-pad border-t border-white/[0.1]">
          <div className="section-shell">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div data-motion-copy>
                <p className="eyebrow">02 / Additional selected work</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Projects with an engineering through-line.</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-white/[0.48]">Every entry stays scoped to the evidence available. Ongoing targets are labeled as targets, not outcomes.</p>
            </div>
            <div className="mt-14">
              <ProjectList />
            </div>
          </div>
        </section>

        <section id="experience" className="section-pad border-t border-white/[0.1]">
          <div className="section-shell">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
              <div data-motion-copy>
                <p className="eyebrow">04 / Experience timeline</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Hands-on work across teaching, research, silicon, and production.</h2>
                <p className="mt-5 max-w-md text-sm leading-6 text-white/[0.52]">Dates are shown where publicly documented and verified for this implementation.</p>
              </div>
              <ExperienceTimeline />
            </div>
          </div>
        </section>

        <section id="recognition" className="section-pad border-t border-white/[0.1]">
          <div className="section-shell">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="eyebrow">05 / Education & recognition</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">A technical foundation with external signals of trust.</h2>
              </div>
              <div className="grid gap-3" data-motion-list>
                {recognitions.map((item) => (
                  <details key={`${item.title}-${item.year}`} className="group rounded-2xl border border-white/[0.1] bg-white/[0.015] px-5 py-4">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold">
                      <span>{item.title}</span>
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-white/[0.38]">{item.year}</span>
                    </summary>
                    <div className="pb-2 pt-4 text-sm leading-6 text-white/[0.55]">
                      {item.issuer ? <p>{item.issuer}</p> : null}
                      {item.detail ? <p className="mt-1">{item.detail}</p> : null}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section-pad border-t border-white/[0.1]">
          <div className="section-shell">
            <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
              <div data-motion-copy>
                <p className="eyebrow">05 / Contact</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Let’s build systems that hold up under verification.</h2>
                <p className="mt-5 max-w-md text-base leading-7 text-white/[0.58]">Open to conversations about ASIC, FPGA, design verification, Edge AI, embedded systems, research collaboration, and engineering internships.</p>
                <div className="mt-8 grid gap-2">
                  <a href={`mailto:${person.email}`} className="text-sm text-white/[0.72] hover:text-white">{person.email}</a>
                  <a href={person.linkedin} target="_blank" rel="noreferrer" className="text-sm text-white/[0.72] hover:text-white">linkedin.com/in/wlmoi</a>
                </div>
              </div>
              <div className="liquid-glass contact-panel rounded-[2rem] p-5 md:p-8" data-motion-card>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <ImageLightbox />
    </div>
  )
}

function CapabilityAccordion({ capability }: { capability: (typeof capabilities)[number] }) {
  return (
    <details data-capability-row className="group border-t border-white/[0.1] py-4 last:border-b" open={capability.id === 'asic'}>
      <summary className="flex cursor-pointer list-none items-start gap-5 py-2">
        <span className="font-mono text-[0.65rem] text-white/[0.32]">{capability.number}</span>
        <span className="flex-1">
          <span className="block text-xl font-semibold tracking-tight md:text-2xl">{capability.title}</span>
          <span className="mt-2 block max-w-xl text-sm leading-6 text-white/[0.53]">{capability.summary}</span>
        </span>
        <span className="pt-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-white/[0.32] group-open:text-[hsl(var(--accent))]">Inspect</span>
      </summary>
      <div className="ml-10 grid gap-6 pb-3 pt-4 md:grid-cols-2">
        <div>
          <p className="eyebrow">Tools</p>
          <p className="mt-3 text-sm leading-6 text-white/[0.58]">{capability.tools.join(' · ')}</p>
        </div>
        <div>
          <p className="eyebrow">Methods</p>
          <p className="mt-3 text-sm leading-6 text-white/[0.58]">{capability.methods.join(' · ')}</p>
        </div>
      </div>
    </details>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/resume" element={<ResumePage />} />
    </Routes>
  )
}
