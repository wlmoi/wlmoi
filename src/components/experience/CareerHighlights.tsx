import { ArrowUpRight, Cpu, Mic, Workflow } from 'lucide-react'
import { experiences } from '../../data/portfolio'
const features=[
 {id:'edge-ai',title:'Junior Edge AI Engineer',icon:Mic,proof:'Audio and visual sensing prototypes, from microphone acquisition to on-device evaluation.'},
 {id:'microelectronics',title:'Microelectronics Research',icon:Cpu,proof:'Synthesizable signal-processing hardware, pipelined datapaths, and self-checking validation.'},
 {id:'alcon',title:'Production automation at Alcon',icon:Workflow,proof:'40+ production sheets standardized with Power Apps and Power Automate.'},
]
export function CareerHighlights(){
 return <section className="career-highlights section-shell" aria-labelledby="career-highlights-title">
  <div className="career-highlights-intro"><div><h2 id="career-highlights-title">Research depth.<br /><em>Industry perspective.</em></h2></div><a href="/resume">Read the full résumé <ArrowUpRight size={16} aria-hidden="true"/></a></div>
  <div className="career-highlight-grid">{features.map(({id,title,icon:Icon,proof})=><a href={`#experience-${id}`} className="career-highlight-card" key={id} onClick={()=>window.dispatchEvent(new CustomEvent('select-experience',{detail:id}))}>
   <div className="career-highlight-top"><Icon size={22} strokeWidth={1.4} aria-hidden="true"/><ArrowUpRight size={15} aria-hidden="true"/></div><h3>{title}</h3><p className="career-highlight-employer">{experiences.find(e=>e.id===id)?.organization}</p><strong>{proof}</strong><span className="career-highlight-date">{experiences.find(e=>e.id===id)?.dates}</span>
  </a>)}</div>
 </section>
}
