import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export function ImageLightbox() {
  const [image, setImage] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const imageElement = target.closest<HTMLImageElement>('img[data-zoom-src]')
      if (!imageElement) return
      setImage({ src: imageElement.dataset.zoomSrc || imageElement.currentSrc, alt: imageElement.alt })
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setImage(null)
    }

    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('lightbox-open', Boolean(image))
    return () => document.body.classList.remove('lightbox-open')
  }, [image])

  if (!image) return null

  return (
    <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="Expanded image" onClick={() => setImage(null)}>
      <button type="button" className="image-lightbox-close" onClick={() => setImage(null)} aria-label="Close image viewer">
        <X size={20} aria-hidden="true" />
      </button>
      <img src={image.src} alt={image.alt} onClick={(event) => event.stopPropagation()} />
    </div>
  )
}
