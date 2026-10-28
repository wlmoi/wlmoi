export const siliconBoardModules = [
  {
    id: 'compute',
    label: 'Compute array',
    title: '4 × 4 processing-element array',
    eyebrow: '01 / COMPUTE FABRIC',
    description: 'Sixteen processing elements form the compute fabric in the signed INT8 GAN accelerator study.',
    stack: ['4 × 4 PE array', 'Signed INT8', 'GAN accelerator'],
  },
  {
    id: 'memory',
    label: 'SRAM buffers',
    title: 'SRAM buffers',
    eyebrow: '02 / DATA MOVEMENT',
    description: 'SRAM buffers sit beside the processing array. The project reduced its SRAM macro count from 11 to 9.',
    stack: ['SRAM buffers', 'Memory optimization', '11 → 9 macros'],
  },
  {
    id: 'control',
    label: 'Controller + I/O',
    title: 'Controller and serial host',
    eyebrow: '03 / CONTROL + I/O',
    description: 'A controller and serial host interface coordinate data movement across the complete 784-pixel image workload.',
    stack: ['Controller', 'Serial host interface', '784-pixel image'],
  },
  {
    id: 'implementation',
    label: 'RTL → GDSII',
    title: 'From RTL to GDSII',
    eyebrow: '04 / IMPLEMENTATION',
    description: 'The study was implemented on GF180MCU 180 nm and checked with bit-exact post-route verification and physical sign-off.',
    stack: ['GF180MCU 180 nm', 'Post-route verification', 'Physical sign-off'],
  },
] as const

export type SiliconBoardModuleId = typeof siliconBoardModules[number]['id']
