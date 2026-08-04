import { newArrivals } from '../data'
import ProductCard from './ProductCard'

export default function NewArrivals({ onAddToCart }) {
  return (
    <section className="mt-xl px-margin-mobile">
      <div className="mb-md">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">New Arrivals</h3>
        <p className="text-on-surface-variant text-label-md">Freshly ground and ready to ship</p>
      </div>
      <div className="grid grid-cols-2 gap-gutter">
        {newArrivals.map((item) => (
          <ProductCard key={item.id} item={item} onAddToCart={onAddToCart} variant="grid" />
        ))}
      </div>
    </section>
  )
}
