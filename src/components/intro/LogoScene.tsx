import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const stops = ['#ff8a5c', '#d24dff', '#4d7bff', '#37e0d0'].map((c) => new THREE.Color(c))

function gradientAt(t: number) {
  const scaled = Math.min(0.9999, Math.max(0, t)) * (stops.length - 1)
  const i = Math.floor(scaled)
  return stops[i].clone().lerp(stops[i + 1], scaled - i)
}

function useLogoGeometry() {
  return useMemo(() => {
    const r = 0.16
    const pts = [new THREE.Vector2(0, 1.15), new THREE.Vector2(1.1, -0.8), new THREE.Vector2(-1.1, -0.8)]
    const shape = new THREE.Shape()
    pts.forEach((p, i) => {
      const prev = pts[(i + 2) % 3]
      const next = pts[(i + 1) % 3]
      const a = p.clone().add(prev.clone().sub(p).normalize().multiplyScalar(r * 2.4))
      const b = p.clone().add(next.clone().sub(p).normalize().multiplyScalar(r * 2.4))
      if (i === 0) shape.moveTo(a.x, a.y); else shape.lineTo(a.x, a.y)
      shape.quadraticCurveTo(p.x, p.y, b.x, b.y)
    })
    shape.closePath()
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.34, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 5, curveSegments: 14 })
    geometry.center()
    const position = geometry.attributes.position
    const colors = new Float32Array(position.count * 3)
    for (let i = 0; i < position.count; i++) {
      const c = gradientAt((position.getY(i) * -0.5 + position.getX(i) * 0.35 + 0.55) / 1.1)
      colors.set([c.r, c.g, c.b], i * 3)
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geometry
  }, [])
}

const cool = new THREE.Color('#66d9d2')
const warm = new THREE.Color('#ff7a3d')

function Logo({ duration, onTurned, light }: { duration: number, onTurned?: () => void, light: React.RefObject<THREE.PointLight | null> }) {
  const group = useRef<THREE.Group>(null)
  const geometry = useLogoGeometry()
  const start = useRef<number | null>(null)
  const done = useRef(false)
  useFrame(({ clock }) => {
    if (!group.current) return
    if (start.current === null) start.current = clock.elapsedTime
    const t = Math.min(1, (clock.elapsedTime - start.current) / duration)
    const eased = 1 - Math.pow(1 - t, 3)
    group.current.rotation.y = -0.6 + eased * Math.PI * 2.3
    light.current?.color.copy(cool).lerp(warm, Math.min(1, Math.max(0, (t - 0.35) / 0.65)))
    group.current.rotation.x = Math.sin(t * Math.PI) * 0.12
    group.current.position.y = Math.sin(t * Math.PI) * 0.06
    if (t >= 1 && !done.current) { done.current = true; onTurned?.() }
  })
  const material = <meshPhysicalMaterial vertexColors metalness={0.35} roughness={0.22} clearcoat={1} clearcoatRoughness={0.12} />
  return (
    <group ref={group}>
      <mesh geometry={geometry}>{material}</mesh>
      <group position={[0, -2.45, 0]} scale={[1, -1, 1]}>
        <mesh geometry={geometry}><meshBasicMaterial vertexColors transparent opacity={0.14} depthWrite={false} /></mesh>
      </group>
    </group>
  )
}

export default function LogoScene({ duration, onTurned }: { duration: number, onTurned?: () => void }) {
  const light = useRef<THREE.PointLight>(null)
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5.6], fov: 34 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 3, 4]} intensity={2.4} />
      <pointLight ref={light} position={[-3, -1, 2]} intensity={14} color="#66d9d2" />
      <Logo duration={duration} onTurned={onTurned} light={light} />
    </Canvas>
  )
}
