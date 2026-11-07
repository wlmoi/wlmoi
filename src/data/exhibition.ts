import { featuredCaseStudy, person, projects } from './portfolio'

const igor = projects.find((project) => project.id === 'igor')!

export type ShowcaseProject = {
  id: 'gan' | 'igor' | 'iris'
  short: string
  title: string
  kicker: string
  blurb: string
  more: string
  tags: string[]
  metrics: Array<[string, string]>
  accent: string
  steps: Array<{ label: string, title: string, body: string }>
  work: { images: Array<{ src: string, alt: string, caption: string, thumb: string }>, note: string }
  links: Array<{ title: string, href: string, format: string, external?: boolean }>
  preview: string
}

export const showcase: ShowcaseProject[] = [
  {
    id: 'gan',
    short: 'GAN Accelerator',
    title: 'Signed INT8 GAN Accelerator',
    kicker: 'ASIC accelerator',
    blurb: 'An ASIC accelerator, from digital design to physical implementation.',
    more: featuredCaseStudy.intro,
    tags: ['GF180MCU 180 nm', 'Signed INT8', 'SRAM macros', 'DRC and LVS'],
    metrics: [['Result buffer area', '−77%'], ['Peak throughput', '0.8 GOPS at 25 MHz'], ['DRC, LVS, XOR, antenna', '0 violations']],
    accent: '#f2c14e',
    steps: featuredCaseStudy.stages.map((stage) => ({ label: stage.label, title: stage.kicker, body: stage.body })),
    work: {
      images: [{ src: '/GDSLayouting.png', thumb: '/GDSLayouting.png', alt: 'Actual GF180MCU GAN accelerator GDS layout', caption: 'The actual GDS layout of the GF180MCU GAN accelerator' }],
      note: 'Reported implementation results. Die area down 24 percent, estimated power down 18 percent, SRAM macros reduced from 11 to 9, and nine static timing corners.',
    },
    links: [
      { title: 'Complete presentation', href: '/presentations/APSIPA-2026-GAN-Accelerator.pptx', format: 'PPTX, 38 slides' },
      { title: 'Research paper', href: person.paperUrl, format: 'PDF, architecture, results, and verification', external: true },
    ],
    preview: '/GDSLayouting.png',
  },
  {
    id: 'igor',
    short: 'IGOR',
    title: 'IGOR',
    kicker: 'FPGA accelerated robotics',
    blurb: 'FPGA accelerated hardware that took second place at the PERURI Chip Hackathon 2026.',
    more: 'IGOR helps a mobile robot adapt while keeping its steering corrections bounded. The accelerator was developed and verified from RTL through FPGA integration and an IHP 130 nm ASIC flow.',
    tags: ['Verilog', 'Cyclone V', 'Fixed-point inference', 'IHP 130 nm'],
    metrics: [['FPGA inference', '138.32 µs'], ['Reference vectors', '256, zero mismatches'], ['Jetson to FPGA requests', '98 of 98']],
    accent: '#4fd6a0',
    steps: [
      { label: 'Challenge', title: 'Many inputs, one tight loop', body: igor.challenge },
      { label: 'Contribution', title: 'RTL to integration', body: igor.role },
      { label: 'Result', title: 'Measured and verified', body: igor.outcome },
    ],
    work: {
      images: [
        { src: '/projects/igor/robot-side.jpeg', thumb: '/projects/igor/robot-side.jpeg', alt: igor.images![0].alt, caption: 'The prototype at the PERURI Chip Hackathon 2026' },
        { src: '/projects/igor/robot-top.jpeg', thumb: '/projects/igor/robot-top.jpeg', alt: igor.images![1].alt, caption: 'Onboard integration of the FPGA, sensing, and control' },
      ],
      note: 'Photographs of the working prototype. Figures come from the project documentation.',
    },
    links: [
      { title: 'Interactive RTL explorer', href: igor.href!, format: 'Web app', external: true },
      { title: 'Final presentation', href: '/presentations/IGOR-Final-Presentation.pdf', format: 'PDF, 40 slides', external: true },
      { title: 'Project archive', href: 'https://drive.google.com/drive/folders/1OJZmk0_sK4DnrdGx4UgBH6NT0lN_wUky', format: 'Google Drive', external: true },
    ],
    preview: '/projects/igor/robot-side.jpeg',
  },
  {
    id: 'iris',
    short: 'IRIS Harvester',
    title: 'IRIS RF Energy Harvester',
    kicker: 'CMOS circuit research',
    blurb: 'CMOS research on turning radio-frequency energy into usable power.',
    more: 'The work centers on a physical layout for an RF energy harvester. The rendering in Real Work comes from the original GDSII file, so every shape you see is real layout geometry.',
    tags: ['CMOS', 'RF rectification', 'GDSII layout', 'Physical design'],
    metrics: [['Focus', 'RF energy to DC power'], ['Layout geometry', '82,036 polygons'], ['Bounding box', '287.07 × 290.71 µm']],
    accent: '#ff7a33',
    steps: [
      { label: 'Goal', title: 'Turn ambient RF into power', body: 'Explore how a CMOS circuit can rectify radio-frequency energy and deliver usable DC power to a load.' },
      { label: 'Layout', title: 'A real physical design', body: 'The supplied layout has the top cell rf_energy_harvester$1, with 82,036 polygons across 20 layer and datatype pairs.' },
      { label: 'Evidence', title: 'What is claimed', body: 'The layout is shown as supplied. This page does not state a process node or a fabrication status.' },
    ],
    work: {
      images: [{ src: '/evidence/iris-layout.jpg', thumb: '/evidence/iris-layout.jpg', alt: 'RF energy harvester physical design layout rendered from the supplied GDS file', caption: 'Layer coloured rendering of the original GDS file' }],
      note: 'Rendered from the supplied GDSII file. The original file is available to download.',
    },
    links: [
      { title: 'Original GDS file', href: '/evidence/D5_Gelochip_IRIS.gds', format: 'GDSII, 5.3 MB' },
      { title: 'Layout preview', href: '/evidence/iris-layout.jpg', format: 'JPEG rendering', external: true },
    ],
    preview: '/evidence/iris-layout.jpg',
  },
]
