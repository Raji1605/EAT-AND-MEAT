import { BUSINESS_INFO } from '../businessInfo'
import { SAMPLE_LAB_REPORT } from '../storeTrust'

const ITEMS = [
  {
    icon: 'verified',
    color: 'green',
    title: 'FSSAI License',
    desc: `Lic. No. ${BUSINESS_INFO.fssai}`,
  },
  {
    icon: 'science',
    color: 'primary',
    title: 'Lab Reports',
    desc: SAMPLE_LAB_REPORT.summary,
    action: { label: 'View PDF', icon: 'picture_as_pdf' },
  },
  {
    icon: 'workspace_premium',
    color: 'secondary',
    title: 'Quality Certificates',
    desc: 'Certified for hygiene and food-safety standards.',
  },
  {
    icon: 'inventory_2',
    color: 'green',
    title: 'Safe Packaging',
    desc: 'Sealed, tamper-proof packing for every order.',
  },
]

const COLOR_CLASSES = {
  green: { bg: 'bg-green-50', text: 'text-green-600' },
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  secondary: { bg: 'bg-secondary/10', text: 'text-secondary' },
}

export default function QualityHygiene() {
  return (
    <section className="mt-xl px-margin-mobile">
      <div className="mb-md text-center">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Quality &amp; Hygiene</h3>
        <p className="text-on-surface-variant text-label-md">Verified, certified, and safely packed</p>
      </div>
      <div className="grid grid-cols-2 gap-gutter max-w-container-max mx-auto">
        {ITEMS.map((item) => {
          const c = COLOR_CLASSES[item.color]
          return (
            <div
              key={item.title}
              className="bg-white rounded-xl p-md border border-surface-container hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className={`w-11 h-11 rounded-full ${c.bg} flex items-center justify-center mb-2.5`}>
                <span className={`material-symbols-outlined ${c.text} text-xl`}>{item.icon}</span>
              </div>
              <p className="font-label-md text-on-surface mb-0.5">{item.title}</p>
              <p className="text-on-surface-variant text-label-sm leading-snug mb-2">{item.desc}</p>
              {item.action && (
                <button className={`flex items-center gap-1 text-label-sm font-label-sm ${c.text} hover:underline`}>
                  <span className="material-symbols-outlined text-sm">{item.action.icon}</span>
                  {item.action.label}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
