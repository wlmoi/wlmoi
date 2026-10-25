import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { FluidSimulation, attachPointerSplats } from 'three-fluid-fx'
import { effectIndex } from '../../data/fluid'
import type { FluidEffect } from '../../data/fluid'
import { particleFragment, particleVertex } from './fluidShaders'

type Props = { effect: FluidEffect; paused: boolean; strength: number; pulse: number; stage: number; compact: boolean; onFailure: () => void; onReady: () => void }
type Runtime = { fluid: FluidSimulation; material: THREE.ShaderMaterial; geometry: THREE.BufferGeometry; time: number; lastPulse: number; emitter: number }

function FluidWorld({ effect, paused, strength, pulse, stage, compact, onFailure, onReady }: Props) {
  const { gl, size, invalidate } = useThree()
  const points = useRef<THREE.Points>(null)
  const runtime = useRef<Runtime | null>(null)

  const pulseValue=useRef(pulse)
  useEffect(()=>{pulseValue.current=pulse},[pulse])

  useEffect(() => {
    let fluid: FluidSimulation | undefined
    let geometry: THREE.BufferGeometry | undefined
    let material: THREE.ShaderMaterial | undefined
    try {
      const weak = compact || (navigator.hardwareConcurrency || 8) <= 4
      fluid = new FluidSimulation(gl,{profile:'performance',simResolution:weak?64:96,dyeResolution:128,pressureIterations:weak?3:5,bfecc:false,enableVorticity:true,curlStrength:.45,splatRadius:.0015,splatForce:1.4,densityDissipation:.92,velocityDissipation:.97})
      fluid.resize(gl.domElement.clientWidth,gl.domElement.clientHeight)
      const count = weak ? 4200 : 12000
      const seeds = new Float32Array(count*4)
      const kinds = new Float32Array(count)
      // Repeatable positions make each effect stable when a section re-enters view.
      let state = 3217
      for (let i=0;i<seeds.length;i++) { state=(state*1664525+1013904223)>>>0;seeds[i]=(state+.5)/4294967296 }
      for(let i=0;i<count;i++) kinds[i]=i%3
      geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(count*3),3))
      geometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,4))
      geometry.setAttribute('aKind',new THREE.BufferAttribute(kinds,1))
      material = new THREE.ShaderMaterial({vertexShader:particleVertex,fragmentShader:particleFragment,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uTime:{value:0},uMode:{value:0},uFlow:{value:.75},uPointScale:{value:Math.min(gl.getPixelRatio(),1.4)},uPulseTime:{value:-100},uStage:{value:0},uVelocity:{value:fluid.velocityTexture},uDensity:{value:fluid.densityTexture}}})
      if(points.current) { points.current.geometry=geometry;points.current.material=material }
      runtime.current={fluid,geometry,material,time:0,lastPulse:pulseValue.current,emitter:0}
      onReady()
      invalidate()
    } catch { onFailure() }
    return ()=>{runtime.current=null;material?.dispose();geometry?.dispose();fluid?.dispose()}
  },[gl,compact,invalidate,onFailure,onReady])

  useEffect(()=>{
    const fluid=runtime.current?.fluid
    if(!fluid||paused)return
    return attachPointerSplats(gl.domElement,fluid)
  },[gl,paused,compact])

  useEffect(()=>{
    const current=runtime.current
    if(!current)return
    current.fluid.resize(size.width,size.height)
    current.material.uniforms.uMode.value=effectIndex[effect]
    current.material.uniforms.uFlow.value=strength
    current.material.uniforms.uStage.value=stage
    invalidate()
  },[effect,strength,stage,size.width,size.height,invalidate])

  useFrame((_,delta)=>{
    const current=runtime.current
    if(!current||paused)return
    try {
      const dt=Math.min(delta,1/30)
      current.time+=dt
      current.emitter+=dt
      if(current.lastPulse!==pulse){
        current.lastPulse=pulse
        current.material.uniforms.uPulseTime.value=current.time
        current.fluid.addSplat(.5,.5,55,30,{radius:.018})
        current.fluid.addSplat(.5,.5,-35,-50,{radius:.012})
      }
      if(current.emitter>1.5){
        current.emitter=0
        const angle=current.time*.6
        current.fluid.addSplat(.5+Math.cos(angle)*.2,.5+Math.sin(angle)*.18,-Math.sin(angle)*14,Math.cos(angle)*14,{radius:.002})
      }
      current.fluid.step(dt)
      const uniforms=current.material.uniforms
      uniforms.uTime.value=current.time
      uniforms.uVelocity.value=current.fluid.velocityTexture
      uniforms.uDensity.value=current.fluid.densityTexture
    } catch { onFailure() }
  },-1)

  return <>
    <points ref={points} frustumCulled={false} />
    {(effect==='lattice'||effect==='combined') ? <group scale={effect==='combined'?.67:1}>
      {Array.from({length:16},(_,i)=><mesh key={i} position={[(i%4-1.5)*.88,(Math.floor(i/4)-1.5)*.73,0]}><boxGeometry args={[.74,.57,.4]} /><meshBasicMaterial color="#55cbb9" wireframe transparent opacity={.11+stage*.012} /></mesh>)}
    </group> : null}
  </>
}

export default function FluidScene(props: Props) {
  return <Canvas dpr={[1,props.compact?1:1.4]} frameloop={props.paused?'demand':'always'} camera={{position:[0,.12,7.4],fov:44}} gl={{alpha:true,antialias:false,powerPreference:'low-power'}}>
    <FluidWorld {...props} />
  </Canvas>
}
