import { useState } from 'react'
import { ArrowUpRight, Search } from 'lucide-react'
import { credentials, person } from '../../data/portfolio'

const categories = ['All', 'Engineering', 'Software & data', 'Communication & leadership', 'Competitions'] as const

export function CredentialsList() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('All')
  const [expanded, setExpanded] = useState(false)
  const matches = credentials.filter((item) => (category === 'All' || (item.category ?? 'Engineering') === category) && `${item.title} ${item.issuer} ${item.credentialId ?? ''}`.toLowerCase().includes(query.trim().toLowerCase()))
  const filtering = category !== 'All' || query.trim().length > 0
  const visible = expanded || filtering ? matches : matches.slice(0, 6)

  return (
    <div id="certifications" className="credentials-library">
      <div className="credentials-search">
        <Search size={16} aria-hidden="true" />
        <label className="sr-only" htmlFor="credential-search">Search certificates by title, issuer, or ID</label>
        <input id="credential-search" type="search" placeholder="Search certificates, issuers, or IDs…" value={query} onChange={(event) => setQuery(event.target.value)} />
        <span>{credentials.length}</span>
      </div>
      <div className="credential-filters" role="group" aria-label="Filter certificates">
        {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <p className="credential-count" role="status">Showing {visible.length} of {matches.length} certificates</p>
      {visible.length ? <div className="credential-grid">{visible.map((item) => (
        <article key={`${item.title}-${item.issuer}`} className="credential-card">
          <p className="credential-category">{item.category ?? 'Engineering'}</p>
          <h3>{item.title}</h3>
          <p className="credential-issuer">{item.issuer}{item.date ? ` · ${item.date}` : ''}</p>
          {item.credentialId ? <p className="credential-id">ID: {item.credentialId}</p> : null}
          {item.expiry ? <p className="credential-expiry">{item.expiry}</p> : null}
        </article>
      ))}</div> : <p className="credential-empty">No certificates match. Try another title or issuer.</p>}
      <div className="credentials-actions">
        {!filtering && matches.length > 6 ? <button type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>{expanded ? 'Show highlights' : `Show all ${credentials.length} certificates`}</button> : null}
        <a href={`${person.linkedin}details/certifications/`} target="_blank" rel="noreferrer">View on LinkedIn <ArrowUpRight size={14} aria-hidden="true" /></a>
      </div>
    </div>
  )
}
