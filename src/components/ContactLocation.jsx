import { BUSINESS_INFO } from '../businessInfo'
import MapPreview from './MapPreview'

export default function ContactLocation() {
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    BUSINESS_INFO.address
  )}`

  return (
    <section className="mt-xl px-margin-mobile">
      <div className="mb-md text-center">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Contact &amp; Location</h3>
        <p className="text-on-surface-variant text-label-md">Visit us or reach out anytime</p>
      </div>

      <div className="max-w-container-max mx-auto flex flex-col md:flex-row gap-lg items-center md:items-stretch">
        <div className="w-full md:w-1/2 flex justify-center">
          <MapPreview />
        </div>

        <div className="w-full md:w-1/2 bg-white rounded-2xl border border-surface-container p-lg space-y-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-xl mt-0.5">location_on</span>
            <div>
              <p className="font-label-md text-on-surface">Store Address</p>
              <p className="text-on-surface-variant text-label-sm">{BUSINESS_INFO.address}</p>
              <a
                href={mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-label-sm font-label-sm hover:underline"
              >
                Get Directions
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-xl mt-0.5">schedule</span>
            <div>
              <p className="font-label-md text-on-surface">Store Hours</p>
              <p className="text-on-surface-variant text-label-sm">{BUSINESS_INFO.hours}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-xl mt-0.5">call</span>
            <div>
              <p className="font-label-md text-on-surface">Call Us</p>
              <a href={`tel:${BUSINESS_INFO.phone.replace(/\s/g, '')}`} className="text-on-surface-variant text-label-sm hover:text-primary">
                {BUSINESS_INFO.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-xl mt-0.5">chat</span>
            <div>
              <p className="font-label-md text-on-surface">WhatsApp</p>
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="text-on-surface-variant text-label-sm hover:text-primary"
              >
                Chat with us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
