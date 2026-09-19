import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

function DieModel() {
  const group = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  const cells = useMemo(() => Array.from({ length: 16 }, (_, index) => ({
    x: (index % 4 - 1.5) * 0.88,
    z: (Math.floor(index / 4) - 1.5) * 0.88,
  })), [])

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.08
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.12, 0.05)
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -pointer.x * 0.08, 0.05)
  })

  return (
    <group ref={group} rotation={[-0.35, 0.35, 0]}>
      <mesh position={[0, -0.18, 0]}>
        <boxGeometry args={[4.1, 0.18, 4.1]} />
        <meshBasicMaterial color="#0b202a" />
      </mesh>
      <lineSegments position={[0, -0.07, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(4.1, 0.18, 4.1)]} />
        <lineBasicMaterial color="#476875" transparent opacity={0.8} />
      </lineSegments>
      {cells.map((cell) => (
        <group key={`${cell.x}-${cell.z}`} position={[cell.x, 0.08, cell.z]}>
          <mesh>
            <boxGeometry args={[0.65, 0.14, 0.65]} />
            <meshBasicMaterial color="#102f3a" />
          </mesh>
          <lineSegments position={[0, 0.08, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(0.65, 0.14, 0.65)]} />
            <lineBasicMaterial color="#5f8893" transparent opacity={0.55} />
          </lineSegments>
        </group>
      ))}
      {Array.from({ length: 5 }, (_, index) => {
        const offset = -1.55 + index * 0.78
        return (
          <Line
            key={`x-${index}`}
            points={[[-2.35, 0, 0], [2.35, 0, 0]]}
            position={[0, 0.17, offset]}
            color="#53f0d2"
            transparent
            opacity={0.55 - index * 0.06}
          />
        )
      })}
      {Array.from({ length: 5 }, (_, index) => {
        const offset = -1.55 + index * 0.78
        return (
          <Line
            key={`z-${index}`}
            points={[[-2.35, 0, 0], [2.35, 0, 0]]}
            rotation={[0, Math.PI / 2, 0]}
            position={[offset, 0.18, 0]}
            color="#53f0d2"
            transparent
            opacity={0.5 - index * 0.055}
          />
        )
      })}
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[1.35, 0.08, 1.35]} />
        <meshBasicMaterial color="#173b46" transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

export default function SiliconVisual() {
  return (
    <div className="h-full w-full" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} frameloop="always" gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}>
        <PerspectiveCamera makeDefault position={[5.8, 4.8, 6.3]} fov={35} />
        <ambientLight intensity={0.8} />
        <DieModel />
      </Canvas>
    </div>
  )
}
