import { useState } from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { organizationGroups, person } from '../../data/portfolio'

const categories = ['All activities', 'Development', 'Teaching & community', 'Leadership & events', 'Academic foundation'] as const
const roleCount = organizationGroups.reduce((total, group) => total + group.roles.length, 0)

export function OrganizationExperience() {
  const [category, setCategory] = useState<(typeof categories)[number]>('All activities')
  const visible = organizationGroups.filter((group) => category === 'All activities' || group.category === category)

  return (
    <section id="organizations" className="section-pad border-t border-white/10">
      <div className="section-shell">
        <div className="organization-heading">
          <div>
            <p className="eyebrow">Leadership, communities & service</p>
            <h2>Working with people.<br /><em>Building beyond the lab.</em></h2>
          </div>
          <div>
            <p className="organization-intro">Development, teaching, student organizations, and community service. The people and responsibilities that shaped how I work.</p>
            <a href={`${person.linkedin}details/experience/`} target="_blank" rel="noreferrer" className="organization-source">Experience on LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></a>
            <p className="organization-total">{roleCount} roles & activities · {organizationGroups.length} organizations</p>
          </div>
        </div>
        <div className="project-filters" role="group" aria-label="Filter organization experience">
          {categories.map((item) => <button key={item} type="button" aria-pressed={item === category} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <div className="organization-grid" key={category}>
          {visible.map((group) => (
            <details key={group.name} className="organization-card" open={group.name === 'Keluarga Mahasiswa Buddhis Dhammanano ITB' || category !== 'All activities'}>
              <summary>
                <span><span className="organization-category">{group.category}</span><span className="organization-name">{group.name}</span><span className="organization-role-count">{group.roles.length} {group.roles.length === 1 ? 'role' : 'roles'}</span></span>
                <ChevronDown size={17} aria-hidden="true" />
              </summary>
              <div className="organization-roles">
                {group.roles.map((role) => <article key={`${role.title}-${role.dates}`}>
                  <div><h3>{role.title}</h3><span>{role.dates}</span></div>
                  <p className="organization-context">{role.context}</p>
                  {'detail' in role && role.detail ? <p>{role.detail}</p> : null}
                  {'evidence' in role && role.evidence ? <a href={role.evidence} target="_blank" rel="noreferrer">Certificate <ArrowUpRight size={13} aria-hidden="true" /></a> : null}
                </article>)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
