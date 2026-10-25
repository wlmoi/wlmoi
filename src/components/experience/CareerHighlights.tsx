import { ArrowUpRight, Cpu, Mic, Workflow } from 'lucide-react'
import { experiences } from '../../data/portfolio'
const features=[
 {id:'edge-ai',eyebrow:'CURRENT / EDGE INTELLIGENCE',title:'Junior Edge AI Engineer',icon:Mic,proof:'Python · TensorFlow · YAMNet',copy:'Audio and visual sensing prototypes, from microphone acquisition to on-device evaluation.'},
 {id:'microelectronics',eyebrow:'CURRENT / DIGITAL HARDWARE',title:'Microelectronics Research',icon:Cpu,proof:'SystemVerilog · RTL · Verification',copy:'Synthesizable signal-processing hardware, pipelined datapaths, and self-checking validation.'},
 {id:'alcon',eyebrow:'INTERNSHIP / MANUFACTURING',title:'Production automation at Alcon',icon:Workflow,proof:'40+ production sheets standardized',copy:'A completed industry internship connecting Power Apps, Power Automate, and operational data.'},
]
export function CareerHighlights(){
 return <section className="career-highlights section-shell" aria-labelledby="career-highlights-title">
  <div className="career-highlights-intro"><div><p className="eyebrow">EXPERIENCE / IN PRACTICE</p><h2 id="career-highlights-title">Research depth.<br /><em>Industry perspective.</em></h2></div><a href="/resume">Read the full résumé <ArrowUpRight size={16} aria-hidden="true"/></a></div>
  <div className="career-highlight-grid">{features.map(({id,eyebrow,title,icon:Icon,proof,copy})=><a href={`#experience-${id}`} className="career-highlight-card" key={id} onClick={()=>window.dispatchEvent(new CustomEvent('select-experience',{detail:id}))}>
   <div className="career-highlight-top"><Icon size={22} strokeWidth={1.4} aria-hidden="true"/><span>{eyebrow}</span><ArrowUpRight size={15} aria-hidden="true"/></div><h3>{title}</h3><p className="career-highlight-employer">{experiences.find(e=>e.id===id)?.organization}</p><p>{copy}</p><strong>{proof}</strong><span className="career-highlight-date">{experiences.find(e=>e.id===id)?.dates}</span>
  </a>)}</div>
 </section>
}
