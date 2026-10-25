import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function ComputeBoard({ paused }: { paused: boolean }) {
  const group = useRef<THREE.Group>(null)
  const cells = useMemo(() => Array.from({ length: 16 }, (_, i) => ({ x: (i % 4 - 1.5) * .36, z: (Math.floor(i / 4) - 1.5) * .36 })), [])
  useFrame(({ clock }) => {
    if (group.current && !paused) group.current.position.y = Math.sin(clock.elapsedTime * .65) * .12
  })
  return (
    <group ref={group} rotation={[0, -.25, 0]}>
      <mesh position={[0, -.2, 0]}><boxGeometry args={[4.2, .15, 3.3]} /><meshStandardMaterial color="#14223d" metalness={.65} roughness={.4} /></mesh>
      <mesh position={[0, -.08, 0]}><boxGeometry args={[2.2, .16, 2.2]} /><meshStandardMaterial color="#8798b4" metalness={.9} roughness={.25} /></mesh>
      <mesh position={[0, .06, 0]}><boxGeometry args={[1.92, .2, 1.92]} /><meshStandardMaterial color="#15192c" metalness={.7} roughness={.25} /></mesh>
      {cells.map(({ x, z }, i) => <mesh key={i} position={[x, .2, z]}><boxGeometry args={[.27, .075, .27]} /><meshStandardMaterial color={i % 3 ? '#53dfd3' : '#a58bff'} emissive={i % 3 ? '#1faba1' : '#7253ce'} emissiveIntensity={.75} metalness={.6} roughness={.25} /></mesh>)}
      {Array.from({ length: 12 }, (_, i) => {
        const offset = (i - 5.5) * .17
        return <group key={i}>
          {[-1, 1].map(side => <group key={side}>
            <mesh position={[side * 1.25, -.04, offset]}><boxGeometry args={[.35, .07, .07]} /><meshStandardMaterial color="#b8c2dc" metalness={.95} roughness={.2} /></mesh>
            <mesh position={[offset, -.04, side * 1.25]}><boxGeometry args={[.07, .07, .35]} /><meshStandardMaterial color="#b8c2dc" metalness={.95} roughness={.2} /></mesh>
          </group>)}
        </group>
      })}
      {[-1,1].map(side => <group key={side}>
        {Array.from({length: 4},(_,i) => <mesh key={i} position={[side * 1.72, -.08, (i - 1.5) * .58]}><boxGeometry args={[.45,.12,.28]} /><meshStandardMaterial color="#35486b" metalness={.7} roughness={.35} /></mesh>)}
        {[-1,1].map(end => <mesh key={end} position={[side * 1.91, -.09, end * 1.47]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.065,.1,20]} /><meshBasicMaterial color="#8bded7" side={THREE.DoubleSide} /></mesh>)}
      </group>)}
      {[0,1,2].map(i => <mesh key={i} rotation={[-Math.PI/2,0,0]} position={[0,-.3-i*.045,0]}><ringGeometry args={[2.55+i*.2,2.56+i*.2,96]} /><meshBasicMaterial color={i===1 ? '#8e73ed' : '#4ecbc1'} transparent opacity={.25-i*.05} side={THREE.DoubleSide} /></mesh>)}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.65,0]}><circleGeometry args={[3.1,64]} /><meshStandardMaterial color="#0a1022" transparent opacity={.6} metalness={.9} roughness={.5} /></mesh>
    </group>
  )
}

export default function HeroScene({ paused }: { paused: boolean }) {
  return (
    <Canvas dpr={[1,1.5]} frameloop={paused ? 'demand' : 'always'} camera={{position:[5.4,5.7,6.9],fov:36}} gl={{antialias:true,alpha:true,powerPreference:'low-power'}}>
      <ambientLight intensity={1.7} />
      <directionalLight position={[3,7,4]} intensity={3} color="#c6e9ff" />
      <pointLight position={[-4,2,-2]} intensity={14} color="#9872ff" />
      <pointLight position={[4,1,3]} intensity={12} color="#53f0d2" />
      <ComputeBoard paused={paused} />
      <OrbitControls enablePan={false} enableZoom={false} enableDamping autoRotate={!paused} autoRotateSpeed={.55} minPolarAngle={.5} maxPolarAngle={1.35} />
    </Canvas>
  )
}
