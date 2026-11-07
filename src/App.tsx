import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Hero } from './components/hero/Hero'
import { Dock } from './components/navigation/Dock'
import { ScrollProgress } from './components/navigation/ScrollProgress'
import { Exhibition } from './components/exhibition/Exhibition'
import { Background } from './components/background/Background'
import { Closing } from './components/closing/Closing'
import { LogoIntro } from './components/intro/LogoIntro'
import { SiteFooter } from './components/layout/SiteFooter'
import { person } from './data/portfolio'
import { ResumePage } from './pages/ResumePage'
import { ImageLightbox } from './components/ui/ImageLightbox'

function PortfolioPage() {
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const frame = requestAnimationFrame(() => {
      try { document.getElementById(decodeURIComponent(hash))?.scrollIntoView({ behavior: 'instant', block: 'start' }) } catch { /* Ignore malformed anchor URLs. */ }
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const siteUrl = import.meta.env.VITE_SITE_URL?.trim() || 'https://wlmoi.vercel.app'
    document.title = 'William Anthony | Edge AI, Microelectronics & Digital Hardware'
    document.documentElement.lang = 'en'

    const setMeta = (selector: string, attribute: string, content: string) => {
      const node = document.querySelector(selector)
      if (node) node.setAttribute(attribute, content)
    }

    setMeta('meta[name="description"]', 'content', 'William Anthony: Junior Edge AI Engineer and Microelectronics Research Assistant at ITB, with Alcon internship experience. Explore embedded AI, digital hardware, RTL verification, DSP, and production automation.')
    setMeta('meta[property="og:url"]', 'content', siteUrl)
    setMeta('meta[property="og:image"]', 'content', `${siteUrl.replace(/\/$/, '')}/og-engineering.png`)
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
          jobTitle: ['Junior Edge AI Engineer', 'Microelectronics Research Assistant', person.role],
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

  return (
    <div className="xs-page">
      <LogoIntro />
      <ScrollProgress />
      <Dock />
      <main id="main-content">
        <Hero />
        <Exhibition />
        <Background />
        <Closing />
      </main>
      <SiteFooter />
      <ImageLightbox />
    </div>
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
