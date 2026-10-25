import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function ParticleTitle() {
  const heading=useRef<HTMLHeadingElement>(null)
  const canvas=useRef<HTMLCanvasElement>(null)
  const reduced=useReducedMotion()
  useEffect(()=>{
    const node=heading.current, surface=canvas.current
    if(!node||!surface||reduced)return
    const ctx=surface.getContext('2d');if(!ctx)return
    let particles:{x:number;y:number;ox:number;oy:number;color:string}[]=[]
    let visible=false,disposed=false
    const pointer={x:-999,y:-999}
    const reveal={value:0}
    const build=()=>{
      if(disposed)return
      const w=node.clientWidth,h=node.clientHeight,dpr=Math.min(devicePixelRatio,2)
      surface.width=w*dpr;surface.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)
      const mask=document.createElement('canvas');mask.width=w;mask.height=h
      const m=mask.getContext('2d');if(!m)return
      const style=getComputedStyle(node),size=parseFloat(style.fontSize),line=parseFloat(style.lineHeight)
      m.font=`500 ${size}px ${style.fontFamily}`;m.letterSpacing=style.letterSpacing;m.textBaseline='top';m.fillStyle='white'
      m.fillText('Hi, I\u2019m',0,0);m.fillText('William.',0,line)
      const pixels=m.getImageData(0,0,w,h).data;particles=[]
      const gap=w<350?5:4
      for(let y=0;y<h;y+=gap)for(let x=0;x<w;x+=gap)if(pixels[(y*w+x)*4+3]>100)particles.push({x:x+(Math.random()-.5)*100,y:y+(Math.random()-.5)*60,ox:x,oy:y,color:y>line?'#b7a2ff':'#edf7ff'})
      node.dataset.particles='ready'
    }
    const draw=()=>{
      if(!visible||document.hidden)return
      ctx.clearRect(0,0,node.clientWidth,node.clientHeight)
      for(const p of particles){
        const dx=p.x-pointer.x,dy=p.y-pointer.y,d=Math.hypot(dx,dy)
        const force=d<65?(1-d/65)*5:0
        p.x+=(p.ox-p.x)*.09+(d?dx/d*force:0);p.y+=(p.oy-p.y)*.09+(d?dy/d*force:0)
        ctx.globalAlpha=reveal.value*.85;ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,1.6,1.6)
      }
    }
    const move=(event:PointerEvent)=>{const r=node.getBoundingClientRect();pointer.x=event.clientX-r.left;pointer.y=event.clientY-r.top}
    const leave=()=>{pointer.x=-999;pointer.y=-999}
    const scatter=()=>{leave();for(const p of particles){p.x=p.ox+(Math.random()-.5)*170;p.y=p.oy+(Math.random()-.5)*130}}
    const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting});observer.observe(node)
    const resize=new ResizeObserver(build);resize.observe(node)
    void document.fonts.ready.then(build)
    const tween=gsap.to(reveal,{value:1,duration:1.8,ease:'power2.out'})
    gsap.ticker.add(draw);node.addEventListener('pointermove',move);node.addEventListener('pointerleave',leave);node.addEventListener('click',scatter)
    return ()=>{disposed=true;delete node.dataset.particles;gsap.ticker.remove(draw);tween.kill();observer.disconnect();resize.disconnect();node.removeEventListener('pointermove',move);node.removeEventListener('pointerleave',leave);node.removeEventListener('click',scatter)}
  },[reduced])
  const copy=<>Hi, I’m<br /><span>William<span className="hero-name-dot">.</span></span></>
  return <h1 ref={heading} className="particle-title" aria-label="Hi, I’m William." data-hero-reveal>{reduced?<span className="particle-title-copy">{copy}</span>:<button type="button" className="particle-title-copy" aria-label="Scatter title particles" title="Click or tap to scatter the particles">{copy}</button>}<canvas ref={canvas} aria-hidden="true" /></h1>
}
