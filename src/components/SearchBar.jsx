import { useState } from 'react'
import { searchProducts } from '../data'
import { useProductModal } from '../context/ProductModalContext'

// Search stays non-destructive: results appear as a dropdown under the bar,
// the rest of the homepage (all sections) stays visible underneath at all times.
// Tapping a result opens the same Add to Cart quick-view sheet used everywhere
// else in the app, so it works reliably on touch devices.
export default function SearchBar({ value, onChange }) {
  const [focused, setFocused] = useState(false)
  const { openProduct } = useProductModal()

  const results = searchProducts(value)
  const showDropdown = focused && value.trim().length > 0

  const handleSelect = (item) => {
    openProduct(item.id)
  }

  return (
    <section className="px-margin-mobile -mt-8 relative z-20">
      <div className="max-w-xl mx-auto relative">
        <div
          className={`bg-surface p-base rounded-xl shadow-lg border flex items-center gap-3 transition-all ${
            focused ? 'ring-2 ring-primary/20 border-primary' : 'border-outline-variant'
          }`}
        >
          <span className="material-symbols-outlined text-on-surface-variant ml-2">search</span>
          <input
            className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-body-md py-2 outline-none"
            placeholder="Search for masalas, chicken, combos..."
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
          />
          <button className="bg-surface-container-low p-2 rounded-lg text-primary">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-xl shadow-lg border border-outline-variant max-h-96 overflow-y-auto z-30">
            {results.length === 0 ? (
              <p className="p-md text-on-surface-variant text-label-md">
                No products found for "{value}"
              </p>
            ) : (
              results.map((item) => (
                <button
                  key={item.id}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleSelect(item)
                  }}
                  className="w-full flex items-center gap-3 p-sm hover:bg-surface-container-low transition-colors border-b border-surface-container last:border-b-0 text-left"
                >
                  <div
                    className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-label-md text-on-surface truncate">{item.name}</p>
                    <p className="text-on-surface-variant text-label-sm capitalize">{item.category}</p>
                  </div>
                  <span className="text-primary font-bold text-label-sm">₹{item.price}</span>
                  <span className="material-symbols-outlined text-on-surface-variant text-lg flex-shrink-0">
                    chevron_right
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  )
}
