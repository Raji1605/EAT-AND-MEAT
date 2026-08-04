import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { DELIVERY_ZONES } from '../deliveryZones'
import { saveOrder } from '../orders'
import { decrementStock } from '../inventory'
import { applyCoupon } from '../coupons'
import { getCurrentUser, getAddresses, addAddress } from '../auth'
import { useLoginModal } from '../context/LoginModalContext'

// DEMO checkout — no real payment gateway is wired up (that needs a backend
// + a provider like Razorpay/Stripe). This simulates the full flow so the
// UI/UX can be reviewed end-to-end; wiring a real gateway later is a
// separate, backend-dependent step.
const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: 'payments' },
  { id: 'upi', label: 'UPI (GPay / PhonePe / Paytm)', icon: 'qr_code_2' },
  { id: 'card', label: 'Credit / Debit Card', icon: 'credit_card' },
]

export default function Checkout({ cart, clearCart }) {
  const navigate = useNavigate()
  const { openLogin } = useLoginModal()
  const user = getCurrentUser()
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  // Placing an order requires being logged in.
  useEffect(() => {
    if (!user) {
      navigate('/')
      openLogin()
    }
  }, [user])

  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [addresses, setAddresses] = useState(user ? getAddresses(user.phone) : [])
  const [saveAddress, setSaveAddress] = useState(false)
  const [method, setMethod] = useState('cod')
  const [zoneId, setZoneId] = useState(DELIVERY_ZONES[0].id)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [couponInput, setCouponInput] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [couponMessage, setCouponMessage] = useState('')

  const zone = DELIVERY_ZONES.find((z) => z.id === zoneId)
  const deliveryFee = zone ? zone.fee : 0
  const discount = coupon ? Math.round(subtotal * coupon.discountRate) : 0
  const total = subtotal + deliveryFee - discount

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    if (fieldErrors[field]) setFieldErrors({ ...fieldErrors, [field]: false })
  }

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponInput)
    setCouponMessage(result.message)
    setCoupon(result.valid ? result : null)
  }

  const handleRemoveCoupon = () => {
    setCoupon(null)
    setCouponInput('')
    setCouponMessage('')
  }

  const handlePlaceOrder = () => {
    const missing = {
      name: !form.name.trim(),
      phone: !form.phone.trim(),
      address: !form.address.trim(),
    }
    if (missing.name || missing.phone || missing.address) {
      setFieldErrors(missing)
      setError(
        missing.address
          ? 'Please add your delivery address before proceeding to payment.'
          : 'Please fill in your name, phone, and address.'
      )
      document.getElementById('delivery-details-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setFieldErrors({})
    setError('')
    setProcessing(true)

    // Simulated payment processing delay (demo only).
    setTimeout(() => {
      const orderId = 'ORD' + Math.floor(100000 + Math.random() * 900000)
      const placedAt = new Date().toISOString()
      const order = {
        orderId,
        subtotal,
        deliveryFee,
        discount,
        couponCode: coupon ? couponInput.trim().toUpperCase() : null,
        total,
        method,
        name: form.name,
        phone: form.phone,
        address: form.address,
        items: cart,
        placedAt,
        zoneId: zone.id,
        zoneLabel: zone.label,
        etaMinutes: zone.etaMinutes,
      }
      saveOrder(order)
      if (saveAddress && user) {
        addAddress(user.phone, { label: 'Home', text: form.address.trim() })
      }
      cart.forEach((item) => decrementStock(item.id, item.qty))
      clearCart()
      navigate('/order-success', { state: order })
    }, 1500)
  }

  if (!user) return null

  if (cart.length === 0) {
    return (
      <div className="bg-gradient-to-b from-primary-fixed/25 via-surface to-surface text-on-surface min-h-screen">
        <Header cartCount={0} onMenuClick={() => navigate('/')} onCartClick={() => navigate('/cart')} />
        <main className="pt-20 px-margin-mobile text-center">
          <p className="text-on-surface-variant mb-md">Your cart is empty.</p>
          <button
            onClick={() => navigate('/')}
            className="px-lg py-3 rounded-lg bg-primary text-on-primary font-label-md"
          >
            Continue Shopping
          </button>
        </main>

      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-primary-fixed/25 via-surface to-surface text-on-surface min-h-screen">
      <Header cartCount={cartCount} onMenuClick={() => navigate('/')} onCartClick={() => navigate('/cart')} />

      <main className="pt-20 pb-10 px-margin-mobile max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-1 text-primary font-label-md mb-md hover:underline"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Cart
        </button>

        <h1 className="font-headline-md text-headline-md text-on-surface mb-lg">Checkout</h1>

        {/* Demo notice */}
        <div className="bg-secondary-container/20 border border-secondary-container text-on-surface-variant text-label-sm rounded-lg p-sm mb-lg flex items-start gap-2">
          <span className="material-symbols-outlined text-base text-secondary">info</span>
          <span>This is a demo checkout. No real payment will be charged.</span>
        </div>

        {/* Delivery details */}
        <div id="delivery-details-section" className="bg-surface-container-low rounded-xl p-lg border border-surface-container mb-lg">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Delivery Details</h3>

          <div className="space-y-3">
            <input
              className={`w-full bg-white border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                fieldErrors.name ? 'border-error' : 'border-outline-variant'
              }`}
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange('name')}
            />
            <input
              className={`w-full bg-white border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                fieldErrors.phone ? 'border-error' : 'border-outline-variant'
              }`}
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange('phone')}
            />
            <div>
              {addresses.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {addresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, address: addr.text }))}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-label-sm ${
                        form.address === addr.text
                          ? 'border-primary bg-primary-fixed/40 text-primary'
                          : 'border-outline-variant text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {addr.label === 'Work' ? 'work' : addr.label === 'Home' ? 'home' : 'location_on'}
                      </span>
                      {addr.label}
                    </button>
                  ))}
                </div>
              )}
              <textarea
                className={`w-full bg-white border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none ${
                  fieldErrors.address ? 'border-error' : 'border-outline-variant'
                }`}
                placeholder="Delivery Address"
                rows={3}
                value={form.address}
                onChange={handleChange('address')}
              />
              {fieldErrors.address && (
                <p className="text-error font-label-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  Address is required to place your order
                </p>
              )}
              <label className="flex items-center gap-2 mt-2 text-label-sm text-on-surface-variant cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  className="accent-primary"
                />
                Save this address to my profile
              </label>
            </div>
          </div>
        </div>

        {/* Zone-wise delivery */}
        <div className="bg-surface-container-low rounded-xl p-lg border border-surface-container mb-lg">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Delivery Zone</h3>
          <p className="text-on-surface-variant text-label-sm mb-md">
            Select the zone closest to your address — fees and delivery time vary by zone.
          </p>

          <div className="space-y-2">
            {DELIVERY_ZONES.map((z) => (
              <label
                key={z.id}
                className={`flex items-center gap-3 p-sm rounded-lg border cursor-pointer transition-colors ${
                  zoneId === z.id
                    ? 'border-primary bg-primary-fixed/30'
                    : 'border-surface-container hover:bg-surface-container'
                }`}
              >
                <input
                  type="radio"
                  name="zone"
                  checked={zoneId === z.id}
                  onChange={() => setZoneId(z.id)}
                  className="accent-primary"
                />
                <span className="material-symbols-outlined text-primary">location_on</span>
                <div className="flex-1 min-w-0">
                  <p className="font-label-md text-on-surface">{z.label}</p>
                  <p className="text-on-surface-variant text-label-sm truncate">{z.areas}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-label-md text-on-surface">{z.fee === 0 ? 'FREE' : `₹${z.fee}`}</p>
                  <p className="text-on-surface-variant text-label-sm">~{z.etaMinutes} min</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-surface-container-low rounded-xl p-lg border border-surface-container mb-lg">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Payment Method</h3>

          <div className="space-y-2">
            {PAYMENT_METHODS.map((m) => (
              <label
                key={m.id}
                className={`flex items-center gap-3 p-sm rounded-lg border cursor-pointer transition-colors ${
                  method === m.id
                    ? 'border-primary bg-primary-fixed/30'
                    : 'border-surface-container hover:bg-surface-container'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={method === m.id}
                  onChange={() => setMethod(m.id)}
                  className="accent-primary"
                />
                <span className="material-symbols-outlined text-primary">{m.icon}</span>
                <span className="font-label-md text-on-surface">{m.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Coupon */}
        <div className="bg-surface-container-low rounded-xl p-lg border border-surface-container mb-lg">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Offers &amp; Coupons</h3>
          <p className="text-on-surface-variant text-label-sm mb-md">
            Have a code? Enter it below — demo mode accepts any code for 10% off.
          </p>

          {coupon ? (
            <div className="flex items-center justify-between gap-3 bg-secondary-container/15 border border-dashed border-secondary rounded-lg p-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">sell</span>
                <div>
                  <p className="font-label-md text-on-surface">{couponInput.trim().toUpperCase()} applied</p>
                  <p className="text-on-surface-variant text-label-sm">You're saving ₹{discount}</p>
                </div>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="text-error font-label-sm text-label-sm hover:underline flex-shrink-0"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                className="flex-1 bg-white border border-outline-variant rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Enter coupon code (e.g. SPICE10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button
                onClick={handleApplyCoupon}
                className="flex-shrink-0 px-lg py-2 rounded-lg border border-primary text-primary font-label-md hover:bg-primary hover:text-on-primary transition-colors"
              >
                Apply
              </button>
            </div>
          )}

          {!coupon && couponMessage && (
            <p className="text-on-surface-variant text-label-sm mt-2">{couponMessage}</p>
          )}
        </div>

        {/* Order summary */}
        <div className="bg-surface-container-low rounded-xl p-lg border border-surface-container mb-lg">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Order Summary</h3>
          <div className="space-y-2 mb-md">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-label-md">
                <span className="text-on-surface-variant">{item.name} x{item.qty}</span>
                <span className="text-on-surface">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1.5 pt-md border-t border-surface-container">
            <div className="flex justify-between text-label-sm text-on-surface-variant">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-label-sm text-on-surface-variant">
              <span>Delivery Fee ({zone.label.split(' — ')[0]})</span>
              <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-label-sm text-green-700">
                <span>Coupon discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1.5">
              <span className="font-label-md text-on-surface-variant">Total</span>
              <span className="font-headline-sm text-headline-sm text-primary">₹{total}</span>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-error font-label-sm mb-md">{error}</p>
        )}

        <button
          onClick={handlePlaceOrder}
          disabled={processing}
          className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-4 rounded-lg font-label-md shadow-lg active:scale-95 transition-all disabled:opacity-60"
        >
          {processing ? (
            <>
              <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
              Processing Payment...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">lock</span>
              Pay ₹{total} & Place Order
            </>
          )}
        </button>
      </main>


    </div>
  )
}
