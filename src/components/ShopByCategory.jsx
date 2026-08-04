import { useNavigate } from 'react-router-dom'
import { categories } from '../data'

// Compact icon-based category tiles (original layout, restored).
export default function ShopByCategory() {
  const navigate = useNavigate()

  return (
    <section className="mt-lg px-margin-mobile">
      <div className="mb-md">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Shop by Category</h3>
        <p className="text-on-surface-variant text-label-md">Find exactly what you're craving</p>
      </div>
      <div className="grid grid-cols-2 gap-gutter">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/category/${cat.id}`)}
            className="flex items-center gap-3 bg-surface-container-low border border-surface-container rounded-xl p-md hover:border-primary hover:shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">{cat.icon}</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface text-left">{cat.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
