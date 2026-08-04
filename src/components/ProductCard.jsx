import { useNavigate } from 'react-router-dom'
import { getFreshnessInfo } from '../data'
import { getStock } from '../inventory'
import { flyToCart } from '../utils/flyToCart'
import { useProductModal } from '../context/ProductModalContext'

// Shared product card used by PopularBlends, FreshChicken, TodaysCombo, CategoryPage.
// Three visual variants:
// variant="scroll"   -> horizontal rail card with rating + Add to Cart (used inside category pages / combos)
// variant="grid"      -> compact grid card with tag badge + Add to Cart (used inside category pages)
// variant="showcase"  -> big image + description, click -> opens product / goes to category page.
//                        showCartButton=false hides Add to Cart (used on the homepage preview strips);
//                        fullWidth + showCartButton=true is used on category pages for the same card size.

export default function ProductCard({ item, onAddToCart, variant = 'scroll', fullWidth = false, showCartButton = true }) {
  const navigate = useNavigate()
  const { openProduct } = useProductModal()
  const freshness = getFreshnessInfo(item)
  const stock = getStock(item.id)
  const outOfStock = stock <= 0

  const handleAddToCart = (e) => {
    e.stopPropagation()
    if (outOfStock) return
    flyToCart(item.image, e.currentTarget)
    onAddToCart && onAddToCart(item)
  }

  if (variant === 'showcase') {
    return (
      <div
        onClick={() => openProduct(item.id)}
        className={`${fullWidth ? 'w-full' : 'flex-shrink-0 w-72'} bg-surface rounded-xl shadow-[0_4px_12px_rgba(121,85,72,0.08)] overflow-hidden border border-surface-container cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(121,85,72,0.18)]`}
      >
        <div className="relative">
          <div
            className="bg-cover bg-center h-56 w-full group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url('${item.image}')` }}
          />
          {item.freshness && (
            <span className="absolute top-2 left-2 bg-secondary text-on-secondary text-[10px] font-bold px-2 py-1 rounded">
              {item.freshness}
            </span>
          )}
        </div>
        <div className="p-md">
          <div className="flex justify-between items-start mb-xs">
            <h4 className="font-label-md text-label-md text-on-surface">{item.name}</h4>
            <span className="text-primary font-bold">₹{item.price}</span>
          </div>
          {item.description && (
            <p className="text-on-surface-variant text-label-sm mb-sm line-clamp-2">{item.description}</p>
          )}
          {showCartButton && (
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`w-full py-2 rounded-lg font-label-sm transition-all active:scale-95 ${
                outOfStock
                  ? 'border border-outline text-on-surface-variant/50 cursor-not-allowed'
                  : 'border border-primary text-primary hover:bg-primary hover:text-on-primary'
              }`}
            >
              {outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    )
  }

  if (variant === 'grid') {
    return (
      <div className="bg-white p-sm rounded-xl shadow-sm border border-surface-container group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(121,85,72,0.16)]">
        <div
          onClick={() => openProduct(item.id)}
          className="relative aspect-[4/3] mb-sm rounded-lg overflow-hidden cursor-pointer"
        >
          <div
            className="bg-cover bg-center w-full h-full group-hover:scale-110 transition-transform duration-500"
            style={{ backgroundImage: `url('${item.image}')` }}
          />
          {item.isNew && (
            <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded">
              NEW
            </span>
          )}
          {item.freshness && (
            <span className="absolute top-2 left-2 bg-secondary text-on-secondary text-[10px] font-bold px-2 py-1 rounded">
              {item.freshness}
            </span>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-error text-[10px] font-bold px-2 py-1 rounded">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>
        <h5
          onClick={() => openProduct(item.id)}
          className="font-label-md text-label-md text-on-surface truncate cursor-pointer hover:text-primary"
        >
          {item.name}
        </h5>
        {item.weight && (
          <p className="text-on-surface-variant text-label-sm mb-0.5">{item.weight}</p>
        )}
        <p className="text-primary font-bold text-label-sm mb-xs">₹{item.price}</p>
        {item.description && (
          <p className="text-on-surface-variant text-[11px] leading-snug mb-1.5 line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="flex flex-col gap-0.5 mb-2 text-[10px] text-on-surface-variant/80">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">inventory_2</span>
            Packed: {freshness.packedOn}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">event_busy</span>
            {item.category === 'chicken' ? 'Use by' : 'Best before'}: {freshness.expiryOn}
          </span>
        </div>
        {item.tag && (
          <div className="flex gap-1 mb-2">
            <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] rounded-full font-bold">
              {item.tag}
            </span>
          </div>
        )}
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={`w-full py-1.5 rounded-lg font-label-sm text-xs flex items-center justify-center gap-1 transition-all active:scale-95 ${
            outOfStock
              ? 'border border-outline text-on-surface-variant/50 cursor-not-allowed'
              : 'border border-primary text-primary hover:bg-primary hover:text-on-primary'
          }`}
        >
          <span className="material-symbols-outlined text-sm">
            {outOfStock ? 'block' : 'add_shopping_cart'}
          </span>
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    )
  }

  // default: "scroll" variant
  return (
    <div className="flex-shrink-0 w-64 bg-surface rounded-xl shadow-[0_4px_12px_rgba(121,85,72,0.08)] overflow-hidden border border-surface-container transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(121,85,72,0.18)] group">
      <div onClick={() => openProduct(item.id)} className="relative cursor-pointer overflow-hidden">
        <div
          className="bg-cover bg-center h-48 w-full group-hover:scale-110 transition-transform duration-500"
          style={{ backgroundImage: `url('${item.image}')` }}
        />
        {item.freshness && (
          <span className="absolute top-2 left-2 bg-secondary text-on-secondary text-[10px] font-bold px-2 py-1 rounded leading-none">
            {item.freshness}
          </span>
        )}
        {item.tag === 'COMBO' && (
          <span className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded leading-none">
            COMBO
          </span>
        )}
      </div>
      <div className="p-md">
        <div className="flex justify-between items-start mb-xs">
          <h4
            onClick={() => openProduct(item.id)}
            className="font-label-md text-label-md text-on-surface cursor-pointer hover:text-primary"
          >
            {item.name}
          </h4>
          <span className="text-primary font-bold">₹{item.price}</span>
        </div>

        {item.weight && (
          <p className="text-on-surface-variant text-label-sm mb-xs">{item.weight}</p>
        )}

        {item.includes && (
          <p className="text-on-surface-variant text-label-sm mb-md line-clamp-2">
            Includes: {item.includes.join(', ')}
          </p>
        )}

        {item.rating && (
          <div className="flex items-center gap-1 mb-md">
            <span
              className="material-symbols-outlined filled text-sm text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="text-label-sm text-on-surface-variant">
              {item.rating} ({item.reviews} Reviews)
            </span>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={`w-full py-2 rounded-lg font-label-sm transition-all active:scale-95 ${
            outOfStock
              ? 'border border-outline text-on-surface-variant/50 cursor-not-allowed'
              : 'border border-primary text-primary hover:bg-primary hover:text-on-primary'
          }`}
        >
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
