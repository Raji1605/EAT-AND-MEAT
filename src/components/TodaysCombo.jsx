import { comboProducts } from '../data'
import ProductCard from './ProductCard'

export default function TodaysCombo({ onAddToCart }) {
  return (
    <section className="mt-lg">
      <div className="flex justify-between items-end px-margin-mobile mb-md">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Today's Combo</h3>
          <p className="text-on-surface-variant text-label-md">Meat + masala, bundled for you</p>
        </div>
        <button className="text-primary font-label-md flex items-center gap-1 hover:underline">
          View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
      <div className="flex overflow-x-auto no-scrollbar gap-gutter px-margin-mobile pb-sm">
        {comboProducts.map((item) => (
          <ProductCard key={item.id} item={item} onAddToCart={onAddToCart} variant="scroll" />
        ))}
      </div>
    </section>
  )
}
