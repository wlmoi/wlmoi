import type { ButtonHTMLAttributes } from 'react'
import { ArrowUpRight } from 'lucide-react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: 'solid' | 'ghost'
  icon?: boolean
}

/** Local shadcn/ui-style button primitive, kept dependency-light for a Vite static app. */
export function Button({ tone = 'solid', icon = false, className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
  const variants = tone === 'solid'
    ? 'bg-white text-[hsl(var(--background))] hover:bg-white/[0.9] hover:scale-[1.02]'
    : 'border border-white/[.15] bg-white/[.02] text-white hover:border-white/[.3] hover:bg-white/[.06]'

  return (
    <button {...props} className={`${base} ${variants} ${className}`}>
      <span>{children}</span>
      {icon ? <ArrowUpRight size={15} aria-hidden="true" /> : null}
    </button>
  )
}
