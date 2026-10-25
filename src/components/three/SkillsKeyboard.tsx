import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { keyboardSkills } from '../../data/keyboard'
import type { KeyboardSkill } from '../../data/keyboard'

function keyLegend(skill: KeyboardSkill) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = skill.color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `700 ${skill.legend.length > 3 ? 52 : skill.legend.length > 2 ? 68 : 92}px Arial, sans-serif`
    ctx.fillText(skill.legend,128,115)
    ctx.fillStyle = '#8a929d'
    ctx.font = '20px Arial, sans-serif'
    ctx.fillText(skill.shortcut.toUpperCase(),128,205)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function SkillKey({ skill, index, selected, pressCount, onSelect }: { skill: KeyboardSkill; index: number; selected: boolean; pressCount: number; onSelect: (id: string) => void }) {
  const key = useRef<THREE.Group>(null)
  const pressedUntil = useRef(0)
  const [hovered, setHovered] = useState(false)
  const { invalidate } = useThree()
  const texture = useMemo(() => keyLegend(skill),[skill])
  useEffect(() => () => texture.dispose(),[texture])
  useCursor(hovered)
  useEffect(() => {
    if (selected && pressCount > 0) pressedUntil.current = performance.now() + 180
    invalidate()
  },[selected,pressCount,invalidate])
  useFrame((_,delta) => {
    if (!key.current) return
    const down = selected && performance.now() < pressedUntil.current
    const target = down ? .035 : hovered ? .16 : .22
    key.current.position.y = THREE.MathUtils.damp(key.current.position.y,target,22,Math.min(delta,.05))
    if (down || Math.abs(key.current.position.y-target)>.001) invalidate()
  })
  const x=(index%5-2)*.94
  const z=(Math.floor(index/5)-1)*.96
  return <group position={[x,0,z]}>
    <RoundedBox args={[.85,.08,.87]} radius={.03} smoothness={2} position={[0,-.06,0]}><meshStandardMaterial color={selected ? '#92ece0' : '#1a4a70'} emissive={selected ? '#35a5a0' : '#000000'} emissiveIntensity={.5} /></RoundedBox>
    <group ref={key} position={[0,.22,0]} onPointerOver={event=>{event.stopPropagation();setHovered(true)}} onPointerOut={()=>setHovered(false)} onClick={event=>{event.stopPropagation();onSelect(skill.id)}}>
      <RoundedBox args={[.82,.5,.84]} radius={.08} smoothness={3}><meshStandardMaterial color={hovered ? '#e1eff9' : '#c9d0d8'} roughness={.42} metalness={.03} /></RoundedBox>
      <RoundedBox args={[.72,.1,.74]} radius={.04} smoothness={3} position={[0,.25,0]}><meshStandardMaterial color={selected ? '#e6fffa' : '#f5f5f0'} roughness={.34} metalness={.02} /></RoundedBox>
      <mesh position={[0,.307,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.64,.64]} /><meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} polygonOffset polygonOffsetFactor={-1} /></mesh>
    </group>
  </group>
}

export function SkillsKeyboard({ paused, selectedId, pressCount, onSelect }: { paused: boolean; selectedId: string; pressCount: number; onSelect: (id: string) => void }) {
  const board=useRef<THREE.Group>(null)
  useFrame(({clock})=>{if(board.current && !paused) board.current.position.y=Math.sin(clock.elapsedTime*.6)*.055})
  return <group ref={board} rotation={[0,-.1,0]} scale={1.1}>
    <RoundedBox args={[5.05,.3,3.35]} radius={.12} smoothness={4} position={[0,-.3,0]}><meshStandardMaterial color="#173e60" metalness={.4} roughness={.3} /></RoundedBox>
    <RoundedBox args={[5.08,.09,3.38]} radius={.04} smoothness={4} position={[0,-.12,0]}><meshStandardMaterial color="#79b8d9" metalness={.22} roughness={.3} /></RoundedBox>
    {keyboardSkills.map((skill,index)=><SkillKey key={skill.id} skill={skill} index={index} selected={selectedId===skill.id} pressCount={pressCount} onSelect={onSelect} />)}
    <mesh position={[2.25,-.21,0]}><boxGeometry args={[.035,.07,.28]} /><meshStandardMaterial color="#071727" /></mesh>
  </group>
}
