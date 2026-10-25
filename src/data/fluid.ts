export type FluidEffect = 'lattice' | 'trefoil' | 'vortex' | 'combined'

export const fluidEffects = [
  { id: 'lattice', label: 'Lattice', description: 'A sixteen-node compute fabric, carried by flowing signals.' },
  { id: 'trefoil', label: 'Trefoil', description: 'A continuous particle knot that bends with your movement.' },
  { id: 'vortex', label: 'Vortex', description: 'Orbiting signal streams with a fluid-driven wake.' },
  { id: 'combined', label: 'Combined', description: 'Compute, connection, and motion in one composition.' },
] as const

export const effectIndex: Record<FluidEffect, number> = { lattice: 0, trefoil: 1, vortex: 2, combined: 3 }
