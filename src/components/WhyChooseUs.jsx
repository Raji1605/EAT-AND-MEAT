const REASONS = [
  { icon: 'nutrition', title: 'Farm Fresh, Daily', desc: 'Chicken cleaned and cut fresh every single morning — never frozen.' },
  { icon: 'grain', title: 'Stone-Ground Spices', desc: 'Traditional grinding keeps the natural oils and aroma intact.' },
  { icon: 'eco', title: 'No Preservatives', desc: '100% natural, chemical-free, exactly like home-made.' },
  { icon: 'local_shipping', title: 'Fast, Reliable Delivery', desc: 'Packed with care and delivered right to your doorstep.' },
]

export default function WhyChooseUs() {
  return (
    <section className="mt-xl px-margin-mobile">
      <div className="mb-md text-center">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Why Choose Us</h3>
        <p className="text-on-surface-variant text-label-md">What makes our kitchen different</p>
      </div>
      <div className="grid grid-cols-2 gap-gutter">
        {REASONS.map((r) => (
          <div
            key={r.title}
            className="bg-white rounded-xl border border-surface-container p-md text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-2.5">
              <span className="material-symbols-outlined text-primary text-xl">{r.icon}</span>
            </div>
            <p className="font-label-md text-on-surface mb-1">{r.title}</p>
            <p className="text-on-surface-variant text-label-sm leading-snug">{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
