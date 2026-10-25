import { useCallback, useEffect, useRef, useState } from 'react'
import { scheduleKeyboardClick } from '../lib/keyboardAudio'
const preferenceKey='wa_keyboard_sound'
function startVoice(voice:HTMLAudioElement,volume:number,index:number,onFailure:()=>void){voice.currentTime=0;voice.volume=volume;voice.playbackRate=.97+(index%5)*.015;void voice.play().catch(onFailure)}
export function useKeyboardSound(){
 const [enabled,setEnabled]=useState(()=>{try{return localStorage.getItem(preferenceKey)!=='off'}catch{return true}})
 const [volume,setVolumeState]=useState(()=>{try{const value=Number(localStorage.getItem('wa_keyboard_volume')??.75);return Number.isFinite(value)?Math.max(.1,Math.min(1,value)):.75}catch{return .75}})
 const state=useRef({enabled,volume})
 const voices=useRef<HTMLAudioElement[]>([])
 const fallback=useRef<AudioContext|null>(null)
 useEffect(()=>()=>{voices.current.forEach(v=>{v.pause();v.removeAttribute('src');v.load()});voices.current=[];void fallback.current?.close().catch(()=>{})},[])
 const play=useCallback((keyIndex:number)=>{
  if(!state.current.enabled)return
  const synth=()=>{try{const context=fallback.current??new AudioContext();fallback.current=context;const gain=context.createGain();gain.gain.value=state.current.volume;gain.connect(context.destination);const run=()=>{if(state.current.enabled)scheduleKeyboardClick(context,gain,keyIndex);setTimeout(()=>gain.disconnect(),250)};void context.resume().then(run).catch(()=>gain.disconnect())}catch{/* Silent fallback on unsupported devices. */}}
  try{
   let voice=voices.current.find(v=>v.paused||v.ended)
   if(!voice){if(voices.current.length<6){voice=new Audio('/audio/mechanical-key.wav');voice.preload='auto';voices.current.push(voice)}else voice=voices.current[0]}
   startVoice(voice,state.current.volume,keyIndex,synth)
  }catch{synth()}
 },[])
 const toggle=()=>{const next=!state.current.enabled;state.current.enabled=next;setEnabled(next);if(!next)voices.current.forEach(v=>v.pause());try{localStorage.setItem(preferenceKey,next?'on':'off')}catch{/* Session preference remains available. */}}
 const setVolume=(value:number)=>{state.current.volume=value;setVolumeState(value);voices.current.forEach(v=>{v.volume=value});try{localStorage.setItem('wa_keyboard_volume',String(value))}catch{/* Session preference remains available. */}}
 const preview=()=>{state.current.enabled=true;setEnabled(true);try{localStorage.setItem(preferenceKey,'on')}catch{/* Optional persistence. */}play(0)}
 return {enabled,volume,setVolume,play,toggle,preview}
}
