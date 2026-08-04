import { BUSINESS_INFO } from '../businessInfo'

// Real embedded Google Map (no API key needed for the basic /maps?output=embed
// form) so customers see the actual street layout, not a stylized placeholder.
export default function MapPreview() {
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    BUSINESS_INFO.address
  )}`
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    BUSINESS_INFO.address
  )}&output=embed`

  return (
    <div className="w-full max-w-md rounded-2xl overflow-hidden border border-surface-container shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white">
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <iframe
          title="Store location map"
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <span className="absolute bottom-2 right-2 bg-white/90 text-on-surface-variant text-[10px] px-2 py-1 rounded font-label-sm shadow-sm">
          Live Google Map
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-surface-container">
        <div className="min-w-0">
          <p className="font-label-md text-[13px] text-on-surface font-semibold leading-tight truncate">
            {BUSINESS_INFO.name}
          </p>
          <p className="text-on-surface-variant text-[11px] leading-tight mt-0.5 truncate">
            {BUSINESS_INFO.address}
          </p>
        </div>
        <a
          href={mapsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-primary text-white px-3 py-2 rounded-lg font-label-sm text-[12px] whitespace-nowrap hover:bg-primary/90 active:scale-[0.97] transition-all duration-200"
        >
          <span className="material-symbols-outlined text-sm">directions</span>
          Directions
        </a>
      </div>
    </div>
  )
}
