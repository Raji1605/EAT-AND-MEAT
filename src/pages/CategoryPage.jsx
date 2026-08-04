import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import { products, categories } from '../data'

// Generic category page — works for masala, chicken, and any future
// category (fish, mutton, eggs, seafood, vegetables) with zero new code.
export default function CategoryPage({ cartCount, addToCart }) {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const categoryMeta = categories.find((c) => c.id === categoryId)
  const categoryItems = products.filter((p) => p.category === categoryId)
  const items = query.trim()
    ? categoryItems.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    : categoryItems

  return (
    <div className="bg-gradient-to-b from-primary-fixed/25 via-surface to-surface text-on-surface font-body-md overflow-x-hidden min-h-screen">
      <Header
        cartCount={cartCount}
        onMenuClick={() => navigate('/')}
        onCartClick={() => navigate('/cart')}
      />

      <main className="pt-20 pb-10 px-margin-mobile">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-primary font-label-md mb-md hover:underline"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Home
        </button>

        <div className="mb-md">
          <h1 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
            {categoryMeta && <span>{categoryMeta.icon}</span>}
            {categoryMeta ? categoryMeta.label : 'Products'}
          </h1>
          <p className="text-on-surface-variant font-body-md mt-xs">
            {items.length} product{items.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Search within this category */}
        <div className="mb-lg relative max-w-md">
          <span className="material-symbols-outlined text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2 text-lg">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${categoryMeta ? categoryMeta.label.toLowerCase() : 'products'}...`}
            className="w-full bg-white border border-outline-variant rounded-lg pl-10 pr-9 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface font-body-md"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-on-surface-variant">
            {query
              ? `No products found for "${query}" in this category.`
              : 'No products found in this category yet.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {items.map((item) => (
              <ProductCard key={item.id} item={item} onAddToCart={addToCart} variant="showcase" fullWidth />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
