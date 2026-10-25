/** Short, locally synthesized mechanical switch sound; no audio files or network requests. */
export function scheduleKeyboardClick(context: BaseAudioContext, output: AudioNode, keyIndex = 0) {
  const start = context.currentTime
  const variation = (keyIndex % 5) * .035
  const noise = context.createBuffer(1, Math.ceil(context.sampleRate * .035), context.sampleRate)
  const samples = noise.getChannelData(0)
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1

  const click = (at: number, level: number, frequency: number) => {
    const source = context.createBufferSource()
    source.buffer = noise
    const filter = context.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = frequency
    filter.Q.value = .8
    const envelope = context.createGain()
    envelope.gain.setValueAtTime(level, at)
    envelope.gain.exponentialRampToValueAtTime(.0001, at + .028)
    source.connect(filter).connect(envelope).connect(output)
    source.onended = () => { source.disconnect(); filter.disconnect(); envelope.disconnect() }
    source.start(at)
    source.stop(at + .035)
  }

  click(start, .5, 2100 * (1 + variation))
  click(start + .042, .18, 3100 * (1 + variation))
  const body = context.createOscillator()
  body.type = 'triangle'
  body.frequency.setValueAtTime(185 * (1 + variation), start)
  body.frequency.exponentialRampToValueAtTime(75, start + .035)
  const envelope = context.createGain()
  envelope.gain.setValueAtTime(.0001, start)
  envelope.gain.exponentialRampToValueAtTime(.25, start + .002)
  envelope.gain.exponentialRampToValueAtTime(.0001, start + .045)
  body.connect(envelope).connect(output)
  body.onended = () => { body.disconnect(); envelope.disconnect() }
  body.start(start)
  body.stop(start + .05)
}
