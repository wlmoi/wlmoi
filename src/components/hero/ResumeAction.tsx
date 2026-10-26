import { useEffect, useRef } from 'react'
import { ArrowUpRight, FileText } from 'lucide-react'
import { person } from '../../data/portfolio'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { gsap } from '../../lib/gsap'

export function ResumeAction() {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const link = linkRef.current
    if (!link || reducedMotion) return
    const surface = link.querySelector<HTMLElement>('.resume-action-surface')!
    const frame = link.querySelector<HTMLElement>('.resume-action-frame')!
    const arrow = link.querySelector<HTMLElement>('.resume-action-arrow')!
    const shine = link.querySelector<HTMLElement>('.resume-action-shine')!
    const targets = [surface, frame, arrow, shine]
    const context = gsap.context(() => {
      gsap.set(shine, { xPercent: -160 })
    }, link)
    const breathe = gsap.to(frame, { opacity: 0.45, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut', paused: true })
    let visible = false
    let introduced = false
    const sweep = () => gsap.fromTo(shine, { xPercent: -160 }, { xPercent: 160, duration: 0.85, ease: 'power2.out', overwrite: true })
    const enter = () => {
      sweep()
      gsap.to(arrow, { x: 3, y: -3, rotation: 5, duration: 0.25, overwrite: true })
      gsap.to(surface, { scale: 1.025, duration: 0.3, ease: 'power2.out', overwrite: true })
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const box = link.getBoundingClientRect()
      const dx = event.clientX - box.left - box.width / 2
      const dy = event.clientY - box.top - box.height / 2
      gsap.to(surface, { x: dx * 0.075, y: dy * 0.12, scale: 1.025, duration: 0.35, ease: 'power2.out', overwrite: true })
      gsap.to(frame, { x: dx * 0.12, y: dy * 0.2, scale: 1.035, duration: 0.35, ease: 'power2.out', overwrite: true })
    }
    const reset = () => {
      gsap.to([surface, frame, arrow], { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.65, ease: 'elastic.out(1, .6)', overwrite: 'auto' })
    }
    const press = () => gsap.to(surface, { scale: 0.97, duration: 0.1, overwrite: true })
    const syncVisibility = () => {
      if (visible && !document.hidden) breathe.play()
      else breathe.pause()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !introduced) { introduced = true; sweep() }
      syncVisibility()
    }, { threshold: 0.25 })
    observer.observe(link)
    link.addEventListener('pointerenter', enter)
    link.addEventListener('pointermove', move)
    link.addEventListener('pointerleave', reset)
    link.addEventListener('pointerdown', press)
    link.addEventListener('pointerup', reset)
    link.addEventListener('pointercancel', reset)
    link.addEventListener('focus', enter)
    link.addEventListener('blur', reset)
    document.addEventListener('visibilitychange', syncVisibility)
    return () => {
      observer.disconnect()
      link.removeEventListener('pointerenter', enter)
      link.removeEventListener('pointermove', move)
      link.removeEventListener('pointerleave', reset)
      link.removeEventListener('pointerdown', press)
      link.removeEventListener('pointerup', reset)
      link.removeEventListener('pointercancel', reset)
      link.removeEventListener('focus', enter)
      link.removeEventListener('blur', reset)
      document.removeEventListener('visibilitychange', syncVisibility)
      breathe.kill()
      gsap.killTweensOf(targets)
      gsap.set([surface, frame, arrow], { clearProps: 'transform,opacity' })
      context.revert()
    }
  }, [reducedMotion])

  return (
    <a ref={linkRef} href={person.resumeUrl} className="resume-action" aria-label="View résumé" data-motion={reducedMotion ? 'reduced' : 'magnetic'}>
      <span className="resume-action-frame" aria-hidden="true"><i /><i /><i /><i /></span>
      <span className="resume-action-surface">
        <span className="resume-action-shine" aria-hidden="true" />
        <FileText className="resume-action-document" size={21} strokeWidth={1.7} aria-hidden="true" />
        <span className="resume-action-label">View résumé</span>
        <span className="resume-action-arrow" aria-hidden="true"><ArrowUpRight size={23} strokeWidth={1.8} /></span>
      </span>
    </a>
  )
}
