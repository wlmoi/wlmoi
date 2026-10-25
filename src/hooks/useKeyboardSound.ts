import { useCallback, useEffect, useRef, useState } from 'react'
import { scheduleKeyboardClick } from '../lib/keyboardAudio'

const preferenceKey = 'wa_keyboard_sound'

export function useKeyboardSound() {
  const [enabled, setEnabled] = useState(() => {
    try { return window.localStorage.getItem(preferenceKey) !== 'off' } catch { return true }
  })
  const enabledRef = useRef(enabled)
  const audio = useRef<{ context: AudioContext; volume: GainNode } | null>(null)

  useEffect(() => () => {
    const current = audio.current
    audio.current = null
    if (current) void current.context.close().catch(() => {})
  }, [])

  const play = useCallback((keyIndex: number) => {
    if (!enabledRef.current) return
    try {
      if (!audio.current) {
        const Constructor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (!Constructor) return
        const context = new Constructor()
        const volume = context.createGain()
        volume.gain.value = .35
        volume.connect(context.destination)
        audio.current = { context, volume }
      }
      const current = audio.current
      const schedule = () => {
        if (audio.current !== current || !enabledRef.current || current.context.state !== 'running') return
        scheduleKeyboardClick(current.context, current.volume, keyIndex)
      }
      if (current.context.state === 'suspended') void current.context.resume().then(schedule).catch(() => {})
      else schedule()
    } catch { /* Audio support must never block key interaction. */ }
  }, [])

  const toggle = () => {
    const next = !enabledRef.current
    enabledRef.current = next
    setEnabled(next)
    if (audio.current) audio.current.volume.gain.value = next ? .35 : 0
    try { window.localStorage.setItem(preferenceKey, next ? 'on' : 'off') } catch { /* Session control still works without storage. */ }
  }

  return { enabled, play, toggle }
}
