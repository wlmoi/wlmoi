import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { ArrowLeft, Download } from 'lucide-react'
import { credentials, education, person, projects, recognitions, experiences, skillGroups } from '../data/portfolio'

export function ResumePage() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('print')) {
      const timer = window.setTimeout(() => window.print(), 450)
      return () => window.clearTimeout(timer)
    }
  }, [])

  return (
    <main className="resume-page min-h-screen bg-[#f7f8f8] px-6 py-10 text-slate-900 md:px-10">
      <div className="no-print mx-auto mb-8 flex max-w-4xl items-center justify-between">
        <a href="/#home" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-300 px-4 text-sm font-semibold"><ArrowLeft size={15} aria-hidden="true" /> Back to portfolio</a>
        <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white"><Download size={15} aria-hidden="true" /> Save / print PDF</button>
      </div>

      <article className="mx-auto max-w-4xl bg-white p-8 shadow-sm md:p-12">
        <header className="border-b border-slate-200 pb-7">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="font-display text-5xl leading-none tracking-tight md:text-6xl">{person.name}</h1>
              <p className="mt-3 text-sm font-semibold text-slate-600">{person.role} · ASIC and FPGA Design · Design Verification · Edge AI</p>
              <p className="mt-2 text-sm text-slate-500">{person.location} · GPA {person.gpa}</p>
            </div>
            <div className="text-sm leading-6 text-slate-600 md:text-right">
              <p>{person.email}</p>
              <p>{person.linkedin.replace('https://www.', '')}</p>
              <p>{person.github.replace('https://', '')}</p>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-700">{person.supporting} GPA {person.gpa}, expected graduation {person.graduationDate}. Declared Most Outstanding Electrical and Electronics Engineering Student 2026.</p>
        </header>

        <ResumeSection title="Technical skills">
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(skillGroups).map(([group, skills]) => (
              <div key={group}>
                <h3 className="font-semibold capitalize">{group}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{skills.join(' · ')}</p>
              </div>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection title="Education">
          <h3 className="font-semibold">{education.degree}</h3>
          <p className="text-sm text-slate-500">{education.institution} · {education.dates} · {education.location}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600"><strong>Relevant coursework:</strong> {education.coursework.join(', ')}.</p>
          <p className="mt-2 text-sm leading-6 text-slate-600"><strong>Focus areas:</strong> {education.focus.join(', ')}.</p>
        </ResumeSection>

        <ResumeSection title="Selected experience">
          {experiences.slice(0, 9).map((item) => (
            <div key={`${item.organization}-${item.title}`} className="resume-section border-b border-slate-100 py-4 last:border-0">
              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="font-mono text-xs text-slate-500">{item.dates}</p>
              </div>
              <p className="text-sm text-slate-500">{item.organization}</p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{item.summary}</p>
            </div>
          ))}
        </ResumeSection>

        <ResumeSection title="Selected work">
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <div key={project.id} className="resume-section rounded-xl border border-slate-200 p-4">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-slate-400">{project.eyebrow}</p>
                <h3 className="mt-1 font-semibold">{project.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{project.outcome}</p>
              </div>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection title="Education & recognition">
          <div className="grid gap-4 md:grid-cols-2">
            {recognitions.map((item) => (
              <div key={`${item.title}-${item.year}`} className="resume-section">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-slate-500">{[item.issuer, item.year].filter(Boolean).join(' · ')}</p>
                {item.detail ? <p className="mt-1 text-sm text-slate-600">{item.detail}</p> : null}
              </div>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection title="Licenses & certifications">
          <div className="grid gap-3 md:grid-cols-2">
            {credentials.map((credential) => (
              <div key={`${credential.title}-${credential.issuer}`} className="resume-section">
                <h3 className="font-semibold">{credential.title}</h3>
                <p className="text-sm text-slate-500">{credential.issuer}{credential.date ? ` · ${credential.date}` : ''}</p>
                {credential.credentialId ? <p className="mt-1 font-mono text-xs text-slate-400">Credential ID: {credential.credentialId}</p> : null}
              </div>
            ))}
          </div>
        </ResumeSection>
      </article>
    </main>
  )
}

function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="resume-section pt-8">
      <h2 className="mb-3 border-b border-slate-200 pb-2 font-mono text-xs uppercase tracking-[0.15em] text-slate-500">{title}</h2>
      {children}
    </section>
  )
}
