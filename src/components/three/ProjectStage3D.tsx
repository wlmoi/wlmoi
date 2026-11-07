import { useEffect, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { ChipPackage, Die, Drift, SmallIc } from './parts'

const accents = ['#f2c14e', '#4fd6a0', '#ff7a33']

function GanModel({ still }: { still: boolean }) {
  return (
    <Drift rot={[0, 0.14, 0]} float={0.06} speed={0.5} tilt={[0.18, 0, 0]} still={still}>
      <ChipPackage explode={0.42} hue="gold" dieKind="pe" size={1.1} />
    </Drift>
  )
}

function IgorModel({ still }: { still: boolean }) {
  const wheels: Array<[number, number]> = [[-1.25, -0.85], [1.25, -0.85], [-1.25, 0.85], [1.25, 0.85]]
  const header = useMemo(() => Array.from({ length: 14 }, (_, i) => i), [])
  return (
    <Drift rot={[0, 0.17, 0]} float={0.07} speed={0.55} tilt={[0.3, 0, 0]} still={still}>
      <group scale={1.15}>
        <mesh>
          <boxGeometry args={[3, 0.09, 1.9]} />
          <meshPhysicalMaterial color="#0d3a33" metalness={0.45} roughness={0.4} clearcoat={0.8} />
        </mesh>
        <mesh position={[0.15, 0.09, 0]}>
          <boxGeometry args={[1.15, 0.14, 1.15]} />
          <meshStandardMaterial color="#12172b" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0.15, 0.17, 0]}>
          <boxGeometry args={[0.7, 0.03, 0.7]} />
          <meshStandardMaterial color="#4fd6a0" emissive="#1f9a6e" emissiveIntensity={0.9} metalness={0.7} roughness={0.25} />
        </mesh>
        <SmallIc position={[-0.95, 0.1, -0.35]} size={0.5} accent="#4fd6a0" pins={8} />
        <SmallIc position={[-0.95, 0.09, 0.45]} size={0.34} accent="#ff9a5c" pins={5} />
        <SmallIc position={[1.0, 0.09, -0.5]} size={0.4} accent="#7fe3c4" pins={6} />
        {header.map((i) => (
          <mesh key={i} position={[-1.3 + i * 0.2, 0.1, 0.88]}><boxGeometry args={[0.08, 0.14, 0.08]} /><meshStandardMaterial color="#e8c77a" metalness={0.75} roughness={0.25} /></mesh>
        ))}
        <mesh position={[1.35, 0.14, 0.45]}><boxGeometry args={[0.38, 0.22, 0.5]} /><meshStandardMaterial color="#c9ccd8" metalness={0.9} roughness={0.35} /></mesh>
        {[-0.5, -0.25, 0, 0.25].map((z) => (
          <mesh key={z} position={[-0.3 + z * 0.4, 0.052, 0.65]}><boxGeometry args={[1.2, 0.006, 0.012]} /><meshBasicMaterial color="#4fd6a0" /></mesh>
        ))}
        {wheels.map(([x, z], i) => (
          <mesh key={i} position={[x, -0.2, z * 1.15]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.26, 24]} />
            <meshStandardMaterial color="#1b2234" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </Drift>
  )
}

function IrisModel({ still }: { still: boolean }) {
  const rings = [1.0, 0.8, 0.6]
  const cells = useMemo(() => Array.from({ length: 21 }, (_, i) => [(i % 7 - 3) * 0.34, 0.78 + (Math.floor(i / 7) - 1) * 0.3] as const), [])
  return (
    <Drift rot={[0, 0.15, 0]} float={0.07} speed={0.6} tilt={[0.32, 0, 0]} still={still}>
      <group scale={1.2}>
        <mesh>
          <boxGeometry args={[2.8, 0.12, 2.8]} />
          <meshPhysicalMaterial color="#3a2418" metalness={0.5} roughness={0.38} clearcoat={0.7} />
        </mesh>
        {rings.map((r, i) => (
          <group key={r} position={[0, 0.1 + i * 0.012, -0.5]} scale={0.78}>
            {[[0, r, r * 2, 0.06], [0, -r, r * 2, 0.06], [r, 0, 0.06, r * 2], [-r, 0, 0.06, r * 2]].map(([x, z, w, d]) => (
              <mesh key={`${x}${z}`} position={[x, 0, z]}><boxGeometry args={[w, 0.05, d]} /><meshStandardMaterial color="#c8763a" metalness={0.9} roughness={0.22} emissive="#ff7a33" emissiveIntensity={0.18} /></mesh>
            ))}
          </group>
        ))}
        {cells.map(([x, z], i) => (
          <mesh key={i} position={[x, 0.11, z]}>
            <boxGeometry args={[0.24, 0.05, 0.24]} />
            <meshStandardMaterial color="#6b3d22" metalness={0.9} roughness={0.3} emissive="#ff7a33" emissiveIntensity={0.4} />
          </mesh>
        ))}
        <mesh position={[0, 0.17, -0.5]}>
          <torusGeometry args={[0.38, 0.015, 8, 48]} />
          <meshBasicMaterial color="#ffb25c" />
        </mesh>
        <mesh position={[0, 0.17, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.57, 48]} />
          <meshBasicMaterial color="#ffb25c" transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Drift>
  )
}

function Slot({ index, active, children }: { index: number, active: number, children: ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const state = useRef({ x: index === active ? 0 : 6, s: index === active ? 1 : 0 })
  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    const isActive = index === active
    const targetX = isActive ? 0 : index < active ? -5 : 5
    state.current.x = THREE.MathUtils.damp(state.current.x, targetX, 4.2, delta)
    state.current.s = THREE.MathUtils.damp(state.current.s, isActive ? 1 : 0, 4.2, delta)
    g.position.x = state.current.x
    g.scale.setScalar(Math.max(0.0001, state.current.s))
    g.visible = state.current.s > 0.02
  })
  return <group ref={group} visible={index === active}>{children}</group>
}

function RimLight({ active }: { active: number }) {
  const rim = useRef<THREE.PointLight>(null)
  const color = useRef(new THREE.Color(accents[active]))
  const target = useMemo(() => new THREE.Color(['#fff0c2', '#8ff0d4', '#ffc58a'][active]), [active])
  useFrame((_, delta) => {
    color.current.lerp(target, Math.min(1, delta * 3.5))
    rim.current?.color.copy(color.current)
  })
  return <pointLight ref={rim} position={[4, 0.5, 3]} intensity={10} />
}

function Lighting({ active }: { active: number }) {
  const key = useRef<THREE.PointLight>(null)
  const color = useRef(new THREE.Color(accents[active]))
  const target = useMemo(() => new THREE.Color(accents[active]), [active])
  useFrame((_, delta) => {
    color.current.lerp(target, Math.min(1, delta * 3.5))
    key.current?.color.copy(color.current)
  })
  return <pointLight ref={key} position={[-3.5, 1.5, 2.5]} intensity={20} />
}


function frame(camera: THREE.Camera, fov: number, position: [number, number, number]) {
  if (camera instanceof THREE.PerspectiveCamera) { camera.fov = fov; camera.updateProjectionMatrix() }
  camera.position.set(...position)
  camera.lookAt(0, 0, 0)
}

function Rig() {
  const { camera, size, invalidate } = useThree()
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height)
    frame(camera, Math.min(60, 32 * Math.max(1, 1.4 / aspect)), [0.4, 3.2, 7.6])
    invalidate()
  }, [camera, size.width, size.height, invalidate])
  return null
}

export default function ProjectStage3D({ active, paused, still, rotatable = true }: { active: number, paused: boolean, still: boolean, rotatable?: boolean }) {
  return (
    <Canvas dpr={[1, 1.5]} frameloop={paused ? 'demand' : 'always'} camera={{ position: [0.4, 3.2, 7.6], fov: 32 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
      <Rig />
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 6, 4]} intensity={2.1} color="#fff1e6" />
      <Lighting active={active} />
      <RimLight active={active} />
      <Slot index={0} active={active}><GanModel still={still || active !== 0} /></Slot>
      <Slot index={1} active={active}><IgorModel still={still || active !== 1} /></Slot>
      <Slot index={2} active={active}><IrisModel still={still || active !== 2} /></Slot>
      <Drift base={[3.1, 1.7, -1.4]} rot={[0.2, 0.3, 0.1]} float={0.12} speed={0.8} phase={2} still={still}>
        <group scale={0.55}><Die kind="grid" size={0.8} /></group>
      </Drift>
      <OrbitControls enableRotate={rotatable} enableZoom={false} enablePan={false} enableDamping minPolarAngle={0.6} maxPolarAngle={1.7} rotateSpeed={0.6} />
    </Canvas>
  )
}
