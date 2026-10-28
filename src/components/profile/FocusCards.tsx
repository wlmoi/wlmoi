import { Activity, ArrowUpRight, BrainCircuit, Braces, CircuitBoard, ScanLine } from 'lucide-react'

const areas = [
  { id: 'asic', title: 'Silicon design', icon: CircuitBoard },
  { id: 'fpga', title: 'Design verification', icon: ScanLine },
  { id: 'edge-ai', title: 'Embedded AI', icon: BrainCircuit },
  { id: 'dsp', title: 'Signal processing', icon: Activity },
  { id: 'software', title: 'Software & data', icon: Braces },
]

export function FocusCards() {
  return <div className="focus-grid">{areas.map(({ id, title, icon: Icon }) => (
    <article className="focus-card" key={id}>
      <a href={`#capability-${id}`} onClick={() => { const detail = document.getElementById(`capability-${id}`); if (detail instanceof HTMLDetailsElement) detail.open = true }}>
        <span className="focus-card-top"><ArrowUpRight size={15} aria-hidden="true" /></span>
        <span className="focus-icon"><Icon size={34} strokeWidth={1.25} aria-hidden="true" /></span>
        <h3>{title}</h3>
      </a>
    </article>
  ))}</div>
}
