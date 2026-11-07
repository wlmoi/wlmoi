import { Component, Suspense, lazy, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Hand, Layers } from 'lucide-react'
import { useIntersection } from '../../hooks/useIntersection'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { layerLabels } from './parts'
import type { LayerId } from './parts'

const ChipScene = lazy(() => import('./ChipScene'))

export function webglSupported() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch { return false }
}

export function StaticChip({ label = 'Illustration of a layered semiconductor package' }: { label?: string }) {
  return (
    <div className="xh-static-chip" role="img" aria-label={label}>
      <i className="l4" /><i className="l3" /><i className="l2" /><i className="l1" />
    </div>
  )
}

class Boundary extends Component<{ children: ReactNode, fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

export function HeroChip() {
  const reducedMotion = useReducedMotion()
  const { ref, visible } = useIntersection<HTMLDivElement>({ threshold: 0.05 })
  const [canRender] = useState(webglSupported)
  const [exploded, setExploded] = useState(false)
  const [layer, setLayer] = useState<LayerId | null>(null)
  const [touched, setTouched] = useState(false)
  const [compact, setCompact] = useState(() => window.innerWidth < 760)
  useEffect(() => {
    const onResize = () => setCompact(window.innerWidth < 760)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const active = layerLabels.find((item) => item.id === layer)

  return (
    <div ref={ref} className="xh-chip-stage" data-exploded={exploded}>
      <div className="xh-chip-canvas" aria-label="Interactive 3D semiconductor package. Drag to rotate." role="group">
        {canRender ? (
          <Boundary fallback={<StaticChip />}>
            <Suspense fallback={<StaticChip />}>
              <ChipScene explode={exploded ? 1 : 0} highlight={layer} paused={!visible} still={reducedMotion} compact={compact} onInteract={() => setTouched(true)} />
            </Suspense>
          </Boundary>
        ) : <StaticChip />}
        {!touched && canRender ? <span className="xh-drag-hint" aria-hidden="true"><Hand size={14} /> Drag to rotate</span> : null}
      </div>
      <div className="xh-chip-controls">
        <button type="button" className="xh-toggle" aria-pressed={exploded} onClick={() => { setExploded((value) => !value); if (exploded) setLayer(null) }}>
          <Layers size={15} aria-hidden="true" /> {exploded ? 'Assemble the package' : 'Explode the layers'}
        </button>
        <div className={`xh-layers ${exploded ? 'is-open' : ''}`} role="group" aria-label="Package layers">
          {layerLabels.map((item) => (
            <button key={item.id} type="button" disabled={!exploded} aria-pressed={layer === item.id}
              onPointerEnter={() => exploded && setLayer(item.id)} onPointerLeave={() => setLayer(null)}
              onFocus={() => setLayer(item.id)} onBlur={() => setLayer(null)}>
              {item.label}
            </button>
          ))}
        </div>
        <p className="xh-layer-note" aria-live="polite">{exploded ? (active?.detail ?? 'Hover or focus a layer to light it up.') : ''}</p>
      </div>
    </div>
  )
}
