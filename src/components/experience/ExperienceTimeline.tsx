import { experiences } from '../../data/portfolio'

export function ExperienceTimeline() {
  return (
    <div className="relative ml-1 border-l border-white/[0.12] pl-6 md:pl-10">
      {experiences.map((item, index) => (
        <article key={`${item.organization}-${item.title}`} className="relative py-6 md:py-8">
          <span className="absolute -left-[1.73rem] top-10 h-2.5 w-2.5 rounded-full border border-[hsl(var(--accent))] bg-[hsl(var(--background))] md:-left-[2.57rem]" aria-hidden="true" />
          <div className="grid gap-4 md:grid-cols-[180px_1fr] md:gap-10">
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-white/[0.4]">{item.dates}</p>
              <p className="mt-2 text-xs text-white/[0.35]">{String(index + 1).padStart(2, '0')}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{item.title}</h3>
              <p className="mt-1 text-sm text-white/[0.58]">{item.organization}{item.location ? ` · ${item.location}` : ''}</p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/[0.67]">{item.summary}</p>
              {item.bullets && item.bullets.length > 1 ? (
                <ul className="mt-4 grid gap-2 text-sm leading-6 text-white/[0.5]">
                  {item.bullets.slice(1).map((bullet) => <li key={bullet} className="pl-4 before:mr-2 before:text-[hsl(var(--accent))] before:content-['/']">{bullet}</li>)}
                </ul>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
