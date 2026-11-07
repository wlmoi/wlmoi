import { useEffect, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** Slow independent rotation and gentle floating for a group. */
export function Drift({ children, rot = [0, 0.2, 0], float = 0.08, speed = 0.6, phase = 0, base = [0, 0, 0], tilt = [0, 0, 0], still = false }: {
  children: ReactNode
  rot?: [number, number, number]
  float?: number
  speed?: number
  phase?: number
  base?: [number, number, number]
  tilt?: [number, number, number]
  still?: boolean
}) {
  const outer = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Group>(null)
  useFrame(({ clock }, delta) => {
    if (still || !outer.current || !inner.current) return
    inner.current.rotation.x += delta * rot[0]
    inner.current.rotation.y += delta * rot[1]
    inner.current.rotation.z += delta * rot[2]
    outer.current.position.y = base[1] + Math.sin(clock.elapsedTime * speed + phase) * float
  })
  return (
    <group ref={outer} position={base}>
      <group rotation={tilt}>
        <group ref={inner}>{children}</group>
      </group>
    </group>
  )
}

function dieTexture(kind: 'grid' | 'pe') {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const bg = ctx.createLinearGradient(0, 0, size, size)
  bg.addColorStop(0, '#101a38')
  bg.addColorStop(1, '#0a1026')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, size, size)
  ctx.strokeStyle = 'rgba(120,220,255,.16)'
  ctx.lineWidth = 1
  for (let i = 0; i <= size; i += 16) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke()
  }
  if (kind === 'pe') {
    const cell = 82
    const gap = 14
    const start = (size - (cell * 4 + gap * 3)) / 2
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const x = start + c * (cell + gap)
      const y = start + r * (cell + gap)
      const g = ctx.createLinearGradient(x, y, x + cell, y + cell)
      g.addColorStop(0, (r + c) % 2 ? '#7a63e8' : '#33c7b8')
      g.addColorStop(1, '#16224a')
      ctx.fillStyle = g
      ctx.fillRect(x, y, cell, cell)
      ctx.strokeStyle = 'rgba(255,255,255,.35)'
      ctx.strokeRect(x + 0.5, y + 0.5, cell - 1, cell - 1)
    }
  } else {
    const blocks: Array<[number, number, number, number, string]> = [
      [40, 40, 200, 170, '#6d58d6'], [260, 40, 210, 80, '#2fb5aa'], [260, 136, 100, 74, '#3a4f9a'], [374, 136, 96, 74, '#2fb5aa'],
      [40, 232, 120, 240, '#2c3f86'], [176, 232, 294, 110, '#7a63e8'], [176, 358, 140, 114, '#2fb5aa'], [332, 358, 138, 114, '#3a4f9a'],
    ]
    blocks.forEach(([x, y, w, h, color]) => {
      ctx.fillStyle = color
      ctx.globalAlpha = 0.85
      ctx.fillRect(x, y, w, h)
      ctx.globalAlpha = 1
      ctx.strokeStyle = 'rgba(255,255,255,.3)'
      ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1)
    })
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

export type LayerId = 'lid' | 'die' | 'interposer' | 'substrate'
export const layerLabels: Array<{ id: LayerId, label: string, detail: string }> = [
  { id: 'lid', label: 'Heat spreader', detail: 'A metal lid that moves heat away from the die.' },
  { id: 'die', label: 'Silicon die', detail: 'The chip itself, where the logic and memory live.' },
  { id: 'interposer', label: 'Bumps and interposer', detail: 'Tiny solder bumps connect the die to the package.' },
  { id: 'substrate', label: 'Package substrate', detail: 'Routes signals out to the pads and pins.' },
]

/** A layered semiconductor package with an optional exploded view. */
export function ChipPackage({ explode = 0, highlight = null, hue = 'violet', dieKind = 'grid', size = 1 }: {
  explode?: number
  highlight?: LayerId | null
  hue?: 'violet' | 'mint' | 'cyan' | 'gold'
  dieKind?: 'grid' | 'pe'
  size?: number
}) {
  const palette = { violet: '#ff6b35', mint: '#38d6b4', cyan: '#48b8ff', gold: '#f2c14e' }[hue]
  const gold = hue === 'gold'
  const lid = useRef<THREE.Group>(null)
  const die = useRef<THREE.Group>(null)
  const inter = useRef<THREE.Group>(null)
  const sub = useRef<THREE.Group>(null)
  const amount = useRef(0)
  const texture = useMemo(() => dieTexture(dieKind), [dieKind])
  useEffect(() => () => texture.dispose(), [texture])
  const bumps = useMemo(() => {
    const items: Array<[number, number]> = []
    for (let x = 0; x < 14; x++) for (let z = 0; z < 14; z++) items.push([(x - 6.5) * 0.13, (z - 6.5) * 0.13])
    return items
  }, [])
  const bumpMesh = useRef<THREE.InstancedMesh>(null)
  const padMesh = useRef<THREE.InstancedMesh>(null)
  const pads = useMemo(() => {
    const items: Array<[number, number]> = []
    for (let i = 0; i < 20; i++) {
      const p = (i - 9.5) * 0.12
      items.push([p, 1.17], [p, -1.17], [1.17, p], [-1.17, p])
    }
    return items
  }, [])
  useEffect(() => {
    const m = new THREE.Matrix4()
    bumps.forEach(([x, z], i) => { m.setPosition(x, 0, z); bumpMesh.current?.setMatrixAt(i, m) })
    if (bumpMesh.current) bumpMesh.current.instanceMatrix.needsUpdate = true
    pads.forEach(([x, z], i) => { m.setPosition(x, 0, z); padMesh.current?.setMatrixAt(i, m) })
    if (padMesh.current) padMesh.current.instanceMatrix.needsUpdate = true
  }, [bumps, pads])

  useFrame((_, delta) => {
    amount.current = THREE.MathUtils.damp(amount.current, explode, 3.2, delta)
    const e = amount.current
    if (lid.current) lid.current.position.y = 0.46 + e * 1.35
    if (die.current) die.current.position.y = 0.28 + e * 0.55
    if (inter.current) inter.current.position.y = 0.14 + e * 0.05
    if (sub.current) sub.current.position.y = -e * 0.55
  })
  const glow = (id: LayerId) => (highlight === id ? 0.9 : 0)
  return (
    <group scale={size}>
      <group ref={sub}>
        <mesh>
          <boxGeometry args={[2.6, 0.16, 2.6]} />
          <meshPhysicalMaterial color={gold ? '#2a2415' : '#17254a'} metalness={0.5} roughness={0.38} clearcoat={0.6} emissive={palette} emissiveIntensity={glow('substrate') * 0.7} />
        </mesh>
        <instancedMesh ref={padMesh} args={[undefined, undefined, pads.length]} position={[0, 0.09, 0]}>
          <boxGeometry args={[0.07, 0.02, 0.07]} />
          <meshStandardMaterial color="#e8c77a" metalness={0.75} roughness={0.25} />
        </instancedMesh>
      </group>
      <group ref={inter}>
        <mesh>
          <boxGeometry args={[2.05, 0.05, 2.05]} />
          <meshStandardMaterial color={gold ? '#4a3d1c' : '#24366b'} metalness={0.7} roughness={0.3} emissive={palette} emissiveIntensity={glow('interposer') * 0.8} />
        </mesh>
        <instancedMesh ref={bumpMesh} args={[undefined, undefined, bumps.length]} position={[0, 0.04, 0]}>
          <sphereGeometry args={[0.035, 8, 6]} />
          <meshStandardMaterial color="#d6dcef" metalness={0.75} roughness={0.2} emissive={palette} emissiveIntensity={glow('interposer') * 0.6} />
        </instancedMesh>
      </group>
      <group ref={die}>
        <mesh>
          <boxGeometry args={[1.6, 0.12, 1.6]} />
          <meshPhysicalMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.35 + glow('die')} metalness={0.6} roughness={0.25} clearcoat={1} />
        </mesh>
      </group>
      <group ref={lid}>
        <mesh>
          <boxGeometry args={[2.35, 0.14, 2.35]} />
          <meshPhysicalMaterial color={gold ? '#cdb775' : '#b9c2dc'} metalness={0.6} roughness={0.32} clearcoat={0.5} emissive={palette} emissiveIntensity={glow('lid') * 0.55} />
        </mesh>
        <mesh position={[0, 0.085, 0]}>
          <boxGeometry args={[1.9, 0.03, 1.9]} />
          <meshStandardMaterial color={gold ? '#e8d6a0' : '#e3e8f7'} metalness={0.55} roughness={0.25} emissive={palette} emissiveIntensity={glow('lid') * 0.5} />
        </mesh>
        {[-0.5, 0, 0.5].map((z) => (
          <mesh key={z} position={[0, 0.105, z]}>
            <boxGeometry args={[1.5, 0.01, 0.025]} />
            <meshBasicMaterial color={palette} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/** A tiny package of the kind that sits on a board. */
export function SmallIc({ position = [0, 0, 0] as [number, number, number], size = 0.4, color = '#101627', accent = '#48b8ff', pins = 6 }: { position?: [number, number, number], size?: number, color?: string, accent?: string, pins?: number }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[size, size * 0.22, size]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[-size * 0.3, size * 0.12, -size * 0.3]}>
        <cylinderGeometry args={[size * 0.05, size * 0.05, 0.005, 12]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      {Array.from({ length: pins }, (_, i) => {
        const p = (i - (pins - 1) / 2) * (size / pins) * 0.9
        return (
          <group key={i}>
            <mesh position={[p, -size * 0.03, size * 0.55]}><boxGeometry args={[size * 0.06, size * 0.03, size * 0.14]} /><meshStandardMaterial color="#cfd5e6" metalness={0.75} roughness={0.25} /></mesh>
            <mesh position={[p, -size * 0.03, -size * 0.55]}><boxGeometry args={[size * 0.06, size * 0.03, size * 0.14]} /><meshStandardMaterial color="#cfd5e6" metalness={0.75} roughness={0.25} /></mesh>
          </group>
        )
      })}
    </group>
  )
}

export function MiniPcb({ accent = '#48e0c4' }: { accent?: string }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.7, 0.06, 1.15]} />
        <meshPhysicalMaterial color="#0f2a46" metalness={0.4} roughness={0.45} clearcoat={0.8} />
      </mesh>
      {[-0.35, -0.12, 0.12, 0.35].map((z, i) => (
        <mesh key={z} position={[-0.1 + (i % 2) * 0.1, 0.034, z]}>
          <boxGeometry args={[1.1 - i * 0.12, 0.006, 0.014]} />
          <meshBasicMaterial color={accent} transparent opacity={0.8} />
        </mesh>
      ))}
      <SmallIc position={[-0.3, 0.1, 0]} size={0.42} accent={accent} pins={7} />
      <SmallIc position={[0.35, 0.08, -0.25]} size={0.26} accent="#ff9a5c" pins={4} />
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0.55, 0.1, 0.1 + i * 0.12]}>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 14]} />
          <meshStandardMaterial color="#c9ccd8" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[-0.78, 0.05, -0.4 + i * 0.115]}>
          <boxGeometry args={[0.1, 0.03, 0.05]} />
          <meshStandardMaterial color="#e8c77a" metalness={0.75} roughness={0.25} />
        </mesh>
      ))}
    </group>
  )
}

/** A stylised CMOS inverter cross section, not a measured device. */
export function Inverter() {
  const block = (x: number, w: number, color: string, y = 0, h = 0.12, emissive = '#000000') => (
    <mesh position={[x, y, 0]}>
      <boxGeometry args={[w, h, 0.7]} />
      <meshStandardMaterial color={color} metalness={0.55} roughness={0.35} emissive={emissive} emissiveIntensity={0.5} />
    </mesh>
  )
  return (
    <group>
      <mesh position={[0, -0.14, 0]}><boxGeometry args={[2.1, 0.22, 0.8]} /><meshStandardMaterial color="#26335c" metalness={0.5} roughness={0.5} /></mesh>
      <mesh position={[0.5, -0.02, 0]}><boxGeometry args={[1.0, 0.07, 0.76]} /><meshStandardMaterial color="#3a2f78" metalness={0.5} roughness={0.5} /></mesh>
      {block(-0.82, 0.24, '#38d6b4', 0, 0.06, '#1b8f7b')}
      {block(-0.2, 0.24, '#38d6b4', 0, 0.06, '#1b8f7b')}
      {block(0.22, 0.24, '#ff9a5c', 0.04, 0.06, '#b8431a')}
      {block(0.82, 0.24, '#ff9a5c', 0.04, 0.06, '#b8431a')}
      {block(-0.51, 0.16, '#e6e8f2', 0.12, 0.06)}
      {block(0.52, 0.16, '#e6e8f2', 0.14, 0.06)}
      {[-0.82, -0.2, 0.22, 0.82].map((x) => (
        <mesh key={x} position={[x, 0.2, 0]}><cylinderGeometry args={[0.04, 0.04, 0.36, 10]} /><meshStandardMaterial color="#e8c77a" metalness={0.75} roughness={0.25} /></mesh>
      ))}
      <mesh position={[0, 0.4, 0]}><boxGeometry args={[1.9, 0.03, 0.06]} /><meshStandardMaterial color="#e8c77a" metalness={0.75} roughness={0.25} /></mesh>
    </group>
  )
}

export function Capacitor() {
  return (
    <group>
      <mesh><cylinderGeometry args={[0.13, 0.13, 0.34, 20]} /><meshPhysicalMaterial color="#1a2a55" metalness={0.5} roughness={0.35} clearcoat={0.7} /></mesh>
      <mesh position={[0, 0.171, 0]}><cylinderGeometry args={[0.12, 0.12, 0.012, 20]} /><meshStandardMaterial color="#cfd5e6" metalness={0.75} roughness={0.3} /></mesh>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.133, 0.133, 0.05, 20]} /><meshBasicMaterial color="#48b8ff" /></mesh>
    </group>
  )
}

export function Resistor() {
  const bands = ['#ff9a5c', '#38d6b4', '#e8c77a']
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh><cylinderGeometry args={[0.065, 0.065, 0.36, 14]} /><meshStandardMaterial color="#d8cfb0" roughness={0.6} /></mesh>
      {bands.map((c, i) => (
        <mesh key={c} position={[0, -0.1 + i * 0.09, 0]}><cylinderGeometry args={[0.068, 0.068, 0.03, 14]} /><meshBasicMaterial color={c} /></mesh>
      ))}
      <mesh position={[0, 0.34, 0]}><cylinderGeometry args={[0.012, 0.012, 0.3, 6]} /><meshStandardMaterial color="#cfd5e6" metalness={0.75} roughness={0.3} /></mesh>
      <mesh position={[0, -0.34, 0]}><cylinderGeometry args={[0.012, 0.012, 0.3, 6]} /><meshStandardMaterial color="#cfd5e6" metalness={0.75} roughness={0.3} /></mesh>
    </group>
  )
}

export function Inductor({ color = '#d89a62' }: { color?: string }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.2, 0.06, 12, 36]} />
      <meshStandardMaterial color={color} metalness={0.75} roughness={0.25} />
    </mesh>
  )
}

/** A standalone silicon die with a lit circuit pattern. */
export function Die({ kind = 'grid' as 'grid' | 'pe', size = 0.8 }) {
  const texture = useMemo(() => dieTexture(kind), [kind])
  useEffect(() => () => texture.dispose(), [texture])
  return (
    <mesh>
      <boxGeometry args={[size, size * 0.09, size]} />
      <meshPhysicalMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.45} metalness={0.6} roughness={0.2} clearcoat={1} />
    </mesh>
  )
}
