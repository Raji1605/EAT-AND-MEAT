import { useNavigate } from 'react-router-dom'
import { chickenProducts } from '../data'
import ProductCard from './ProductCard'

// Homepage preview only — showcases chicken with image + description.
// Add to Cart lives inside the dedicated Chicken category page.
export default function FreshChicken({ onAddToCart }) {
  const navigate = useNavigate()

  return (
    <section id="chicken-section" className="mt-lg scroll-mt-20">
      <div className="flex justify-between items-end px-margin-mobile mb-md">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Best Selling Chicken</h3>
          <p className="text-on-surface-variant text-label-md">Cleaned and delivered fresh, daily</p>
        </div>
        <button
          onClick={() => navigate('/category/chicken')}
          className="text-primary font-label-md flex items-center gap-1 hover:underline"
        >
          View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
      <div className="flex overflow-x-auto no-scrollbar gap-gutter px-margin-mobile pb-sm">
        {chickenProducts.map((item) => (
          <ProductCard key={item.id} item={item} variant="showcase" showCartButton={false} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  )
}
