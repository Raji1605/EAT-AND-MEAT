import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getFreshnessInfo } from '../data'
import { BUSINESS_INFO } from '../businessInfo'

const CONFETTI_COLORS = ['#b5110e', '#e08a34', '#ffffff', '#755245', '#d93025']

export default function OrderSuccess() {
  const navigate = useNavigate()
  const { state } = useLocation()

  // A fixed burst of confetti pieces, randomized once per mount.
  const confetti = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 6 + Math.random() * 6,
      })),
    []
  )

  // If someone lands here directly without an order (e.g. refresh), bounce home.
  if (!state) {
    return (
      <div className="bg-gradient-to-b from-primary-fixed/25 via-surface to-surface text-on-surface min-h-screen">
        <Header cartCount={0} onMenuClick={() => navigate('/')} onCartClick={() => navigate('/cart')} />
        <main className="pt-20 px-margin-mobile text-center">
          <p className="text-on-surface-variant mb-md">No recent order found.</p>
          <button
            onClick={() => navigate('/')}
            className="px-lg py-3 rounded-lg bg-primary text-on-primary font-label-md"
          >
            Back to Home
          </button>
        </main>

      </div>
    )
  }

  const {
    orderId, subtotal, deliveryFee, discount, couponCode, total, method, name, phone, address,
    items = [], placedAt, zoneLabel,
  } = state
  const methodLabel = { cod: 'Cash on Delivery', upi: 'UPI', card: 'Credit / Debit Card' }[method] || method

  const placedDate = placedAt ? new Date(placedAt) : new Date()

  const formattedPlaced = placedDate.toLocaleString('en-IN', {
    day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
  })

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)

  const whatsappHelpLink = `https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hi, I need help with my order ${orderId}`
  )}`

  return (
    <div className="bg-gradient-to-b from-primary-fixed/25 via-surface to-surface text-on-surface min-h-screen">
      <Header cartCount={0} onMenuClick={() => navigate('/')} onCartClick={() => navigate('/cart')} />

      <main className="pt-20 pb-10 px-margin-mobile max-w-2xl mx-auto">
        {/* Success banner */}
        <div className="relative bg-gradient-to-br from-primary to-[#8f0d0a] rounded-2xl p-lg text-center text-white mb-lg shadow-lg overflow-hidden">
          {/* Confetti burst */}
          <div className="absolute inset-x-0 top-0 h-24 overflow-hidden pointer-events-none">
            {confetti.map((c) => (
              <span
                key={c.id}
                className="confetti-piece rounded-sm"
                style={{
                  left: `${c.left}%`,
                  width: c.size,
                  height: c.size,
                  backgroundColor: c.color,
                  animationDelay: `${c.delay}s`,
                }}
              />
            ))}
          </div>

          <div className="pop-in w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-md relative z-10">
            <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="check-draw"
              />
            </svg>
          </div>
          <h1 className="font-headline-md text-headline-md mb-xs relative z-10">Order Confirmed!</h1>
          <p className="text-white/85 font-body-md relative z-10">
            Thank you, {name}. We've received your order and are getting it ready.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 mt-md relative z-10">
            <span className="material-symbols-outlined text-base">tag</span>
            <span className="font-label-md">{orderId}</span>
          </div>
        </div>

        {/* Order + delivery details */}
        <div className="bg-surface-container-low rounded-xl p-lg border border-surface-container mb-lg">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Order Details</h3>
          <div className="space-y-3 text-label-md">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Order ID</span>
              <span className="text-on-surface font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Placed On</span>
              <span className="text-on-surface font-medium">{formattedPlaced}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Payment Method</span>
              <span className="text-on-surface font-medium">{methodLabel}</span>
            </div>
            {zoneLabel && (
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Delivery Zone</span>
                <span className="text-on-surface font-medium">{zoneLabel}</span>
              </div>
            )}
            {phone && (
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Contact</span>
                <span className="text-on-surface font-medium">{phone}</span>
              </div>
            )}
            {address && (
              <div className="flex justify-between gap-4">
                <span className="text-on-surface-variant flex-shrink-0">Deliver To</span>
                <span className="text-on-surface font-medium text-right">{address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Itemized receipt */}
        {items.length > 0 && (
          <div className="bg-surface-container-low rounded-xl p-lg border border-surface-container mb-lg">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">
              Items ({itemCount})
            </h3>
            <div className="divide-y divide-surface-container">
              {items.map((item) => {
                const freshness = getFreshnessInfo(item)
                return (
                  <div key={item.id} className="py-3 flex gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-on-surface font-label-md truncate">{item.name}</p>
                        <span className="text-on-surface font-label-md flex-shrink-0">₹{item.price * item.qty}</span>
                      </div>
                      {item.description && (
                        <p className="text-on-surface-variant text-[11px] leading-snug mt-0.5 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-on-surface-variant">
                        <span>Qty {item.qty}</span>
                        {item.weight && <span>{item.weight}</span>}
                        {item.nutrition && (
                          <>
                            <span>{item.nutrition.calories} kcal</span>
                            <span>{item.nutrition.protein}g protein</span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[10px] text-on-surface-variant/80">
                        <span className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-xs">inventory_2</span>
                          Packed {freshness.packedOn}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-xs">event_busy</span>
                          {item.category === 'chicken' ? 'Use by' : 'Best before'} {freshness.expiryOn}
                        </span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant/70 mt-1">{freshness.shelfLife}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-md pt-md border-t border-surface-container space-y-1.5">
              <div className="flex justify-between text-label-sm text-on-surface-variant">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-label-sm text-on-surface-variant">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-label-sm text-green-700">
                  <span>Coupon {couponCode && `(${couponCode})`}</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1.5">
                <span className="font-label-md text-on-surface">Total Paid</span>
                <span className="font-headline-sm text-headline-sm text-primary">₹{total}</span>
              </div>
            </div>
          </div>
        )}

        {/* Need Help */}
        <a
          href={whatsappHelpLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-surface-container bg-surface-container-low hover:border-primary transition-colors mb-lg font-label-md text-on-surface"
        >
          <span className="material-symbols-outlined text-primary text-lg">support_agent</span>
          Need Help with This Order?
        </a>

        <p className="text-center text-on-surface-variant font-label-sm mb-lg">
          This was a demo order — no real charge was made. We'll reach out to confirm delivery.
        </p>

        <div className="flex gap-sm">
          <button
            onClick={() => navigate('/my-orders')}
            className="flex-1 flex items-center justify-center gap-2 border border-outline text-on-surface py-3 rounded-lg font-label-md hover:bg-surface-container-low transition-all"
          >
            <span className="material-symbols-outlined text-base">local_shipping</span>
            Track Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-label-md shadow-lg active:scale-95 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </main>


    </div>
  )
}
