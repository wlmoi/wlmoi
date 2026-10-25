import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Mail, Send } from 'lucide-react'
import { buildMailto, contactSchema, sanitizeText, type ContactInput } from '../../lib/validation'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/Button'

const initialState: ContactInput = {
  name: '',
  email: '',
  subject: '',
  category: 'General',
  message: '',
  website: '',
}

export function ContactForm() {
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'fallback'>('idle')
  const [submittedAt, setSubmittedAt] = useState<number | null>(() => {
    try {
      const stored = Number(window.localStorage.getItem('wa_contact_last_submit'))
      return Number.isFinite(stored) && stored > 0 ? stored : null
    } catch { return null }
  })

  const setField = <K extends keyof ContactInput>(key: K, value: ContactInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsed = contactSchema.safeParse(form)
    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof ContactInput, string>> = {}
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof ContactInput
        if (!nextErrors[key]) nextErrors[key] = issue.message
      })
      setErrors(nextErrors)
      const firstInvalid=Object.keys(nextErrors)[0]
      document.getElementById(firstInvalid)?.focus()
      return
    }

    if (form.website) return

    const now = Date.now()
    if (submittedAt && now - submittedAt < 60_000) {
      setErrors({ message: 'Please wait a minute before sending another message.' })
      return
    }

    setStatus('sending')
    setErrors({})

    const payload = {
      name: sanitizeText(parsed.data.name),
      email: sanitizeText(parsed.data.email),
      subject: sanitizeText(parsed.data.subject),
      category: parsed.data.category,
      message: sanitizeText(parsed.data.message),
    }

    if (supabase) {
      try {
        const { error } = await supabase.from('contact_messages').insert(payload)
        if (!error) {
          try { window.localStorage.setItem('wa_contact_last_submit', String(now)) } catch { /* Session cooldown remains active. */ }
          setSubmittedAt(now)
          setStatus('success')
          setForm(initialState)
          return
        }
      } catch { /* Offer the email fallback after network failures too. */ }
    }

    try { window.localStorage.setItem('wa_contact_last_submit', String(now)) } catch { /* Session cooldown remains active. */ }
    setSubmittedAt(now)
    setStatus('fallback')
    window.location.href = buildMailto(payload)
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setField('website', event.target.value)} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name" htmlFor="name" error={errors.name}>
          <input id="name" name="name" className="form-control" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} value={form.name} onChange={(e) => setField('name', e.target.value)} autoComplete="name" />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input id="email" type="email" name="email" className="form-control" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} value={form.email} onChange={(e) => setField('email', e.target.value)} autoComplete="email" />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_220px]">
        <Field label="Subject" htmlFor="subject" error={errors.subject}>
          <input id="subject" name="subject" className="form-control" aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? 'subject-error' : undefined} value={form.subject} onChange={(e) => setField('subject', e.target.value)} />
        </Field>
        <Field label="Category" htmlFor="category" error={errors.category}>
          <select id="category" name="category" className="form-control category-select" aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? 'category-error' : undefined} value={form.category} onChange={(e) => setField('category', e.target.value as ContactInput['category'])}>
            {['Internship', 'Research collaboration', 'Engineering opportunity', 'General', 'Other'].map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Message" htmlFor="message" error={errors.message}>
        <textarea id="message" name="message" rows={7} className="form-control resize-y" aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} value={form.message} onChange={(e) => setField('message', e.target.value)} />
      </Field>

      <div className="flex flex-col gap-4 border-t border-white/[0.1] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-md" role="status" aria-live="polite">
          {status === 'success' ? <p className="text-sm text-[hsl(var(--accent))]">Message submitted successfully. Thank you for reaching out.</p> : null}
          {status === 'fallback' ? <p className="text-sm text-white/[0.55]">Your message is ready for your email app. Review it and press Send there.</p> : null}
          {status === 'idle' ? <p className="text-xs leading-5 text-white/[0.38]">Have a project or opportunity in mind? Share a few details to start the conversation.</p> : null}
        </div>
        <Button type="submit" icon={false} disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send Message'} <Send size={15} aria-hidden="true" />
        </Button>
      </div>
      <a href="mailto:willomooi@gmail.com" className="inline-flex min-h-11 items-center gap-2 text-sm text-white/[0.6] hover:text-white">
        <Mail size={14} aria-hidden="true" /> Or email {"willomooi@gmail.com"} directly
      </a>
    </form>
  )
}

function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block font-mono text-[0.68rem] uppercase tracking-[0.09em] text-white/[0.45]">{label}</label>
      {children}
      {error ? <p className="form-error" id={`${htmlFor}-error`}>{error}</p> : null}
    </div>
  )
}
