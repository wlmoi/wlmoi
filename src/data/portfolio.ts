import type { Capability, Credential, Experience, Project, Recognition } from '../types/portfolio'

export const person = {
  name: 'William Anthony',
  role: 'Electrical and Electronics Engineering Student',
  location: 'Bandung, Indonesia',
  institution: 'Institut Teknologi Bandung',
  graduation: '2027',
  gpa: '3.70 / 4.00',
  graduationDate: 'July 2027 (expected)',
  headline: 'Engineering intelligence from RTL to real-world systems.',
  alternateHeadline: 'From silicon logic to intelligent systems.',
  supporting:
    'William Anthony designs and verifies digital systems across ASIC, FPGA, embedded platforms, signal processing, and Edge AI. His work connects low-level hardware architecture with practical, measurable engineering outcomes.',
  email: 'willomooi@gmail.com',
  linkedin: 'https://www.linkedin.com/in/wlmoi/',
  github: 'https://github.com/wlmoi',
  githubRepository: 'https://github.com/wlmoi/wlmoi',
  instagram: 'https://www.instagram.com/wlmoi/',
  portfolio: 'https://wlmoi.vercel.app/',
  resumeUrl: '/resume?print=1',
  paperUrl: '/1571326725_An%20Area-Optimized%208-bit%20Deep%20Learning%20Accelerator%20for%20GAN%20Image%20Generation%20on%20GF180MCU.pdf.pdf',
} as const

export const education = {
  degree: 'Bachelor of Engineering in Electrical and Electronics Engineering',
  institution: 'Institut Teknologi Bandung',
  dates: 'July 2023 – July 2027 (expected)',
  location: 'Bandung, Indonesia',
  gpa: '3.70 / 4.00',
  coursework: ['VLSI System Design', 'VLSI Digital Systems', 'Computer Architecture', 'Digital Systems', 'Digital IC Analysis and Design', 'Analog Mixed-Signal Electronic Design', 'Communication Systems', 'Electronics'],
  focus: ['Design Validation and Verification', 'FPGA and ASIC Architecture', 'Information Technology', 'Software Development', 'Artificial Intelligence and Machine Learning', 'Data Engineering', 'Data Analysis'],
} as const

export const credentials: Credential[] = [
  { title: 'IEEE Innovation at Work (PDH)', issuer: 'IEEE', date: 'April 2026', credentialId: '180904172' },
  { title: 'Self Sensing Processor Systems', issuer: 'IEEE Educational Activities', date: 'February 2026', credentialId: '175679272' },
  { title: 'How to Design an LC Oscillator', issuer: 'IEEE Educational Activities', date: 'February 2026', credentialId: '173374336' },
  { title: 'Industrial Instrumentation, Level I', issuer: 'Toyota Indonesia (TMMIN)', date: '2025' },
  { title: 'Winter School: Current Trends in Advanced Electronics', issuer: 'Tomsk State University of Control Systems and Radioelectronics', date: 'April 2025' },
  { title: 'JavaScript (Intermediate)', issuer: 'HackerRank', date: 'January 2025', credentialId: '1442edef9152' },
]

export const languages = [
  ['Indonesian', 'Native / bilingual'],
  ['English', 'Full professional'],
  ['Chinese', 'Elementary'],
] as const

export const capabilities: Capability[] = [
  {
    id: 'asic',
    number: '01',
    title: 'ASIC Architecture & RTL-to-GDSII',
    summary: 'Architecture, RTL implementation, verification, physical implementation, and sign-off thinking.',
    tools: ['Verilog', 'SystemVerilog', 'LibreLane', 'OpenROAD', 'GF180MCU', 'Cadence Virtuoso'],
    methods: ['RTL design', 'Testbenches', 'STA', 'DRC', 'LVS', 'Antenna closure', 'SRAM macros'],
  },
  {
    id: 'fpga',
    number: '02',
    title: 'FPGA Design & Verification',
    summary: 'Synchronous datapaths and control logic developed with simulation-led verification and hardware validation.',
    tools: ['VHDL', 'Quartus', 'ModelSim', 'FPGA', 'ESP32'],
    methods: ['Waveform analysis', 'FSM design', 'UART', 'Timing analysis', 'Resource utilization'],
  },
  {
    id: 'edge-ai',
    number: '03',
    title: 'Edge AI & Embedded Systems',
    summary: 'On-device intelligence and embedded data paths that connect computation to physical systems.',
    tools: ['Python', 'C', 'C++', 'ESP32', 'Arduino', 'MQTT'],
    methods: ['Neural inference', 'Microcontroller integration', 'Low-latency pipelines', 'Data collection'],
  },
  {
    id: 'dsp',
    number: '04',
    title: 'Digital Signal Processing',
    summary: 'Hardware-oriented signal processing for frequency analysis, peak detection, and coordinate transforms.',
    tools: ['MATLAB', 'Verilog', 'VHDL', 'FFT', 'CORDIC'],
    methods: ['DIT FFT', 'Peak detection', 'Fixed-point datapaths', 'Pipeline architecture'],
  },
  {
    id: 'software',
    number: '05',
    title: 'Software, Data & Automation',
    summary: 'Engineering tools and production workflows that make technical data easier to operate and inspect.',
    tools: ['JavaScript', 'SQL', 'Power Apps', 'Power Automate', 'InfluxDB', 'Grafana'],
    methods: ['Data automation', 'Dashboard flows', 'Engineering scripting', 'Workflow integration'],
  },
]

export const featuredCaseStudy = {
  title: 'Signed INT8 GAN Accelerator, from RTL to GDSII',
  intro:
    'A hardware-first GAN acceleration study implemented as a structural INT8 datapath on GF180MCU 180 nm, carried through implementation and bit-exact post-route verification.',
  stages: [
    {
      label: 'Problem',
      kicker: 'Constrain the datapath',
      body: 'The design needed a compact, verifiable accelerator architecture that could process a complete 784-pixel image while remaining tractable for open-source physical implementation.',
    },
    {
      label: 'Architecture',
      kicker: 'Build the compute fabric',
      body: 'A structural 4 × 4 processing-element array is paired with SRAM buffers, a controller, and a serial host interface to keep computation and movement explicit.',
    },
    {
      label: 'Optimization',
      kicker: 'Reduce memory and area pressure',
      body: 'The implementation reduces the result-buffer area and SRAM macro count while preserving the accelerator’s signed INT8 behavior.',
    },
    {
      label: 'Verification',
      kicker: 'Check the silicon intent',
      body: 'RTL and post-route behavior are verified bit-for-bit across a complete 784-pixel image, alongside physical sign-off checks and nine STA corners.',
    },
    {
      label: 'Measured result',
      kicker: 'Make the outcome legible',
      body: 'The reported implementation reaches 0.8 GOPS peak throughput at 25 MHz with zero DRC, LVS, XOR, and antenna violations.',
    },
  ],
  metrics: [
    ['Result-buffer area', '−77%'],
    ['Die area', '−24%'],
    ['Estimated power', '−18%'],
    ['SRAM macros', '11 → 9'],
    ['DRC / LVS / XOR / antenna', '0'],
    ['STA corners', '9'],
    ['Clock period', '40 ns'],
    ['Peak throughput', '0.8 GOPS @ 25 MHz'],
  ],
}

export const projects: Project[] = [
  {
    id: 'fpga-gan',
    eyebrow: 'FPGA / ACCELERATION',
    title: 'FPGA-Based Programmable GAN',
    context: 'Reconfigurable hardware exploration for generative-model computation.',
    role: 'FPGA design and hardware acceleration work.',
    stack: ['FPGA', 'Verilog', 'Digital design'],
    challenge: 'Translate algorithmic computation into a hardware-oriented datapath and control structure.',
    outcome: 'Selected engineering work. Detailed public metrics were not supplied for this portfolio entry.',
    href: person.paperUrl,
  },
  {
    id: 'iot-noise',
    eyebrow: 'EMBEDDED / DATA',
    title: 'Outdoor IoT Noise Monitoring and Calibration',
    context: 'Outdoor acoustic monitoring pipeline for field data collection, visualization, and characterization.',
    role: 'Embedded and data-flow integration across sensing, transport, storage, and monitoring.',
    stack: ['ESP32-S3', 'Raspberry Pi 4', 'MQTT', 'Telegraf', 'InfluxDB', 'Grafana'],
    challenge: 'Create a traceable measurement pipeline and calibrate field readings against a reference sound-level meter.',
    outcome: 'Ongoing target: LAeq error within ±3 dBA versus a reference sound-level meter. This is a target, not a claimed achieved result.',
    status: 'ongoing',
  },
  {
    id: 'fft',
    eyebrow: 'DSP / RTL',
    title: '8,192-Point FFT and Peak Detection',
    context: 'High-resolution frequency-domain analysis within partial-discharge detection research.',
    role: 'Research assistant developing MATLAB models and Verilog signal-processing hardware.',
    stack: ['Verilog', 'MATLAB', 'CSV → MEM', 'DIT FFT'],
    challenge: 'Move a research signal-processing flow into a synchronous RTL architecture suitable for FPGA simulation and validation.',
    outcome: 'Implemented an 8,192-point DIT FFT module and a Verilog peak-detection path for simulation and validation.',
  },
  {
    id: 'qft',
    eyebrow: 'OPEN SILICON / QUANTUM',
    title: 'Three-Qubit Quantum Fourier Transform Tapeout Contribution',
    context: 'Open-source silicon contribution translating a quantum transform concept into a physical design flow.',
    role: 'Digital IC design and physical implementation contribution.',
    stack: ['RTL', 'ASIC flow', 'Open-source silicon'],
    challenge: 'Connect a compact computational primitive to a manufacturable digital implementation flow.',
    outcome: 'Tapeout contribution documented in the supplied professional portfolio data.',
  },
  {
    id: 'alcon',
    eyebrow: 'AUTOMATION / DATA',
    title: 'Production Data Automation at Alcon',
    context: 'Manufacturing data workflow connecting many production sheets to a standardized operational view.',
    role: 'Product consumables intern focused on production-data automation.',
    stack: ['Power Apps', 'Power Automate', 'Excel'],
    challenge: 'Standardize fragmented production data and automate real-time notification flows around operational information.',
    outcome: 'Created dashboard data flows across 40+ sheets into a standardized sheet and built automatic notification flows for production use.',
  },
  {
    id: 'hme-election',
    eyebrow: 'SOFTWARE / WEB',
    title: 'Mobile-Friendly Election Platform',
    context: 'Private voting website for the HME ITB President 2025/2026 election.',
    role: 'Front-end developer.',
    stack: ['Web development', 'MEAN framework', 'Mobile UI'],
    challenge: 'Deliver a usable private voting experience across mobile and desktop contexts.',
    outcome: 'Developed the mobile-friendly private election website for HME ITB.',
  },
]

export const experiences: Experience[] = [
  {
    title: 'Junior Edge AI Engineer in Computer Vision and Audio',
    organization: 'Institut Teknologi Bandung',
    dates: 'Sep 2026 – Mar 2027',
    location: 'Bandung, Indonesia',
    summary: 'Develop edge AI prototypes for computer vision and audio applications by integrating embedded hardware, signal processing, and machine learning models.',
    bullets: ['Develop edge AI prototypes for computer vision and audio applications by integrating embedded hardware, signal processing, and machine learning models.'],
  },
  {
    title: 'Research Assistant',
    organization: 'Microelectronics Center of Institut Teknologi Bandung',
    dates: 'Sep 2026 – Mar 2027',
    location: 'Bandung, Indonesia',
    summary: 'Design and verify digital hardware for microelectronics research for POLYTRON audio projects, with emphasis on ASIC implementation and validation workflows.',
    bullets: ['Design and verify digital hardware for POLYTRON audio projects, with emphasis on ASIC implementation and validation workflows.'],
  },
  {
    title: 'Electronics II Laboratory Coordinator',
    organization: 'Institut Teknologi Bandung',
    dates: 'Sep 2025 – Jan 2027',
    location: 'Bandung, Indonesia',
    summary: 'Lead laboratory instruction in circuit analysis, LTspice, oscilloscopes, filters, and operational amplifiers. Mentor more than 60 students in simulation and hardware debugging.',
    bullets: ['Lead laboratory instruction in circuit analysis, LTspice, oscilloscopes, filters, and operational amplifiers.', 'Mentor more than 60 students in simulation and hardware debugging.', 'Selected as the youngest and only third-year assistant on a 17-member team and voted Favorite Assistant for technical excellence and teaching impact.'],
  },
  {
    title: 'Electric Circuits Laboratory Assistant',
    organization: 'Institut Teknologi Bandung',
    dates: 'Sep 2025 – Jan 2027',
    location: 'Bandung, Indonesia',
    summary: 'Guide students through circuit theory, LTspice simulation, oscilloscope operation, filter analysis, and op-amp implementation.',
  },
  {
    title: 'Product Consumables Intern',
    organization: 'Alcon',
    dates: 'Jul 2026 – Aug 2026',
    location: 'Batam, Indonesia',
    summary: 'Consolidated more than 40 Excel sheets into a standardized real-time dataset using Power Apps, Power Automate, and Excel.',
    bullets: ['Consolidated more than 40 Excel sheets into a standardized real-time dataset.', 'Owned the dashboard workflow against user requirements and implemented automated notification flows for production operations.'],
  },
  {
    title: 'Programming Problem Solving Course Assistant',
    organization: 'Institut Teknologi Bandung',
    dates: 'Feb 2026 – Jun 2026',
    location: 'Bandung, Indonesia',
    summary: 'Taught C programming and Arduino integration to more than 40 students, with emphasis on problem decomposition, testing, debugging, and engineering tradeoffs.',
  },
  {
    title: 'Research Assistant in Partial-Discharge Detection',
    organization: 'Institut Teknologi Bandung',
    dates: 'Feb 2025 – Feb 2026',
    location: 'Bandung, Indonesia',
    summary: 'Supported partial-discharge detection research through MATLAB modeling and Verilog signal-processing implementation.',
    bullets: ['Built and validated a 16-bit peak-detection system using CSV-to-MEM data conversion.', 'Designed an 8,192-point FFT in Verilog using a decimation-in-time butterfly architecture.'],
  },
  {
    title: 'Digital Systems Assistant Lecturer and Laboratory Assistant',
    organization: 'Institut Teknologi Bandung',
    dates: 'Sep 2025 – Jan 2026',
    location: 'Bandung, Indonesia',
    summary: 'Instructed more than 50 students in VHDL, RTL methodology, finite-state machines, testbenches, waveform verification, synthesis, timing analysis, and FPGA deployment.',
    bullets: ['Instructed more than 50 students in VHDL, RTL methodology, finite-state machines, testbenches, waveform verification, synthesis, timing analysis, and FPGA deployment.', 'Supervised DSP projects including CORDIC and a 64-point FFT on Cyclone IV and DE10-Lite FPGA platforms using ModelSim and Intel Quartus Prime.'],
  },
  {
    title: 'Chipathon 2025 Tapeout Participant',
    organization: 'IEEE Solid-State Circuits Society Central Illinois Section Chapter',
    dates: 'Jul 2025 – Dec 2025',
    summary: 'Contributed digital signal-processing control for a three-qubit Quantum Fourier Transform chip in an international tapeout program.',
  },
  {
    title: 'Front-End Developer',
    organization: 'HME ITB and OSKM ITB',
    dates: 'Jul 2024 – Feb 2025',
    summary: 'Developed mobile-friendly web applications, including a private election platform built with the MEAN framework.',
  },
]

export const recognitions: Recognition[] = [
  { title: 'Most Outstanding Electrical and Electronics Engineering Student 2026', issuer: 'Institut Teknologi Bandung', year: '2026' },
  { title: 'Ganesha Awardee', issuer: 'Institut Teknologi Bandung', year: '2024 & 2025', detail: 'Two-time recipient.' },
  { title: '3rd Place, Team Category · USU International Chess Championship', issuer: 'USU', year: '2024' },
  { title: 'Gold Medal · KTO Mathematics', issuer: 'KTO', year: 'June 2023' },
  { title: 'Silver Medal · KTO Mathematics', issuer: 'KTO', year: 'January 2025' },
]

export const skillGroups = {
  hardware: ['Verilog', 'VHDL', 'SystemVerilog', 'RTL design', 'Testbenches', 'Quartus', 'ModelSim', 'Cadence Virtuoso', 'LibreLane', 'OpenROAD', 'GF180MCU', 'STA', 'DRC', 'LVS', 'Antenna closure', 'SRAM macros'],
  embedded: ['ESP32', 'Arduino', 'Python', 'C', 'C++', 'MQTT'],
  software: ['JavaScript', 'SQL', 'MATLAB', 'InfluxDB', 'Grafana', 'Power Apps', 'Power Automate'],
  dsp: ['FFT', 'CORDIC', 'Waveform analysis', 'Fixed-point datapaths'],
} as const
