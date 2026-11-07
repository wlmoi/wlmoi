import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const cool = new THREE.Color('#66d9d2')
const warm = new THREE.Color('#ff7a3d')
const PINS = Array.from({ length: 8 }, (_, i) => -1.05 + i * 0.3)

function Chip({ duration, onTurned, light }: { duration: number, onTurned?: () => void, light: React.RefObject<THREE.PointLight | null> }) {
  const group = useRef<THREE.Group>(null)
  const die = useRef<THREE.Mesh>(null)
  const start = useRef<number | null>(null)
  const done = useRef(false)
  useFrame(({ clock }) => {
    if (!group.current) return
    if (start.current === null) start.current = clock.elapsedTime
    const t = Math.min(1, (clock.elapsedTime - start.current) / duration)
    const eased = 1 - Math.pow(1 - t, 3)
    group.current.rotation.y = -0.9 + eased * Math.PI * 1.4
    group.current.rotation.x = 0.7 - eased * 0.3
    group.current.scale.setScalar(0.7 + eased * 0.3)
    light.current?.color.copy(cool).lerp(warm, Math.min(1, Math.max(0, (t - 0.3) / 0.5)))
    if (die.current) (die.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + Math.min(1, t * 1.6) * 1.6
    if (t >= 1 && !done.current) { done.current = true; onTurned?.() }
  })
  return (
    <group ref={group}>
      <mesh><boxGeometry args={[2.5, 0.28, 2.5]} /><meshPhysicalMaterial color="#3a475b" metalness={0.3} roughness={0.4} clearcoat={0.8} /></mesh>
      <mesh ref={die} position={[0, 0.17, 0]}><boxGeometry args={[1.35, 0.08, 1.35]} /><meshStandardMaterial color="#6a3a22" emissive="#ff6b35" emissiveIntensity={0.3} metalness={0.7} roughness={0.3} /></mesh>
      <mesh position={[0, 0.215, 0]}><boxGeometry args={[0.7, 0.02, 0.7]} /><meshStandardMaterial color="#ffb47e" emissive="#ffb47e" emissiveIntensity={0.9} /></mesh>
      {PINS.map((p) => (
        <group key={p}>
          <mesh position={[p, -0.02, 1.38]}><boxGeometry args={[0.14, 0.05, 0.32]} /><meshStandardMaterial color="#d9b66a" metalness={0.9} roughness={0.25} /></mesh>
          <mesh position={[p, -0.02, -1.38]}><boxGeometry args={[0.14, 0.05, 0.32]} /><meshStandardMaterial color="#d9b66a" metalness={0.9} roughness={0.25} /></mesh>
          <mesh position={[1.38, -0.02, p]}><boxGeometry args={[0.32, 0.05, 0.14]} /><meshStandardMaterial color="#d9b66a" metalness={0.9} roughness={0.25} /></mesh>
          <mesh position={[-1.38, -0.02, p]}><boxGeometry args={[0.32, 0.05, 0.14]} /><meshStandardMaterial color="#d9b66a" metalness={0.9} roughness={0.25} /></mesh>
        </group>
      ))}
    </group>
  )
}

export default function LogoScene({ duration, onTurned }: { duration: number, onTurned?: () => void }) {
  const light = useRef<THREE.PointLight>(null)
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 2.6, 5.4], fov: 34 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={1.6} />
      <directionalLight position={[2, 4, 4]} intensity={4} />
      <pointLight ref={light} position={[-3, 1, 2]} intensity={16} color="#66d9d2" />
      <Chip duration={duration} onTurned={onTurned} light={light} />
    </Canvas>
  )
}
