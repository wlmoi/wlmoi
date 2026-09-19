import { useEffect, useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react'
import { credentials, education, languages, person } from '../../data/portfolio'

const photos = [
  { src: '/photos/Foto%20DiBraga.jpeg', alt: 'William Anthony at Braga, Bandung', label: 'Braga / Bandung' },
  { src: '/photos/WilliamAnthonyCasual.jpg', alt: 'William Anthony outdoors', label: 'Field notes' },
  { src: '/photos/Foto-Foto%20untuk%20dishare.jpeg', alt: 'William Anthony teaching and serving with a community', label: 'Teaching / service' },
]

export function ProfileSection() {
  const [activePhoto, setActivePhoto] = useState(0)
  const photo = photos[activePhoto]

  useEffect(() => {
    const timer = window.setInterval(() => setActivePhoto((current) => (current + 1) % photos.length), 6500)
    return () => window.clearInterval(timer)
  }, [])

  const movePhoto = (direction: -1 | 1) => {
    setActivePhoto((current) => (current + direction + photos.length) % photos.length)
  }

  return (
    <section id="profile" className="section-pad border-t border-white/[0.1]">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
          <div>
            <p className="eyebrow">01 / Profile signal</p>
            <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight md:text-6xl">A builder with a human interface.</h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/[0.62]">Hardware is the through-line. Teaching, research, data, and software are how I learn to make it useful in the real world.</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href={person.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[hsl(var(--background))] transition-transform hover:scale-[1.03]">
                <Download size={15} aria-hidden="true" /> View résumé
              </a>
              <a href={person.paperUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.16] px-5 text-sm font-semibold text-white transition-colors hover:border-white/[0.45]">
                Read IEEE paper <ExternalLink size={15} aria-hidden="true" />
              </a>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              <ProfileStat value={person.gpa} label="GPA" />
              <ProfileStat value="2027" label="Expected graduation" />
              <ProfileStat value="4 × 4" label="PE array" />
              <ProfileStat value="24%" label="Die area reduction" />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
            <div className="photo-carousel relative overflow-hidden rounded-[2rem] border border-white/[0.12] bg-[#071b23]">
              <div className="aspect-[4/5] min-h-[360px] w-full">
                <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover object-[center_28%] transition-opacity duration-500" />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/75 via-black/15 to-transparent p-5 pt-20">
                <div>
                  <p className="eyebrow text-white/[0.65]">{String(activePhoto + 1).padStart(2, '0')} / 03</p>
                  <p className="mt-2 text-sm font-semibold text-white">{photo.label}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => movePhoto(-1)} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-white/[0.2] bg-black/20 text-white hover:border-white/[0.55]" aria-label="Previous profile photo">
                    <ChevronLeft size={17} aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => movePhoto(1)} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-white/[0.2] bg-black/20 text-white hover:border-white/[0.55]" aria-label="Next profile photo">
                    <ChevronRight size={17} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              <div className="liquid-glass rounded-[2rem] p-6">
                <p className="eyebrow">Education</p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">{education.degree}</h3>
                <p className="mt-2 text-sm text-white/[0.62]">{education.institution} · {education.location}</p>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-white/[0.42]">{education.dates} · GPA {education.gpa}</p>
                <p className="mt-5 text-sm leading-6 text-white/[0.57]">Focus: {education.focus.join(' · ')}</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <InfoList title="Coursework" items={education.coursework} />
                <InfoList title="Languages" items={languages.map(([name, level]) => `${name} · ${level}`)} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-white/[0.1] pt-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Credentials & recognition</p>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/[0.55]">A record of technical learning, academic standing, and the work behind the portfolio.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {credentials.map((credential) => (
              <div key={`${credential.title}-${credential.issuer}`} className="border-b border-white/[0.1] pb-4">
                <p className="text-sm font-semibold text-white/[0.86]">{credential.title}</p>
                <p className="mt-1 text-xs leading-5 text-white/[0.47]">{credential.issuer}{credential.date ? ` · ${credential.date}` : ''}</p>
                {credential.credentialId ? <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-white/[0.32]">ID {credential.credentialId}</p> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.1] pt-6">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-white/[0.38]">Most Outstanding E&E Engineering Student · 2026</p>
          <a href={person.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[hsl(var(--accent))]">Connect on LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  )
}

function ProfileStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-white/[0.14] pl-3">
      <p className="font-display text-3xl text-[hsl(var(--accent))]">{value}</p>
      <p className="mt-1 font-mono text-[0.6rem] uppercase leading-4 tracking-[0.08em] text-white/[0.42]">{label}</p>
    </div>
  )
}

function InfoList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="rounded-[1.5rem] border border-white/[0.1] p-5">
      <p className="eyebrow">{title}</p>
      <p className="mt-3 text-sm leading-6 text-white/[0.55]">{items.join(' · ')}</p>
    </div>
  )
}
