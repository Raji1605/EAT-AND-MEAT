import { useNavigate } from 'react-router-dom'
import { useCartDrawer } from '../context/CartDrawerContext'
import { useLoginModal } from '../context/LoginModalContext'
import { getCurrentUser } from '../auth'
import { getFreshnessInfo } from '../data'

export default function CartDrawer({ cart, removeFromCart, updateQty }) {
  const { isOpen, closeCart } = useCartDrawer()
  const { openLogin } = useLoginModal()
  const navigate = useNavigate()

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const handleProceedToPayment = () => {
    if (cart.length === 0) return
    const user = getCurrentUser()
    if (!user) {
      // Must be logged in to place an order — close the cart and prompt login.
      closeCart()
      openLogin()
      return
    }
    closeCart()
    navigate('/checkout')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-on-surface/50 backdrop-blur-[2px] z-[85] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Side drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface z-[90] shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-lg py-4 border-b border-surface-container bg-surface-container-low">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Your Cart</h2>
          <button
            onClick={closeCart}
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-lg py-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/40">
                shopping_cart
              </span>
              <p className="text-on-surface-variant font-body-md mt-sm mb-md">Your cart is empty.</p>
              <button
                onClick={() => { closeCart(); navigate('/') }}
                className="px-lg py-3 rounded-lg bg-primary text-on-primary font-label-md"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const freshness = getFreshnessInfo(item)
                return (
                  <div
                    key={item.id}
                    className="border border-surface-container rounded-lg p-3 bg-surface hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-label-md text-on-surface leading-tight">{item.name}</h3>
                          <p className="text-primary font-bold flex-shrink-0">₹{item.price * item.qty}</p>
                        </div>
                        {item.weight && (
                          <p className="text-on-surface-variant text-label-sm">{item.weight}</p>
                        )}
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-on-surface-variant/80">
                          <span className="material-symbols-outlined text-xs">event_busy</span>
                          {item.category === 'chicken' ? 'Use by' : 'Best before'}: {freshness.expiryOn}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-container">
                      <div className="flex items-center gap-2 border border-surface-container rounded-lg">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-primary hover:bg-surface-container-low active:scale-90 rounded-l-lg transition-transform"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-label-md">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-primary hover:bg-surface-container-low active:scale-90 rounded-r-lg transition-transform"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="px-3 py-1.5 rounded bg-error text-on-error hover:opacity-90 active:scale-95 transition text-label-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-lg py-4 border-t border-surface-container bg-surface-container-low">
            <div className="flex justify-between items-center mb-md">
              <span className="font-label-md text-on-surface-variant">
                {cartCount} item{cartCount !== 1 ? 's' : ''}
              </span>
              <span className="font-headline-sm text-headline-sm text-primary">₹{total}</span>
            </div>
            <button
              onClick={handleProceedToPayment}
              className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3.5 rounded-lg font-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">payments</span>
              Proceed to Payment
            </button>
            {!getCurrentUser() && (
              <p className="text-center text-on-surface-variant text-label-sm mt-2">
                You'll need to log in to place your order.
              </p>
            )}
          </div>
        )}
      </aside>
    </>
  )
}
