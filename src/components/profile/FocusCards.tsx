import { Activity, ArrowUpRight, BrainCircuit, Braces, CircuitBoard, ScanLine } from 'lucide-react'
import { TiltSurface } from '../ui/TiltSurface'

const areas = [
  { id: 'asic', title: 'Silicon design', detail: 'RTL → physical implementation', icon: CircuitBoard, index: '01' },
  { id: 'fpga', title: 'Design verification', detail: 'Intent → checked behavior', icon: ScanLine, index: '02' },
  { id: 'edge-ai', title: 'Embedded AI', detail: 'Models → real-world systems', icon: BrainCircuit, index: '03' },
  { id: 'dsp', title: 'Signal processing', detail: 'Signals → useful information', icon: Activity, index: '04' },
  { id: 'software', title: 'Software & data', detail: 'Workflows → working tools', icon: Braces, index: '05' },
]

export function FocusCards() {
  return <div className="focus-grid">{areas.map(({ id, title, detail, icon: Icon, index }) => (
    <TiltSurface className="focus-card" key={id}>
      <a href={`#capability-${id}`} onClick={() => { const detail = document.getElementById(`capability-${id}`); if (detail instanceof HTMLDetailsElement) detail.open = true }}>
        <span className="focus-card-top"><span>{index} / PRACTICE</span><ArrowUpRight size={15} aria-hidden="true" /></span>
        <span className="focus-icon"><Icon size={34} strokeWidth={1.25} aria-hidden="true" /></span>
        <h3>{title}</h3>
        <p>{detail}</p>
      </a>
    </TiltSurface>
  ))}</div>
}
