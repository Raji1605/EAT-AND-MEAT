import { STORE_REVIEWS } from '../storeTrust'

const AVATAR_COLORS = [
  'bg-primary/10 text-primary',
  'bg-secondary/15 text-secondary',
  'bg-green-50 text-green-700',
  'bg-blue-50 text-blue-700',
]

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="material-symbols-outlined text-sm text-secondary"
          style={i <= rating ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          star
        </span>
      ))}
    </div>
  )
}

export default function ReviewsList() {
  const avg = (STORE_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / STORE_REVIEWS.length).toFixed(1)

  return (
    <div className="bg-white rounded-2xl p-lg border border-surface-container shadow-sm">
      <div className="flex items-center justify-between mb-md">
        <h4 className="font-headline-sm text-headline-sm text-on-surface">Reviews &amp; ratings</h4>
        <div className="flex items-center gap-1.5 bg-green-50 text-green-700 font-label-md font-bold px-2.5 py-1 rounded-md">
          <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          {avg}
        </div>
      </div>

      <div className="space-y-2.5">
        {STORE_REVIEWS.map((r, i) => (
          <div
            key={i}
            className="fade-slide-in bg-surface-container-low rounded-xl p-md border border-surface-container hover:border-primary/30 hover:shadow-sm transition-all duration-300"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-label-sm font-bold flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                {initials(r.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-md text-on-surface truncate">{r.name}</span>
                  <Stars rating={r.rating} />
                </div>
                <p className="text-on-surface-variant text-label-sm mt-0.5">{r.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-on-surface-variant/70 text-[11px] mt-md">
        Demo reviews shown for illustration — live customer reviews will replace these.
      </p>
    </div>
  )
}
