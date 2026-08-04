import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Reveal from '../components/Reveal'
import MapPreview from '../components/MapPreview'
import QualitySafetyCard from '../components/QualitySafetyCard'
import ReviewsList from '../components/ReviewsList'
import { BUSINESS_INFO } from '../businessInfo'
import { STORE_REVIEWS } from '../storeTrust'

const VALUES = [
  {
    icon: 'verified',
    label: 'Authenticity',
    text: 'Using pure, unadulterated masalas in every blend.',
  },
  {
    icon: 'auto_stories',
    label: 'Tradition',
    text: 'Honoring recipes passed down through generations.',
  },
  {
    icon: 'eco',
    label: 'Quality',
    text: 'Sourcing the finest farm-fresh chicken daily.',
  },
  {
    icon: 'temp_preferences_custom',
    label: 'Flavor',
    text: 'Creating an unforgettable culinary experience.',
  },
]

const TEAM = [
  {
    name: BUSINESS_INFO.owner,
    role: 'Founder & Head Chef',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=faces',
  },
  {
    name: 'Lakshmi Narayanan',
    role: 'Quality Assurance Lead',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces',
  },
  {
    name: 'Suresh Babu',
    role: 'Head of Sourcing',
    img: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=300&h=300&fit=crop&crop=faces',
  },
]

export default function Shop({ cartCount }) {
  const navigate = useNavigate()
  const avg = (STORE_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / STORE_REVIEWS.length).toFixed(1)

  return (
    <div className="bg-surface text-on-surface font-body-md overflow-x-hidden min-h-screen">
      <Header cartCount={cartCount} onMenuClick={() => navigate('/')} onCartClick={() => navigate('/cart')} />

      <main className="pt-20 pb-10">
        {/* Store hero — Swiggy-style restaurant header */}
        <Reveal>
          <div className="mx-margin-mobile max-w-container-max lg:mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-[#8a0d0b] text-white shadow-lg relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_35%)]" />
            <div className="relative p-lg">
              <p className="font-label-sm text-white/70 tracking-wide uppercase text-[11px] mb-1">Our store</p>
              <h1 className="font-headline-md text-headline-md font-bold mb-1">{BUSINESS_INFO.name}</h1>
              <p className="text-white/80 font-body-sm mb-md">{BUSINESS_INFO.address}</p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 bg-white text-green-700 font-label-sm font-bold px-2.5 py-1 rounded-md shadow-sm">
                  <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  {avg}
                </span>
                <span className="flex items-center gap-1 bg-white/15 backdrop-blur-sm font-label-sm px-2.5 py-1 rounded-md border border-white/20">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  FSSAI verified
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="px-margin-mobile max-w-container-max mx-auto">
          {/* Our Story */}
          <Reveal className="mt-lg" delay={50}>
            <div className="bg-white rounded-2xl border border-surface-container p-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Our Story</h2>
              <div className="space-y-4 text-on-surface-variant font-body-md">
                <p>
                  What began as a deep-seated passion for authentic Indian spices and premium
                  quality poultry in a small family kitchen has grown into a beloved local
                  business. We believe the heart of every great meal lies in the integrity of
                  its ingredients.
                </p>
                <div className="flex items-start gap-3 p-md bg-surface-container-low rounded-xl border border-surface-container">
                  <span className="material-symbols-outlined text-primary text-3xl">restaurant_menu</span>
                  <div>
                    <p className="font-headline-sm text-headline-sm text-on-surface mb-1">
                      The Secret is in the Spice
                    </p>
                    <p>
                      Our masalas are stone-ground by a collective of local women artisans in
                      Coimbatore, following a recipe perfected for the modern kitchen without
                      losing its traditional soul.
                    </p>
                  </div>
                </div>
                <p>
                  From sourcing the finest whole spices to ensuring our chicken is always
                  farm-fresh, we're dedicated to bringing you a culinary experience that's as
                  honest as it is delicious.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Core Values */}
          <Reveal delay={75}>
            <div className="mt-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-md text-center">
                Core Values
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {VALUES.map((v) => (
                  <div
                    key={v.label}
                    className="bg-white p-md rounded-2xl border border-surface-container flex flex-col gap-2"
                  >
                    <span className="material-symbols-outlined text-primary text-3xl">{v.icon}</span>
                    <h3 className="font-label-md text-label-sm text-on-surface uppercase tracking-widest">
                      {v.label}
                    </h3>
                    <p className="text-label-sm text-on-surface-variant leading-tight">{v.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal className="mt-lg" delay={100}>
            <MapPreview />
          </Reveal>

          {/* Quality & Safety */}
          <Reveal delay={125}>
            <div className="mt-lg">
              <QualitySafetyCard />
            </div>
          </Reveal>

          {/* Leadership Team */}
          <Reveal delay={150}>
            <div className="mt-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-lg text-center">
                Leadership Team
              </h2>
              <div className="flex flex-col gap-lg max-w-md mx-auto">
                {TEAM.map((m) => (
                  <div key={m.name} className="flex flex-col items-center text-center group">
                    <div className="w-28 h-28 rounded-full overflow-hidden mb-3 border-4 border-surface-container-low transition-transform group-hover:scale-105">
                      <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">{m.name}</h4>
                    <p className="font-label-md text-label-sm text-primary">{m.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Reviews */}
          <Reveal delay={175}>
            <div className="mt-lg">
              <ReviewsList />
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal delay={200}>
            <div className="mt-lg mb-lg rounded-2xl bg-primary-container text-center px-lg py-xl">
              <h2 className="font-headline-md text-headline-md text-white mb-sm">Taste the Tradition</h2>
              <p className="text-white/85 font-body-md mb-md max-w-xs mx-auto">
                We're always looking for passionate food lovers to join our journey of spice
                and flavor.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-white text-primary font-label-md text-label-md px-8 py-3.5 rounded-full transition-transform active:scale-95 shadow-lg"
              >
                Shop Now
              </button>
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  )
}
