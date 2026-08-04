import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!email.trim()) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section className="mt-xl px-margin-mobile mb-md">
      <div className="bg-tertiary-container p-lg rounded-2xl text-on-tertiary-container relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container rounded-full opacity-20" />
        <h3 className="font-headline-sm text-headline-sm mb-base">Spicing up your Inbox?</h3>
        <p className="font-body-md mb-md opacity-90">
          Join 10,000+ home chefs and receive monthly recipes, heritage stories, and secret spice blends.
        </p>
        <div className="flex flex-col gap-sm">
          <input
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/60 focus:bg-white/20 outline-none"
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="bg-secondary-container text-on-secondary-container py-3 rounded-lg font-label-md hover:bg-secondary transition-colors"
          >
            {submitted ? 'SUBSCRIBED ✓' : 'SUBSCRIBE NOW'}
          </button>
        </div>
      </div>
    </section>
  )
}
