import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { ArrowLeft, ArrowUpRight, Download } from 'lucide-react'
import { education, experiences, languages, person, projects, recognitions } from '../data/portfolio'

const sections = ['Summary', 'Experience', 'Selected projects', 'Education', 'Technical skills', 'Recognition', 'Selected certifications']
const selectedExperience = experiences.filter((item) => [
  'Tiny Tapeout', 'Microelectronics Center of Institut Teknologi Bandung', 'Alcon',
].includes(item.organization) || ['Junior Edge AI Engineer in Computer Vision and Audio', 'Electronics II Laboratory Coordinator', 'Research Assistant in Partial-Discharge Detection'].includes(item.title))
const selectedProjects = projects.filter((item) => ['igor', 'fpga-gan', 'qft', 'hme-election'].includes(item.id))

export function ResumePage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'William Anthony — Resume'
    if (new URLSearchParams(window.location.search).has('print')) {
      let cancelled = false
      void document.fonts.ready.then(() => { if (!cancelled) window.print() })
      return () => { cancelled = true; document.title = previousTitle }
    }
    return () => { document.title = previousTitle }
  }, [])

  return (
    <main id="main-content" className="resume-page">
      <div className="resume-toolbar no-print">
        <a href="/#home"><ArrowLeft size={16} aria-hidden="true" /> Portfolio</a>
        <span className="resume-toolbar-label">William Anthony / Résumé</span>
        <button type="button" onClick={() => window.print()}><Download size={16} aria-hidden="true" /> Save PDF</button>
      </div>
      <div className="resume-layout">
        <aside className="resume-sidebar no-print">
          <p className="eyebrow">The résumé</p>
          <h2>Built to make<br /><em>things work.</em></h2>
          <p>Hardware, software, and AI.<br />One connected engineering practice.</p>
          <nav aria-label="Resume sections">
            {sections.map((section, index) => <a key={section} href={`#resume-${index}`}><span>0{index + 1}</span>{section}</a>)}
          </nav>
          <a className="resume-sidebar-link" href={person.github} target="_blank" rel="noreferrer">Explore my work <ArrowUpRight size={16} aria-hidden="true" /></a>
          <p className="resume-print-hint">A4 · Selectable text · Print-ready<br />Use Save PDF to export this résumé.</p>
        </aside>
        <article className="resume-paper" aria-label="William Anthony resume">
          <header className="resume-header">
            <h1>{person.name}</h1>
            <p className="resume-specialties">Digital Design & Verification · Edge AI · Software & Automation</p>
            <p>{person.location} · {person.institution}</p>
            <div className="resume-contacts">
              <a href={`mailto:${person.email}`}>{person.email}</a>
              <a href={person.linkedin}>linkedin.com/in/wlmoi</a>
              <a href={person.github}>github.com/wlmoi</a>
              <a href={person.portfolio}>wlmoi.vercel.app</a>
            </div>
          </header>
          <ResumeSection index={0} title="Summary">
            <p>Electrical and Electronics Engineering student at ITB (GPA {person.gpa}; expected graduation July 2027), ranked first of 118 students and selected as the 2026 Most Outstanding Electrical Engineering Student. Connects digital design and verification with applied AI, Python tooling, and production automation. <strong>2nd Place — PERURI Chip Hackathon 2026</strong> with IGOR, an AI accelerator for mobile robotics.</p>
          </ResumeSection>
          <ResumeSection index={1} title="Experience">
            {selectedExperience.map((item) => (
              <div key={`${item.organization}-${item.title}`} className="resume-entry">
                <div className="resume-entry-heading"><h3>{item.organization}</h3><span>{item.dates}</span></div>
                <p className="resume-role">{item.title}{item.location ? ` · ${item.location}` : ''}</p>
                <ul><li>{item.summary}</li></ul>
              </div>
            ))}
          </ResumeSection>
          <ResumeSection index={2} title="Selected projects">
            {selectedProjects.map((project) => (
              <div key={project.id} className="resume-entry">
                <h3>{project.href ? <a href={project.href}>{project.title}</a> : project.title}</h3>
                <p>{project.id === 'igor' ? 'Designed an eight-lane FPGA neural accelerator: 138.32 µs inference at 50 MHz, 256 reference vectors with zero mismatches, and 98/98 successful Jetson–FPGA UART requests. IHP ASIC work covers an I/O-engine proof of concept; the neural core remains on FPGA.' : project.outcome}</p>
                <p className="resume-stack">{project.stack.join(' · ')}</p>
              </div>
            ))}
          </ResumeSection>
          <ResumeSection index={3} title="Education">
            <div className="resume-entry-heading"><h3>{education.institution}</h3><span>{education.dates}</span></div>
            <p>{education.degree} · GPA {person.gpa}</p>
            <p>Relevant coursework: VLSI System Design, Computer Architecture, Digital Systems, Digital Signal Processing, Electronics, and Programming.</p>
            <p>Additional teaching: mentored 60+ Electric Circuits students; instructed 50+ students in VHDL, RTL, testbenches, and FPGA deployment; supported 40+ students in C programming and Arduino.</p>
          </ResumeSection>
          <ResumeSection index={4} title="Technical skills">
            <p><strong>Digital design & verification:</strong> Verilog, SystemVerilog, VHDL, SVA, functional coverage, self-checking testbenches, Quartus, ModelSim, OpenLane / LibreLane, OpenROAD, STA, DRC, LVS.</p>
            <p><strong>AI & signal processing:</strong> Python, PyTorch, TensorFlow, YAMNet, LangChain, ChromaDB, MATLAB, fixed-point inference, FFT, CORDIC.</p>
            <p><strong>Software & automation:</strong> C, C++, JavaScript, SQL, FastAPI, Pydantic, Power Apps, Power Automate, Excel, MQTT, InfluxDB, Grafana.</p>
          </ResumeSection>
          <ResumeSection index={5} title="Recognition">
            <ul>{recognitions.slice(0, 4).map((item) => <li key={item.title}><strong>{item.title}</strong> · {item.year}{item.title === 'Ganesha Awardee' ? ' · Two-time recipient' : ''}</li>)}</ul>
            <p className="resume-languages"><strong>Languages:</strong> {languages.map(([language, level]) => `${language} (${level.toLowerCase()})`).join(' · ')}</p>
          </ResumeSection>
          <ResumeSection index={6} title="Selected certifications">
            <p>SoC Verification using SystemVerilog · IEEE Self Sensing Processor Systems · Toyota Industrial Instrumentation, Level I · HackerRank JavaScript (Intermediate) · EFSET English 81/100 (Proficient).</p>
            <p>Full credential library: <a href={`${person.portfolio}#certifications`}>wlmoi.vercel.app/#certifications</a></p>
          </ResumeSection>
        </article>
      </div>
    </main>
  )
}

function ResumeSection({ title, index, children }: { title: string; index: number; children: ReactNode }) {
  return <section id={`resume-${index}`} className="resume-section"><h2>{title}</h2>{children}</section>
}
