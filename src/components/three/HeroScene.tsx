import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { OrbitControls, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { SkillsKeyboard } from './SkillsKeyboard'
import type { HeroSceneMode } from '../../data/keyboard'
import type { SiliconBoardModuleId } from '../../data/heroBoard'

function frameHeroCamera(camera: THREE.Camera, aspect: number) {
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.fov = Math.min(52, 36 * Math.max(1, 1.35 / aspect))
    camera.updateProjectionMatrix()
  }
}

function ResponsiveHeroCamera() {
  const { camera, size, invalidate } = useThree()
  useEffect(() => {
    frameHeroCamera(camera, size.width / Math.max(1, size.height))
    invalidate()
  }, [camera, size.width, size.height, invalidate])
  return null
}
function ComputeBoard({ paused, selectedPart, onSelect }: { paused: boolean; selectedPart: SiliconBoardModuleId; onSelect: (id: SiliconBoardModuleId) => void }) {
  const group = useRef<THREE.Group>(null)
  const [hoveredPart, setHoveredPart] = useState<SiliconBoardModuleId | null>(null)
  const cells = useMemo(() => Array.from({ length: 16 }, (_, i) => ({ x: (i % 4 - 1.5) * .36, z: (Math.floor(i / 4) - 1.5) * .36 })), [])
  useCursor(hoveredPart !== null)
  const selectModule = (id: SiliconBoardModuleId) => ({
    onClick: (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation()
      if (event.delta < 8) onSelect(id)
    },
    onPointerOver: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation()
      setHoveredPart(id)
    },
    onPointerOut: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation()
      setHoveredPart(current => current === id ? null : current)
    },
  })
  const emphasized = (id: SiliconBoardModuleId) => selectedPart === id || hoveredPart === id
  const computeEmphasis = emphasized('compute')
  const memoryEmphasis = emphasized('memory')
  const controlEmphasis = emphasized('control')
  const implementationEmphasis = emphasized('implementation')
  useFrame(({ clock }) => {
    if (group.current && !paused) group.current.position.y = Math.sin(clock.elapsedTime * .65) * .12
  })
  return (
    <group ref={group} rotation={[0, -.25, 0]}>
      <mesh {...selectModule('implementation')} position={[0, -.2, 0]}><boxGeometry args={[4.2, .15, 3.3]} /><meshStandardMaterial color={implementationEmphasis ? '#1e4a57' : '#14223d'} emissive={implementationEmphasis ? '#165860' : '#000000'} emissiveIntensity={.65} metalness={.65} roughness={.4} /></mesh>
      <mesh {...selectModule('implementation')} position={[0, -.08, 0]}><boxGeometry args={[2.2, .16, 2.2]} /><meshStandardMaterial color={implementationEmphasis ? '#a8ded6' : '#8798b4'} emissive={implementationEmphasis ? '#397b80' : '#000000'} emissiveIntensity={.35} metalness={.9} roughness={.25} /></mesh>
      <mesh {...selectModule('implementation')} position={[0, .06, 0]}><boxGeometry args={[1.92, .2, 1.92]} /><meshStandardMaterial color={implementationEmphasis ? '#273452' : '#15192c'} emissive={implementationEmphasis ? '#37306d' : '#000000'} emissiveIntensity={.45} metalness={.7} roughness={.25} /></mesh>
      {cells.map(({ x, z }, i) => <mesh key={i} {...selectModule('compute')} position={[x, .2, z]}><boxGeometry args={[.27, .075, .27]} /><meshStandardMaterial color={computeEmphasis ? '#d5fff6' : i % 3 ? '#53dfd3' : '#a58bff'} emissive={computeEmphasis ? '#53dfd3' : i % 3 ? '#1faba1' : '#7253ce'} emissiveIntensity={computeEmphasis ? 1.3 : .75} metalness={.6} roughness={.25} /></mesh>)}
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
        <group {...selectModule('memory')}>
          {Array.from({length: 4},(_,i) => <mesh key={i} position={[side * 1.72, -.08, (i - 1.5) * .58]}><boxGeometry args={[.45,.12,.28]} /><meshStandardMaterial color={memoryEmphasis ? '#b7a2ff' : '#35486b'} emissive={memoryEmphasis ? '#7255bd' : '#000000'} emissiveIntensity={memoryEmphasis ? .8 : 0} metalness={.7} roughness={.35} /></mesh>)}
        </group>
        {[-1,1].map(end => <mesh key={end} {...selectModule('control')} position={[side * 1.91, -.09, end * 1.47]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.065,.1,20]} /><meshBasicMaterial color={controlEmphasis ? '#fff0ad' : '#8bded7'} side={THREE.DoubleSide} /></mesh>)}
      </group>)}
      {[0,1,2].map(i => <mesh key={i} rotation={[-Math.PI/2,0,0]} position={[0,-.3-i*.045,0]}><ringGeometry args={[2.55+i*.2,2.56+i*.2,96]} /><meshBasicMaterial color={i===1 ? '#8e73ed' : '#4ecbc1'} transparent opacity={.25-i*.05} side={THREE.DoubleSide} /></mesh>)}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.65,0]}><circleGeometry args={[3.1,64]} /><meshStandardMaterial color="#0a1022" transparent opacity={.6} metalness={.9} roughness={.5} /></mesh>
    </group>
  )
}

export default function HeroScene({ paused, mode, selectedId, pressCount, onSelect, selectedBoardModule, onBoardModuleSelect }: { paused: boolean; mode: HeroSceneMode; selectedId: string; pressCount: number; onSelect: (id: string) => void; selectedBoardModule: SiliconBoardModuleId; onBoardModuleSelect: (id: SiliconBoardModuleId) => void }) {
  const camera = useMemo(() => ({ position: (mode === 'keyboard' ? [.65,4.8,6.7] : [5.4,5.7,6.9]) as [number,number,number], fov: 36 }),[mode])
  return (
    <Canvas dpr={[1,1.25]} frameloop={paused ? 'demand' : 'always'} camera={camera} gl={{antialias:true,alpha:true,powerPreference:'low-power'}}>
      <ResponsiveHeroCamera /><ambientLight intensity={1.7} />
      <directionalLight position={[3,7,4]} intensity={3} color="#c6e9ff" />
      <pointLight position={[-4,2,-2]} intensity={mode === 'keyboard' ? 3 : 14} color="#9872ff" />
      <pointLight position={[4,1,3]} intensity={mode === 'keyboard' ? 3 : 12} color="#53f0d2" />
      {mode === 'keyboard' ? <SkillsKeyboard paused={paused} selectedId={selectedId} pressCount={pressCount} onSelect={onSelect} /> : <ComputeBoard paused={paused} selectedPart={selectedBoardModule} onSelect={onBoardModuleSelect} />}
      <OrbitControls enablePan enableZoom minDistance={2} maxDistance={30} enableDamping autoRotate={false} autoRotateSpeed={.55} />
    </Canvas>
  )
}
