const TRUST_ITEMS = [
  { icon: 'verified', label: 'FSSAI Certified' },
  { icon: 'nutrition', label: 'Freshly Cut Daily' },
  { icon: 'eco', label: 'No Preservatives' },
]

export default function TrustBanner() {
  return (
    <div className="bg-surface-container-low border-y border-surface-container">
      <div className="max-w-container-max mx-auto px-margin-mobile py-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between gap-4 min-w-max md:min-w-0 md:justify-center md:gap-10">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-lg">{item.icon}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
