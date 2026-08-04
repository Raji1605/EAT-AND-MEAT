import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrdersForPartner, getOrderStatus, setOrderStatus } from '../orders'
import { getCurrentUser, logout } from '../auth'
import { useLoginModal } from '../context/LoginModalContext'

const STATUS_META = {
  placed: { label: 'Ready for Pickup', step: 0, icon: 'inventory_2', color: 'bg-gray-100 text-gray-700', next: 'preparing', nextLabel: 'Start Preparing', nextIcon: 'inventory_2' },
  preparing: { label: 'Preparing', step: 1, icon: 'soup_kitchen', color: 'bg-amber-100 text-amber-700', next: 'dispatched', nextLabel: 'Picked Up — Start Delivery', nextIcon: 'moped' },
  dispatched: { label: 'Out for Delivery', step: 2, icon: 'moped', color: 'bg-blue-100 text-blue-700', next: 'delivered', nextLabel: 'Mark Delivered', nextIcon: 'task_alt' },
  delivered: { label: 'Delivered', step: 3, icon: 'check_circle', color: 'bg-green-100 text-green-700', next: null, nextLabel: null, nextIcon: null },
}

const MINI_STEPS = ['inventory_2', 'soup_kitchen', 'moped', 'task_alt']

function isToday(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

export default function DeliveryDashboard() {
  const navigate = useNavigate()
  const { openLogin } = useLoginModal()
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('active')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [confirmingId, setConfirmingId] = useState(null)
  const user = getCurrentUser()

  // Guard: only logged-in delivery partners may view this page.
  useEffect(() => {
    if (!user || user.role !== 'delivery') {
      navigate('/')
      openLogin()
    }
  }, [])

  const refresh = () => {
    setOrders(getOrdersForPartner(user.partnerId))
    setLastUpdated(new Date())
  }

  useEffect(() => {
    if (!user || user.role !== 'delivery') return
    refresh()
    const interval = setInterval(refresh, 10000)
    return () => clearInterval(interval)
  }, [])

  if (!user || user.role !== 'delivery') return null

  const advance = (order) => {
    const status = getOrderStatus(order)
    const meta = STATUS_META[status]
    if (!meta.next) return

    // Marking delivered is the point of no return for an order — confirm first.
    if (meta.next === 'delivered' && confirmingId !== order.orderId) {
      setConfirmingId(order.orderId)
      return
    }

    setOrderStatus(order.orderId, meta.next)
    setConfirmingId(null)
    refresh()
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const active = orders.filter((o) => getOrderStatus(o) !== 'delivered')
  const completed = orders.filter((o) => getOrderStatus(o) === 'delivered')
  const completedToday = completed.filter((o) => isToday(o.placedAt))
  const earningsTotal = completed.reduce((sum, o) => sum + (o.deliveryFee || 30), 0)
  const earningsToday = completedToday.reduce((sum, o) => sum + (o.deliveryFee || 30), 0)
  const codToCollect = active.reduce((sum, o) => sum + (o.total || 0), 0)
  const list = tab === 'active' ? active : completed

  return (
    <div className="min-h-screen bg-surface-container-low pb-lg">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-[#8f0d0a] text-white px-margin-mobile pt-lg pb-xl rounded-b-[32px] shadow-lg">
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-lg">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">sports_motorsports</span>
            </div>
            <div className="min-w-0">
              <p className="font-label-sm text-white/70">Delivery Partner</p>
              <h1 className="font-headline-sm text-headline-sm truncate">{user.name}</h1>
              {user.phone && <p className="text-[11px] text-white/60 truncate">{user.phone}</p>}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors flex-shrink-0"
            aria-label="Log out"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 max-w-2xl mx-auto">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-2 py-3 text-center pop-in" style={{ animationDelay: '0.05s' }}>
            <p className="font-headline-sm text-headline-sm">{active.length}</p>
            <p className="text-[10px] text-white/80 leading-tight">Active</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-2 py-3 text-center pop-in" style={{ animationDelay: '0.12s' }}>
            <p className="font-headline-sm text-headline-sm">{completedToday.length}</p>
            <p className="text-[10px] text-white/80 leading-tight">Today</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-2 py-3 text-center pop-in" style={{ animationDelay: '0.19s' }}>
            <p className="font-headline-sm text-headline-sm">₹{earningsToday}</p>
            <p className="text-[10px] text-white/80 leading-tight">Today's Earnings</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-2 py-3 text-center pop-in" style={{ animationDelay: '0.26s' }}>
            <p className="font-headline-sm text-headline-sm">₹{earningsTotal}</p>
            <p className="text-[10px] text-white/80 leading-tight">Total Earnings</p>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-margin-mobile -mt-6">
        {codToCollect > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-md py-2.5 mb-md flex items-center gap-2 fade-slide-in">
            <span className="material-symbols-outlined text-amber-700 text-lg">payments</span>
            <p className="text-amber-800 font-label-sm">
              Cash to collect on active orders: <span className="font-bold">₹{codToCollect}</span>
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md border border-surface-container p-1.5 flex gap-1 mb-2">
          <button
            onClick={() => setTab('active')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-label-md transition-all duration-200 ${
              tab === 'active' ? 'bg-primary text-white shadow-sm scale-[1.02]' : 'text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-base">local_shipping</span>
            Active ({active.length})
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-label-md transition-all duration-200 ${
              tab === 'completed' ? 'bg-primary text-white shadow-sm scale-[1.02]' : 'text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-base">history</span>
            Completed ({completed.length})
          </button>
        </div>

        <div className="flex items-center justify-between mb-lg px-1">
          <p className="text-on-surface-variant text-[11px]">
            Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <button
            onClick={refresh}
            className="flex items-center gap-1 text-primary text-[11px] font-label-sm hover:underline"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Refresh
          </button>
        </div>

        {list.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-container p-xl text-center fade-slide-in">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">
              {tab === 'active' ? 'moped' : 'inbox'}
            </span>
            <p className="text-on-surface-variant font-body-md mt-sm">
              {tab === 'active' ? 'No active deliveries right now.' : 'No completed deliveries yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((o, idx) => {
              const status = getOrderStatus(o)
              const meta = STATUS_META[status]
              const itemCount = o.items.reduce((sum, i) => sum + i.qty, 0)
              const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(o.address)}`
              const callUrl = `tel:${(o.phone || '').replace(/\s/g, '')}`
              const isConfirming = confirmingId === o.orderId

              return (
                <div
                  key={o.orderId}
                  className="bg-white rounded-2xl border border-surface-container shadow-sm overflow-hidden fade-slide-in hover:shadow-md hover:-translate-y-0.5 transition-all"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <div className="p-md">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-label-md text-on-surface flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-primary">tag</span>
                          {o.orderId}
                        </p>
                        <p className="text-on-surface-variant text-label-sm mt-0.5">
                          {itemCount} item{itemCount !== 1 ? 's' : ''} · ₹{o.total}
                          {o.zoneLabel && ` · ${o.zoneLabel.split(' — ')[0]}`}
                        </p>
                      </div>
                      <span
                        className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-full ${meta.color} ${
                          status === 'dispatched' ? 'pulse-glow' : ''
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">{meta.icon}</span>
                        {meta.label}
                      </span>
                    </div>

                    {/* Mini progress timeline */}
                    <div className="flex items-center gap-1 mb-3">
                      {MINI_STEPS.map((icon, i) => (
                        <div key={icon} className="flex items-center flex-1 last:flex-none">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                              i <= meta.step ? 'bg-primary text-white scale-100' : 'bg-surface-container text-on-surface-variant/40 scale-90'
                            }`}
                          >
                            <span className="material-symbols-outlined text-xs">{icon}</span>
                          </div>
                          {i < MINI_STEPS.length - 1 && (
                            <div className={`h-0.5 flex-1 transition-colors duration-500 ${i < meta.step ? 'bg-primary' : 'bg-surface-container'}`} />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="bg-surface-container-low rounded-xl p-sm space-y-1.5 mb-3">
                      <div className="flex items-center justify-between gap-2 text-label-sm text-on-surface">
                        <span className="flex items-start gap-2 min-w-0">
                          <span className="material-symbols-outlined text-sm mt-0.5 text-on-surface-variant flex-shrink-0">person</span>
                          <span className="truncate">{o.name} · {o.phone}</span>
                        </span>
                        {status !== 'delivered' && o.phone && (
                          <a
                            href={callUrl}
                            className="flex-shrink-0 flex items-center gap-1 text-primary text-[11px] font-bold hover:underline"
                          >
                            <span className="material-symbols-outlined text-sm">call</span>
                            Call
                          </a>
                        )}
                      </div>
                      <div className="flex items-start justify-between gap-2 text-label-sm text-on-surface">
                        <span className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-sm mt-0.5 text-on-surface-variant">location_on</span>
                          <span>{o.address}</span>
                        </span>
                        {status !== 'delivered' && (
                          <a
                            href={navUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 flex items-center gap-1 text-primary text-[11px] font-bold hover:underline"
                          >
                            <span className="material-symbols-outlined text-sm">near_me</span>
                            Navigate
                          </a>
                        )}
                      </div>
                      {status !== 'delivered' && (
                        <div className="flex items-center gap-2 text-label-sm text-on-surface pt-0.5">
                          <span className="material-symbols-outlined text-sm text-on-surface-variant">payments</span>
                          <span>Collect <span className="font-bold">₹{o.total}</span> cash on delivery</span>
                        </div>
                      )}
                    </div>

                    {meta.next ? (
                      isConfirming ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setConfirmingId(null)}
                            className="flex-1 py-3 rounded-xl font-label-md border border-outline text-on-surface"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => advance(o)}
                            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-label-md shadow-md active:scale-95"
                          >
                            <span className="material-symbols-outlined text-base">task_alt</span>
                            Confirm Delivered
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => advance(o)}
                          className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-xl font-label-md shadow-md active:scale-95 hover:shadow-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-base">{meta.nextIcon}</span>
                          {meta.nextLabel}
                        </button>
                      )
                    ) : (
                      <div className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 py-3 rounded-xl font-label-md">
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        Delivered
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
