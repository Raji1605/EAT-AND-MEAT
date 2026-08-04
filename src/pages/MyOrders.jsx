import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getOrders, getOrderStatus } from '../orders'
import { getCurrentUser } from '../auth'
import { useLoginModal } from '../context/LoginModalContext'

const STATUS_META = {
  placed: { label: 'Order Placed', color: 'text-on-surface-variant', icon: 'receipt_long' },
  preparing: { label: 'Preparing', color: 'text-secondary', icon: 'inventory_2' },
  dispatched: { label: 'Out for Delivery', color: 'text-primary', icon: 'local_shipping' },
  delivered: { label: 'Delivered', color: 'text-green-700', icon: 'check_circle' },
}

const TRACKING_STEPS = [
  { id: 'placed', label: 'Order Placed', icon: 'receipt_long' },
  { id: 'preparing', label: 'Preparing', icon: 'inventory_2' },
  { id: 'dispatched', label: 'Out for Delivery', icon: 'local_shipping' },
  { id: 'delivered', label: 'Delivered', icon: 'home' },
]

export default function MyOrders({ cartCount, addToCart }) {
  const navigate = useNavigate()
  const { openLogin } = useLoginModal()
  const user = getCurrentUser()
  const [orders, setOrders] = useState([])
  const [trackingOrderId, setTrackingOrderId] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/')
      openLogin()
    }
  }, [user])

  useEffect(() => {
    const load = () => setOrders(getOrders())
    load()
    const interval = setInterval(load, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleReorder = (order) => {
    if (!addToCart) return
    order.items.forEach((item) => {
      for (let i = 0; i < item.qty; i++) addToCart(item)
    })
  }

  if (!user) return null

  return (
    <div className="bg-gradient-to-b from-primary-fixed/25 via-surface to-surface min-h-screen text-on-surface">
      <Header cartCount={cartCount || 0} />

      <main className="pt-20 pb-10 px-margin-mobile max-w-2xl mx-auto">
        <h1 className="font-headline-md text-headline-md text-on-surface mb-lg">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-lg border border-surface-container text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">receipt_long</span>
            <p className="text-on-surface-variant font-body-md mt-sm mb-md">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-lg py-2.5 rounded-lg bg-primary text-on-primary font-label-md"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = getOrderStatus(order)
              const meta = STATUS_META[status]
              const itemCount = order.items.reduce((sum, i) => sum + i.qty, 0)
              const isTracking = trackingOrderId === order.orderId
              const activeStepIndex = TRACKING_STEPS.findIndex((s) => s.id === status)

              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-xl border border-surface-container overflow-hidden shadow-sm"
                >
                  {/* Order header */}
                  <div className="p-md border-b border-surface-container">
                    <div className="flex justify-between items-start mb-2">
                      <div className="min-w-0">
                        <p className="font-label-md text-on-surface truncate">{order.orderId}</p>
                        <p className="text-on-surface-variant text-label-sm">
                          {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          {' · '}{itemCount} item{itemCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <span className="font-headline-sm text-headline-sm text-primary flex-shrink-0">₹{order.total}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${meta.color}`}>
                      <span className="material-symbols-outlined text-base">{meta.icon}</span>
                      <span className="font-label-sm">{meta.label}</span>
                    </div>
                  </div>

                  {/* Each item shown on its own row, always visible */}
                  <div className="divide-y divide-surface-container">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-md">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-label-md text-on-surface truncate">{item.name}</p>
                          <p className="text-on-surface-variant text-label-sm">Qty {item.qty}</p>
                        </div>
                        <span className="font-label-md text-on-surface flex-shrink-0">₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>

                  {/* Track order toggle */}
                  <button
                    onClick={() => setTrackingOrderId(isTracking ? null : order.orderId)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 border-t border-surface-container text-primary font-label-sm hover:bg-surface-container-low transition-colors"
                  >
                    {isTracking ? 'Hide Tracking' : 'Track Order'}
                    <span className="material-symbols-outlined text-lg">
                      {isTracking ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {isTracking && (
                    <div className="px-md pb-md pt-2 border-t border-surface-container">
                      {/* Tracking system */}
                      <div className="flex items-start justify-between relative pt-4">
                        <div className="absolute top-9 left-0 right-0 h-0.5 bg-surface-container mx-5" />
                        <div
                          className="absolute top-9 left-5 h-0.5 bg-primary transition-all duration-700"
                          style={{ width: `${(activeStepIndex / (TRACKING_STEPS.length - 1)) * 85}%` }}
                        />
                        {TRACKING_STEPS.map((step, i) => {
                          const done = i <= activeStepIndex
                          return (
                            <div key={step.id} className="relative flex flex-col items-center gap-2 flex-1">
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                                  done
                                    ? 'bg-primary border-primary text-white'
                                    : 'bg-surface border-surface-container text-on-surface-variant/50'
                                }`}
                              >
                                <span className="material-symbols-outlined text-base">{step.icon}</span>
                              </div>
                              <span
                                className={`text-[10px] text-center font-label-sm leading-tight ${
                                  done ? 'text-on-surface font-semibold' : 'text-on-surface-variant/60'
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      <div className="flex gap-2 mt-md">
                        <button
                          onClick={() => navigate('/order-success', { state: order })}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-outline text-on-surface font-label-sm hover:bg-surface transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">receipt_long</span>
                          View Details
                        </button>
                        {status === 'delivered' && (
                          <button
                            onClick={() => handleReorder(order)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-on-primary font-label-sm"
                          >
                            <span className="material-symbols-outlined text-base">replay</span>
                            Reorder
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
