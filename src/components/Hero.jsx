import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HEADLINE = 'Fresh Chicken & Authentic Indian Masalas'
const FLOATING_SPICES = [
  { icon: '🌶️', top: '12%', left: '8%', delay: '0s' },
  { icon: '🍃', top: '22%', left: '85%', delay: '1.2s' },
  { icon: '🫙', top: '65%', left: '90%', delay: '0.6s' },
  { icon: '🌿', top: '75%', left: '5%', delay: '1.8s' },
]

export default function Hero() {
  const navigate = useNavigate()
  const [typed, setTyped] = useState('')

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i += 1
      setTyped(HEADLINE.slice(0, i))
      if (i >= HEADLINE.length) clearInterval(interval)
    }, 35)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative w-full aspect-[4/5] md:aspect-[21/9] flex items-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="bg-cover bg-center w-full h-full transform scale-105 hover:scale-100 transition-transform duration-[2000ms]"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2A70PYm6yssjkI5liAw8_iHW6vxzS9lHLc9Rx6rNJUDC2bnkiIA_SKWn0mePnAf3U5IfaRDo5x_cESBm6tQjRiHmiDVFKLxpD5ceCRPI_5AEojfZ66HFTzBPJJR88RxkMvEbdrLwxkTlOsNbcjiD_4FT7YYOvc2P2XhiYcVhsP2KH_T5zg-lGHuEIwjkSSAek4CYq4oAy0tSsQBLwMtq7jM9H_O4AT4jfhF7APc0_xx1r4OVkoG_ESA')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Floating spice decorations */}
        {FLOATING_SPICES.map((s, i) => (
          <span
            key={i}
            className="float-spice absolute text-3xl md:text-4xl drop-shadow-lg select-none pointer-events-none opacity-80"
            style={{ top: s.top, left: s.left, animationDelay: s.delay }}
          >
            {s.icon}
          </span>
        ))}
      </div>
      <div className="relative z-10 px-margin-mobile pb-lg w-full max-w-container-max mx-auto">
        <span className="inline-block px-3 py-1 mb-base bg-secondary-container text-on-secondary-container font-label-sm text-label-sm rounded-full tracking-widest uppercase">
          Est. 1948
        </span>
        <h2 className="font-display-lg-mobile text-display-lg-mobile md:text-display-lg text-white mb-sm max-w-md min-h-[1.2em]">
          {typed}
          <span className="typing-caret border-r-2 border-white ml-0.5" aria-hidden="true" />
        </h2>
        <p className="text-white/80 text-body-lg mb-md max-w-sm">
          Farm-fresh chicken and hand-ground spices, sourced with care and delivered with trust.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="cta-glow bg-primary text-on-primary px-lg py-4 rounded-lg font-label-md text-label-md shadow-lg active:scale-95 transition-transform hover:brightness-110"
        >
          EXPLORE COLLECTION
        </button>
      </div>
    </section>
  )
}
