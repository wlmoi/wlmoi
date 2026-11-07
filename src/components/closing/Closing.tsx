import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Code, FileText, Mail, Trophy } from 'lucide-react'
import { person, recognitions } from '../../data/portfolio'
import { ContactForm } from '../contact/ContactForm'

const featured = [
  { rank: 'Winner', title: 'IEEE Chipathon 2025', note: 'Agentic AI and chip design', href: 'https://www.linkedin.com/feed/update/urn:li:activity:7412029754188414976/' },
  { rank: 'Second Place', title: 'PERURI Chip Hackathon 2026', note: 'IGOR, with team iSeeDesignITB', href: 'https://stei.itb.ac.id/tim-iseedesignitb-stei-itb-raih-juara-2-kategori-ic-design-pada-peruri-chip-hackathon-2026/' },
  { rank: 'Most Outstanding Student 2026', title: 'Electrical and Electronics Engineering', note: 'Institut Teknologi Bandung', href: '' },
]
const featuredTitles = ['Winner, IEEE Chipathon 2025', '2nd Place, PERURI Chip Hackathon 2026', 'Most Outstanding Electrical and Electronics Engineering Student 2026']

export function Closing() {
  const track = useRef<HTMLUListElement>(null)
  const [moreAwards, setMoreAwards] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [slide, setSlide] = useState(0)
  const rest = recognitions.filter((item) => !featuredTitles.includes(item.title))

  const scrollToSlide = (to: number) => {
    const node = track.current
    if (!node) return
    const target = Math.max(0, Math.min(featured.length - 1, to))
    const child = node.children[target] as HTMLElement | undefined
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (child) node.scrollTo({ left: child.offsetLeft - node.offsetLeft, behavior: reduce ? 'auto' : 'smooth' })
    setSlide(target)
  }
  const onScroll = () => {
    const node = track.current
    if (!node) return
    const width = (node.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1
    setSlide(Math.round(node.scrollLeft / (width + 16)))
  }

  return (
    <section id="about" className="xc-section" aria-labelledby="about-title">
      <div className="xc-shell">
        <div className="xc-about">
          <figure className="xc-photo">
            <img src="/photos/WilliamAnthonyCasual.jpg" alt="William Anthony standing on a balcony above a hillside farm" width="600" height="800" loading="lazy" />
            <img className="xc-photo-inset" src="/OUTSTANDING.jpg" alt="William receiving an outstanding student recognition" width="120" height="120" loading="lazy" />
          </figure>
          <div className="xc-about-copy">
            <h2 id="about-title">Curious by nature. Engineer by practice.</h2>
            <p>I enjoy understanding how things work and seeing how far I can take what I build.</p>
            <div className="xc-facts">
              <span>Graduating July 2027</span><span>GPA 3.70 of 4.00</span>
            </div>
            <div className="xc-links">
              <a href={person.resumeUrl} className="xh-btn xh-btn-ghost"><FileText size={15} aria-hidden="true" /> View résumé</a>
              <a href={person.paperUrl} target="_blank" rel="noreferrer" className="xh-btn xh-btn-ghost">Read the IEEE paper <ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
          </div>
        </div>

        <div className="xc-recognition" role="region" aria-roledescription="carousel" aria-label="Recognition">
          <div className="xc-recognition-head">
            <h3>Recognition</h3>
            <div className="xc-recognition-nav">
              <button type="button" onClick={() => scrollToSlide(slide - 1)} aria-label="Previous recognition" disabled={slide === 0}><ArrowLeft size={15} aria-hidden="true" /></button>
              <span aria-live="polite">{slide + 1} of {featured.length}</span>
              <button type="button" onClick={() => scrollToSlide(slide + 1)} aria-label="Next recognition" disabled={slide >= featured.length - 1}><ArrowRight size={15} aria-hidden="true" /></button>
            </div>
          </div>
          <ul className="xc-track" ref={track} onScroll={onScroll}>
            {featured.map((item, i) => (
              <li key={item.title} aria-roledescription="slide" aria-label={`${i + 1} of ${featured.length}`}>
                <Trophy size={18} aria-hidden="true" />
                <p className="xc-rank">{item.rank}</p>
                <p className="xc-title">{item.title}</p>
                <p className="xc-note">{item.note}</p>
                {item.href ? <a href={item.href} {...(item.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>See the details <ArrowUpRight size={13} aria-hidden="true" /></a> : null}
              </li>
            ))}
          </ul>
          <button type="button" className="xc-expand" aria-expanded={moreAwards} aria-controls="xc-more-awards" onClick={() => setMoreAwards((value) => !value)}>
            {moreAwards ? 'Show fewer awards' : `More awards and honors (${rest.length})`} <ChevronDown size={14} aria-hidden="true" />
          </button>
          <ul id="xc-more-awards" className="xc-more" hidden={!moreAwards}>
            {rest.map((item) => <li key={`${item.title}-${item.year}`}><span>{item.title}</span><small>{item.issuer ? `${item.issuer}, ` : ''}{item.year}</small></li>)}
          </ul>
        </div>

        <div id="contact" className="xc-contact" tabIndex={-1}>
          <div>
            <h2>Let’s build something meaningful.</h2>
            <p>I’m always interested in learning from others, exchanging ideas, and working on challenging engineering problems. Feel free to reach out.</p>
          </div>
          <div className="xc-contact-actions">
            <a className="xh-btn xh-btn-primary" href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></a>
            <a className="xh-btn xh-btn-ghost" href={person.github} target="_blank" rel="noreferrer"><Code size={15} aria-hidden="true" /> GitHub</a>
            <a className="xh-btn xh-btn-ghost" href={`mailto:${person.email}`}><Mail size={15} aria-hidden="true" /> Email</a>
            <button type="button" className="xc-expand" aria-expanded={showForm} aria-controls="xc-form" onClick={() => setShowForm((value) => !value)}>
              {showForm ? 'Hide the message form' : 'Send a message here'} <ChevronDown size={14} aria-hidden="true" />
            </button>
          </div>
          <div id="xc-form" className="xc-form liquid-glass" hidden={!showForm}>{showForm ? <ContactForm /> : null}</div>
        </div>
      </div>
    </section>
  )
}
