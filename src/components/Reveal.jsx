import { useEffect, useRef, useState } from 'react'

// Wraps children and fades/slides them in once they scroll into view.
// direction: 'up' (default) | 'left' | 'right'
export default function Reveal({ children, direction = 'up', delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const dirClass = direction === 'left' ? 'reveal-left' : direction === 'right' ? 'reveal-right' : ''

  return (
    <div
      ref={ref}
      className={`reveal ${dirClass} ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
