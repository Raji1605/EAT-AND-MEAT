const STEPS = [
  { icon: 'agriculture', title: 'Sourced Fresh', desc: 'Chicken and raw spices sourced daily from trusted local farmers.' },
  { icon: 'blender', title: 'Cleaned & Ground', desc: 'Hand-cleaned chicken and stone-ground masalas, prepared in-house.' },
  { icon: 'inventory_2', title: 'Packed with Care', desc: 'Hygienically packed and sealed fresh, right before dispatch.' },
  { icon: 'volunteer_activism', title: 'Delivered by Women', desc: 'Every order is delivered to your door by our women delivery partners.' },
]

export default function OurProcess() {
  return (
    <section className="mt-xl px-margin-mobile">
      <div className="mb-md text-center">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Our Process</h3>
        <p className="text-on-surface-variant text-label-md">From farm to your doorstep</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className="relative bg-surface-container-low rounded-xl border border-surface-container p-md"
          >
            <span className="absolute top-2 right-3 text-on-surface-variant/30 font-headline-sm text-headline-sm">
              {i + 1}
            </span>
            <div className="w-11 h-11 rounded-full bg-primary-fixed flex items-center justify-center mb-2.5">
              <span className="material-symbols-outlined text-primary text-lg">{s.icon}</span>
            </div>
            <p className="font-label-md text-on-surface mb-1">{s.title}</p>
            <p className="text-on-surface-variant text-label-sm leading-snug">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
