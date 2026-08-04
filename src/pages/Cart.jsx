import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { BUSINESS_INFO } from '../businessInfo'
import { getFreshnessInfo } from '../data'

export default function Cart({ cart, removeFromCart, updateQty }) {
  const navigate = useNavigate()

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  // Builds a readable order summary and opens WhatsApp with it pre-filled.
  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return

    const lines = cart.map(
      (item) => `• ${item.name} x${item.qty} — ₹${item.price * item.qty}`
    )
    const message = [
      `Hi ${BUSINESS_INFO.name}, I'd like to place an order:`,
      '',
      ...lines,
      '',
      `Total: ₹${total}`,
      '',
      'Please confirm availability and delivery details.',
    ].join('\n')

    const phone = BUSINESS_INFO.whatsapp.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="bg-gradient-to-b from-primary-fixed/25 via-surface to-surface text-on-surface min-h-screen">
      <Header
        cartCount={cartCount}
        onMenuClick={() => navigate('/')}
        onCartClick={() => navigate('/cart')}
      />

      <main className="pt-20 pb-10 px-4 max-w-5xl mx-auto">
        <h1 className="font-headline-md text-headline-md text-on-surface mb-6">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/40">
              shopping_cart
            </span>
            <p className="text-on-surface-variant font-body-md mt-sm mb-md">Your cart is empty.</p>
            <button
              onClick={() => navigate('/')}
              className="px-lg py-3 rounded-lg bg-primary text-on-primary font-label-md"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {cart.map((item, i) => {
                const freshness = getFreshnessInfo(item)
                return (
                  <div
                    key={item.id}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className="fade-slide-in border border-surface-container rounded-lg p-3 sm:p-4 bg-surface hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="font-label-md text-on-surface leading-tight">{item.name}</h2>
                          <p className="text-primary font-bold flex-shrink-0">₹{item.price * item.qty}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                          {item.weight && (
                            <span className="text-on-surface-variant text-label-sm">{item.weight}</span>
                          )}
                          {item.tag && (
                            <span className="px-1.5 py-0.5 bg-secondary/10 text-secondary text-[10px] rounded-full font-bold">
                              {item.tag}
                            </span>
                          )}
                          {item.freshness && (
                            <span className="px-1.5 py-0.5 bg-secondary-container/20 text-on-secondary-container text-[10px] rounded-full font-bold">
                              {item.freshness}
                            </span>
                          )}
                        </div>

                        {item.description && (
                          <p className="text-on-surface-variant text-[11px] leading-snug mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center gap-1 mt-1 text-[10px] text-on-surface-variant/80">
                          <span className="material-symbols-outlined text-xs">event_busy</span>
                          {item.category === 'chicken' ? 'Use by' : 'Best before'}: {freshness.expiryOn}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-container">
                      {/* Quantity stepper */}
                      <div className="flex items-center gap-2 border border-surface-container rounded-lg">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface-container-low active:scale-90 rounded-l-lg transition-transform"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span key={item.qty} className="w-6 text-center font-label-md badge-bounce">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface-container-low active:scale-90 rounded-r-lg transition-transform"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="px-4 py-2 rounded bg-error text-on-error hover:opacity-90 active:scale-95 transition text-label-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Order summary + checkout */}
            <div className="mt-lg bg-surface-container-low rounded-xl p-lg border border-surface-container">
              <div className="flex justify-between items-center mb-md">
                <span className="font-label-md text-on-surface-variant">
                  {cartCount} item{cartCount !== 1 ? 's' : ''}
                </span>
                <span className="font-headline-sm text-headline-sm text-primary">₹{total}</span>
              </div>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full flex items-center justify-center gap-2 bg-secondary-container text-on-secondary-container py-3.5 rounded-lg font-label-md shadow-md hover:opacity-90 hover:brightness-105 active:scale-95 transition-all mb-sm"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                Place Order via WhatsApp
              </button>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 border border-primary text-primary py-3 rounded-lg font-label-md hover:bg-primary hover:text-on-primary active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-base">payments</span>
                Proceed to Payment
              </button>
            </div>
          </>
        )}
      </main>


    </div>
  )
}
