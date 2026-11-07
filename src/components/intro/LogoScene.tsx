import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ChipPackage } from '../three/parts'

const cool = new THREE.Color('#66d9d2')
const warm = new THREE.Color('#ff7a3d')

function Show({ duration, onTurned, light }: { duration: number, onTurned?: () => void, light: React.RefObject<THREE.PointLight | null> }) {
  const group = useRef<THREE.Group>(null)
  const start = useRef<number | null>(null)
  const done = useRef(false)
  useFrame(({ clock, camera }) => {
    if (!group.current) return
    if (start.current === null) start.current = clock.elapsedTime
    const t = Math.min(1, (clock.elapsedTime - start.current) / duration)
    const eased = 1 - Math.pow(1 - t, 3)
    // settle into the same pose the hero chip has
    group.current.rotation.y = (1 - eased) * Math.PI * 2.2
    group.current.rotation.x = 0.12 + (1 - eased) * 0.5
    group.current.position.y = (1 - eased) * 0.4
    camera.position.set(0.8, 3.4 + (1 - eased) * 1.6, 8 + (1 - eased) * 5)
    camera.lookAt(0, 0.1, 0)
    light.current?.color.copy(cool).lerp(warm, Math.min(1, Math.max(0, (t - 0.25) / 0.6)))
    if (t >= 1 && !done.current) { done.current = true; onTurned?.() }
  })
  return (
    <group ref={group}>
      <ChipPackage explode={0} highlight={null} hue="violet" dieKind="grid" size={1.05} />
    </group>
  )
}

export default function LogoScene({ duration, onTurned }: { duration: number, onTurned?: () => void }) {
  const light = useRef<THREE.PointLight>(null)
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0.8, 5, 13], fov: 34 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 6, 4]} intensity={2.2} color="#fff1e6" />
      <pointLight ref={light} position={[-4, 1.5, -2]} intensity={18} color="#ff7a3d" />
      <pointLight position={[4, 0.5, 3]} intensity={12} color="#66d9d2" />
      <Show duration={duration} onTurned={onTurned} light={light} />
    </Canvas>
  )
}
