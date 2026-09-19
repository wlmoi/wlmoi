import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react'
import { credentials, education, languages, person } from '../../data/portfolio'

const photos = [
  { src: '/photos/Foto%20DiBraga.jpeg', alt: 'William Anthony at Braga, Bandung', label: 'Braga / Bandung', width: 400, height: 400 },
  { src: '/photos/WilliamAnthonyCasual.jpg', alt: 'William Anthony outdoors', label: 'Field notes', width: 1200, height: 1600 },
  { src: '/photos/Foto-Foto%20untuk%20dishare.jpeg', alt: 'William Anthony teaching and serving with a community', label: 'Teaching / service', width: 1000, height: 1250 },
  { src: '/photos/ANUGERAHCITRAGANESHA_William_Achievement.png', alt: 'William Anthony receiving an academic achievement award', label: 'Achievement', width: 881, height: 885 },
  { src: '/photos/ASISTENPRAKTIKUM.jpeg', alt: 'William Anthony during laboratory instruction', label: 'Laboratory instruction', width: 1254, height: 836 },
  { src: '/photos/Foto%20DiBraga%20Blurred.png', alt: 'William Anthony at Braga, Bandung', label: 'Braga / portrait study', width: 1152, height: 2048 },
  { src: '/photos/GANESHAAWARD2024.jpeg', alt: 'William Anthony at the Ganesha Award ceremony', label: 'Ganesha Award', width: 1080, height: 1078 },
  { src: '/photos/ISPACS2025.jpeg', alt: 'William Anthony at ISPACS 2025', label: 'ISPACS 2025', width: 720, height: 1280 },
  { src: '/photos/ITB86.jpeg', alt: 'William Anthony at an Institut Teknologi Bandung activity', label: 'ITB community', width: 1280, height: 960 },
  { src: '/photos/KADERBELANEGARA.jpeg', alt: 'William Anthony at a civic leadership activity', label: 'Civic leadership', width: 1280, height: 960 },
  { src: '/photos/MENEMBAK.JPG', alt: 'William Anthony at a field activity', label: 'Field activity', width: 2592, height: 1728 },
  { src: '/photos/MENWAITB.jpeg', alt: 'William Anthony with the ITB community', label: 'ITB community', width: 1280, height: 960 },
  { src: '/photos/PEMATERI_ITB_JTR2024.jpeg', alt: 'William Anthony presenting at ITB JTR 2024', label: 'Presenter / 2024', width: 800, height: 599 },
  { src: '/photos/PENGABDIANKEAGAMAAN.jpeg', alt: 'William Anthony during a community service activity', label: 'Community service', width: 1280, height: 720 },
  { src: '/photos/PPSNMENGAJAR2023_KETUA.jpeg', alt: 'William Anthony teaching during PPSN 2023', label: 'Teaching / 2023', width: 960, height: 1280 },
  { src: '/photos/PPSNMENGAJAR2023_PANIT.jpeg', alt: 'William Anthony supporting PPSN 2023', label: 'PPSN / 2023', width: 1280, height: 720 },
  { src: '/photos/PPSNMENGAJAR2024.jpeg', alt: 'William Anthony teaching during PPSN 2024', label: 'Teaching / 2024', width: 1600, height: 1200 },
  { src: '/photos/SOTONG.jpeg', alt: 'William Anthony at a student activity', label: 'Student life', width: 960, height: 1280 },
]

export function ProfileSection() {
  return (
    <section id="profile" className="section-pad border-t border-white/[0.1]">
      <div className="section-shell">
        <FullBleedCarousel />

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

          <div>
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

function FullBleedCarousel() {
  const slideRefs = useRef<Array<HTMLDivElement | null>>([])
  const [activePhoto, setActivePhoto] = useState(0)

  const goTo = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const next = (index + photos.length) % photos.length
    setActivePhoto(next)
    slideRefs.current[next]?.scrollIntoView({ behavior, block: 'nearest', inline: 'center' })
  }

  useEffect(() => {
    const timer = window.setInterval(() => goTo(activePhoto + 1), 5600)
    return () => window.clearInterval(timer)
  }, [activePhoto])

  return (
    <div className="photo-carousel photo-carousel--full-bleed" aria-label="William Anthony photo carousel">
      <div className="photo-carousel-track" role="region" aria-live="polite">
        {photos.map((item, index) => (
          <div
            key={item.src}
            ref={(element) => { slideRefs.current[index] = element }}
            className="photo-carousel-slide"
            style={{ aspectRatio: `${item.width} / ${item.height}` }}
            aria-label={`${index + 1} of ${photos.length}: ${item.label}`}
          >
            <img src={item.src} alt={item.alt} width={item.width} height={item.height} className="photo-carousel-image" />
          </div>
        ))}
      </div>
      <div className="photo-carousel-overlay">
        <div>
          <p className="eyebrow text-white/[0.65]">Field notes / visual index</p>
          <p className="mt-2 text-sm font-semibold text-white">{photos[activePhoto].label}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.65rem] text-white/[0.7]">{String(activePhoto + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span>
          <button type="button" onClick={() => goTo(activePhoto - 1)} className="photo-carousel-button" aria-label="Previous profile photo"><ChevronLeft size={17} aria-hidden="true" /></button>
          <button type="button" onClick={() => goTo(activePhoto + 1)} className="photo-carousel-button" aria-label="Next profile photo"><ChevronRight size={17} aria-hidden="true" /></button>
        </div>
      </div>
      <article className="outstanding-card" aria-label="William Anthony recognition">
        <img src="/OUTSTANDING.jpg" alt="William Anthony receiving an outstanding student recognition" width="225" height="225" />
        <div className="outstanding-card-copy">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[hsl(var(--accent))]">Recognition / 2026</p>
          <p className="mt-1 text-sm font-semibold leading-5">William Anthony, an outstanding engineer in the making.</p>
          <p className="mt-1 text-[0.68rem] leading-4 text-white/[0.58]">Curious, precise, and always building the next layer.</p>
        </div>
      </article>
      <div className="photo-carousel-dots" aria-label="Choose a photo">
        {photos.map((item, index) => <button key={item.src} type="button" onClick={() => goTo(index)} className={index === activePhoto ? 'is-active' : ''} aria-label={`Show ${item.label}`} aria-current={index === activePhoto ? 'true' : undefined} />)}
      </div>
    </div>
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
