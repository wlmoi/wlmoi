import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react'
import { person } from '../../data/portfolio'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { gsap } from '../../lib/gsap'

const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4'

export function Hero({ activeId }: { activeId: string }) {
  const root = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = useReducedMotion()
  const [videoPlaying, setVideoPlaying] = useState(!reducedMotion)
  const [videoError, setVideoError] = useState(false)


  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (reducedMotion) {
      video.pause()
      setVideoPlaying(false)
      return
    }

    if (!videoError) {
      void video.play().then(() => setVideoPlaying(true)).catch(() => setVideoPlaying(false))
    }
  }, [reducedMotion, videoError])

  useEffect(() => {
    if (reducedMotion) return
    const context = gsap.context(() => {
      gsap.fromTo('[data-hero-line]', { yPercent: 115, opacity: 0, rotateX: 18 }, {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.25,
        stagger: 0.16,
        delay: 0.35,
        ease: 'power4.out',
      })
      gsap.to('[data-hero-line-accent]', { backgroundPositionX: '200%', duration: 4, repeat: -1, ease: 'none' })
    }, root)
    return () => context.revert()
  }, [reducedMotion])

  const toggleVideo = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      void video.play().then(() => setVideoPlaying(true)).catch(() => setVideoPlaying(false))
    } else {
      video.pause()
      setVideoPlaying(false)
    }
  }

  return (
    <section ref={root} id="home" className="relative min-h-screen overflow-hidden" aria-label="William Anthony introduction">
      <div className="absolute inset-0 z-0 bg-[hsl(var(--background))]" aria-hidden="true">
        {!videoError ? (
          <video
            ref={videoRef}
            className="absolute inset-0 z-0 h-full w-full object-cover"
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-[hsl(var(--background))] bg-cover bg-center" style={{ backgroundImage: "url('/photos/Foto%20DiBraga%20Blurred.png')" }} />
        )}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 lg:px-8">
        <div data-hero-nav className="hero-desktop-nav animate-fade-rise">
          <div className="liquid-glass flex items-center justify-between rounded-full px-4 py-3 md:px-5">
            <a href="#home" className="font-display text-xl tracking-tight text-white sm:text-2xl" aria-label="William Anthony home">
              William Anthony<span className="align-super ml-0.5 text-[0.55em] text-white/[0.65]">®</span>
            </a>

            <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
              {[
                ['Home', 'home'], ['Profile', 'profile'], ['Expertise', 'expertise'], ['Experience', 'experience'],
                ['Selected Work', 'work'], ['Recognition', 'recognition'], ['Contact', 'contact'],
              ].map(([label, id]) => <a key={id} href={`#${id}`} className={`hero-nav-link text-sm transition-colors ${activeId === id ? 'is-active text-white' : 'text-white/[0.65] hover:text-white'}`}>{label}</a>)}
              <a href="#contact" className="liquid-glass rounded-full px-5 py-2.5 text-sm text-white transition-transform hover:scale-[1.03]">Discuss an Opportunity</a>
            </nav>

          </div>
        </div>

        <div className="hero-content flex flex-1 items-center justify-center py-12 sm:py-16 lg:py-20">
          <div className="w-full max-w-6xl text-center">
            <p data-hero-eyebrow className="hero-eyebrow eyebrow animate-fade-rise text-white/[0.85]">ASIC · FPGA · VERIFICATION · EDGE AI</p>
            <p className="hero-eyebrow mt-4 text-xs font-medium uppercase tracking-[0.18em] text-white/[0.68]">Electrical & Electronics Engineering · ITB · STEI-R&apos;23</p>

            <h1 data-hero-heading style={{ fontFamily: "'Instrument Serif', serif" }} className="hero-hover-highlight animate-fade-rise mx-auto mt-5 max-w-6xl text-[clamp(3.1rem,7.5vw,7.5rem)] leading-[0.91] tracking-[-0.045em] text-white">
              <span data-hero-line className="block">Engineering intelligence</span>
              <span data-hero-line data-hero-line-accent className="hero-line-accent block text-white/[0.78] italic not-italic md:italic">from RTL to real-world systems.</span>
            </h1>

            <p data-hero-copy className="hero-hover-highlight animate-fade-rise-delay mx-auto mt-8 max-w-2xl text-base leading-7 text-white/[0.67] sm:text-lg sm:leading-8">
              William Anthony is an Electrical and Electronics Engineering student at Institut Teknologi Bandung, designing verified digital hardware, intelligent embedded systems, and data-driven engineering tools.
            </p>

            <div data-hero-cta className="animate-fade-rise-delay-2 mt-10 flex flex-wrap items-center justify-center gap-3">
              <a href="#work" className="liquid-glass inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white transition-transform hover:scale-[1.03] sm:px-10">
                Explore Selected Work <ArrowDown size={15} aria-hidden="true" />
              </a>
              <a href="/resume?print=1" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/[0.2] px-7 py-4 text-sm font-semibold text-white/[0.9] transition-colors hover:border-white/[0.45] hover:text-white">
                Download Résumé <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>

            <p className="hero-hover-highlight mx-auto mt-6 max-w-xl text-sm leading-6 text-white/[0.88]">Always learning, building, and connecting ideas from silicon logic to real-world systems.</p>
            <div data-hero-meta className="animate-fade-rise-delay-2 mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/[0.72]">
              <a href={person.linkedin} target="_blank" rel="noreferrer" className="hero-hover-link transition-colors hover:text-white">LinkedIn</a>
              <span aria-hidden="true">/</span>
              <a href={person.github} target="_blank" rel="noreferrer" className="hero-hover-link transition-colors hover:text-white">GitHub</a>
              <span aria-hidden="true">/</span>
              <a href={person.githubRepository} target="_blank" rel="noreferrer" className="hero-hover-link transition-colors hover:text-white">Source</a>
              <span aria-hidden="true">/</span>
              <a href={person.instagram} target="_blank" rel="noreferrer" className="hero-hover-link transition-colors hover:text-white">Instagram</a>
              <span aria-hidden="true">/</span>
              <a href={`mailto:${person.email}`} className="hero-hover-link transition-colors hover:text-white">{person.email}</a>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-5 pb-2">
          <button
            type="button"
            onClick={toggleVideo}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.15] bg-black/10 px-4 text-xs font-medium text-white/[0.75] backdrop-blur-sm transition-colors hover:border-white/[0.3] hover:text-white"
            aria-label={videoPlaying ? 'Pause hero video' : 'Resume hero video'}
          >
            {videoPlaying ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
            <span>{videoError ? 'Static visual' : videoPlaying ? 'Pause visual' : 'Resume visual'}</span>
          </button>
        </div>
      </div>
    </section>
  )
}
