import { useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'
import { Capacitor, ChipPackage, Die, Drift, Inductor, Inverter, MiniPcb, Resistor } from './parts'
import type { LayerId } from './parts'


function frame(camera: THREE.Camera, fov: number, position: [number, number, number]) {
  if (camera instanceof THREE.PerspectiveCamera) { camera.fov = fov; camera.updateProjectionMatrix() }
  camera.position.set(...position)
  camera.lookAt(0, 0.1, 0)
}

function Rig({ compact }: { compact: boolean }) {
  const { camera, size, invalidate } = useThree()
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height)
    frame(camera, Math.min(58, 34 * Math.max(1, 1.5 / aspect)), compact ? [0.5, 3.6, 8.6] : [0.8, 3.4, 8])
    invalidate()
  }, [camera, size.width, size.height, invalidate, compact])
  return null
}

export default function ChipScene({ explode, highlight, paused, still, compact, onInteract }: {
  explode: number
  highlight: LayerId | null
  paused: boolean
  still: boolean
  compact: boolean
  onInteract: () => void
}) {
  const dpr = useMemo<[number, number]>(() => [1, compact ? 1.25 : 1.6], [compact])
  return (
    <Canvas dpr={dpr} frameloop={paused ? 'demand' : 'always'} camera={{ position: [0.8, 3.4, 8], fov: 34 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
      <Rig compact={compact} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 6, 4]} intensity={2.2} color="#fff1e6" />
      <pointLight position={[-4, 1.5, -2]} intensity={18} color="#ff7a3d" />
      <pointLight position={[4, 0.5, 3]} intensity={12} color="#66d9d2" />

      <Drift rot={[0, 0.16, 0]} float={0.06} speed={0.5} tilt={[0.12, 0, 0]} still={still}>
        <ChipPackage explode={explode} highlight={highlight} hue="violet" dieKind="grid" size={1.05} />
      </Drift>

      <Drift base={[2.9, 1.5, -0.8]} rot={[0.22, -0.34, 0.08]} float={0.16} speed={0.8} phase={1.4} still={still}>
        <Die kind="pe" size={0.9} />
      </Drift>
      {!compact ? (
        <>
          <Drift base={[-3.1, -1.25, 0.6]} rot={[0.05, 0.27, 0]} float={0.12} speed={0.55} phase={2.8} tilt={[0.35, 0, 0.08]} still={still}>
            <MiniPcb />
          </Drift>
          <Drift base={[3.1, -1.5, 0.9]} rot={[0, -0.22, 0]} float={0.1} speed={0.7} phase={0.6} tilt={[0.45, 0, 0]} still={still}>
            <group scale={0.8}><Inverter /></group>
          </Drift>
          <Drift base={[-2.5, 1.9, -1]} rot={[0.4, 0.3, 0.2]} float={0.14} speed={0.9} phase={3.6} still={still}><Capacitor /></Drift>
          <Drift base={[-3.6, 0.3, -0.5]} rot={[0.1, 0.5, 0.35]} float={0.1} speed={0.65} phase={4.4} still={still}><Resistor /></Drift>
          <Drift base={[1.7, -2.2, 1.6]} rot={[0.3, 0.2, 0.5]} float={0.12} speed={0.75} phase={5.1} still={still}><Inductor /></Drift>
        </>
      ) : null}
      <OrbitControls enableZoom={false} enablePan={false} enableDamping minPolarAngle={0.5} maxPolarAngle={1.75} rotateSpeed={0.6} onStart={onInteract} />
    </Canvas>
  )
}
