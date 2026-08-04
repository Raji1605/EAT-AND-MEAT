import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { products, getFreshnessInfo } from '../data'
import { getStock } from '../inventory'
import { FEATURED_COUPON } from '../coupons'
import { flyToCart } from '../utils/flyToCart'

export default function ProductDetail({ cartCount, addToCart }) {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)
  const [copied, setCopied] = useState(false)

  const item = products.find((p) => p.id === productId)

  if (!item) {
    return (
      <div className="bg-gradient-to-b from-primary-fixed/25 via-surface to-surface text-on-surface min-h-screen">
        <Header cartCount={cartCount} onMenuClick={() => navigate('/shop')} onCartClick={() => navigate('/cart')} />
        <main className="pt-20 px-margin-mobile text-center">
          <p className="text-on-surface-variant mb-md">We couldn't find that product.</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-lg py-3 rounded-lg bg-primary text-on-primary font-label-md"
          >
            Back to Shop
          </button>
        </main>

      </div>
    )
  }

  const freshness = getFreshnessInfo(item)
  const stock = getStock(item.id)
  const outOfStock = stock <= 0

  const handleAddToCart = (e) => {
    if (outOfStock) return
    flyToCart(item.image, e.currentTarget)
    addToCart(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleCopyCoupon = () => {
    navigator.clipboard?.writeText(FEATURED_COUPON.code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="bg-gradient-to-b from-primary-fixed/25 via-surface to-surface text-on-surface font-body-md overflow-x-hidden min-h-screen">
      <Header cartCount={cartCount} onMenuClick={() => navigate('/shop')} onCartClick={() => navigate('/cart')} />

      <main className="pt-20 pb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-primary font-label-md m-margin-mobile mb-0 hover:underline"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back
        </button>

        {/* Large image */}
        <div className="relative mx-margin-mobile mt-md rounded-2xl overflow-hidden border border-surface-container aspect-square max-w-md">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${item.image}')` }}
          />
          {item.freshness && (
            <span className="absolute top-3 left-3 bg-secondary text-on-secondary text-xs font-bold px-2.5 py-1 rounded">
              {item.freshness}
            </span>
          )}
          {item.tag && (
            <span className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded">
              {item.tag}
            </span>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-error text-xs font-bold px-3 py-1.5 rounded">OUT OF STOCK</span>
            </div>
          )}
        </div>

        <div className="px-margin-mobile mt-lg max-w-2xl">
          <div className="flex items-start justify-between gap-3 mb-xs">
            <h1 className="font-headline-md text-headline-md text-on-surface">{item.name}</h1>
            <span className="font-headline-sm text-headline-sm text-primary flex-shrink-0">₹{item.price}</span>
          </div>
          {item.weight && <p className="text-on-surface-variant font-label-md mb-md">{item.weight}</p>}

          {item.rating && (
            <div className="flex items-center gap-1 mb-md">
              <span
                className="material-symbols-outlined text-sm text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="text-label-sm text-on-surface-variant">
                {item.rating} ({item.reviews} Reviews)
              </span>
            </div>
          )}

          {/* Full description */}
          <p className="text-on-surface font-body-md mb-lg leading-relaxed">
            {item.fullDescription || item.description}
          </p>

          {/* Offer / coupon code */}
          <div className="bg-secondary-container/15 border border-dashed border-secondary rounded-xl p-md flex items-center gap-3 mb-lg">
            <span className="material-symbols-outlined text-secondary">sell</span>
            <div className="flex-1 min-w-0">
              <p className="font-label-md text-on-surface">{FEATURED_COUPON.description}</p>
              <p className="text-on-surface-variant text-label-sm">Applied at checkout — demo mode accepts any code</p>
            </div>
            <button
              onClick={handleCopyCoupon}
              className="flex-shrink-0 text-xs font-bold border border-secondary text-secondary px-2.5 py-1.5 rounded-lg hover:bg-secondary hover:text-on-secondary transition-colors"
            >
              {copied ? 'Copied!' : FEATURED_COUPON.code}
            </button>
          </div>

          {/* Nutrition — chicken only */}
          {item.category === 'chicken' && item.nutrition && (
            <div className="mb-lg">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Nutrition (per 100g)</h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  ['Calories', item.nutrition.calories, ''],
                  ['Protein', item.nutrition.protein, 'g'],
                  ['Fat', item.nutrition.fat, 'g'],
                  ['Carbs', item.nutrition.carbs, 'g'],
                ].map(([label, value, unit]) => (
                  <div
                    key={label}
                    className="bg-surface-container-low rounded-xl p-sm text-center border border-surface-container"
                  >
                    <p className="font-headline-sm text-on-surface text-lg">
                      {value}
                      <span className="text-xs">{unit}</span>
                    </p>
                    <p className="text-on-surface-variant text-[11px]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Packed / expiry info */}
          <div className="bg-surface-container-low rounded-xl p-md mb-lg text-label-sm text-on-surface-variant space-y-1.5">
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">inventory_2</span>
              Packed on: {freshness.packedOn}
            </p>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">event_busy</span>
              {item.category === 'chicken' ? 'Use by' : 'Best before'}: {freshness.expiryOn}
            </p>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">schedule</span>
              {freshness.shelfLife}
            </p>
          </div>

          {item.includes && (
            <div className="mb-lg">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">This kit includes</h3>
              <ul className="list-disc list-inside text-on-surface-variant text-label-md space-y-1">
                {item.includes.map((inc) => (
                  <li key={inc}>{inc}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-label-md shadow-lg active:scale-95 transition-all ${
              outOfStock
                ? 'bg-surface-container text-on-surface-variant/50 cursor-not-allowed'
                : added
                ? 'bg-green-600 text-white'
                : 'bg-primary text-on-primary'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {outOfStock ? 'block' : added ? 'check' : 'add_shopping_cart'}
            </span>
            {outOfStock ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </main>


    </div>
  )
}
