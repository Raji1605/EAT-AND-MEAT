import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrders, getOrderStatus, setOrderStatus, assignOrder } from '../orders'
import { products } from '../data'
import { getStockMap, setStock } from '../inventory'
import { DELIVERY_PARTNERS, getPartnerById } from '../deliveryPartners'
import { getCurrentUser, logout } from '../auth'
import { useLoginModal } from '../context/LoginModalContext'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'orders', label: 'Orders', icon: 'receipt_long' },
  { id: 'inventory', label: 'Inventory', icon: 'inventory_2' },
  { id: 'partners', label: 'Delivery Partners', icon: 'moped' },
]

const STATUS_META = {
  placed: { label: 'Placed', color: 'bg-gray-100 text-gray-700' },
  preparing: { label: 'Preparing', color: 'bg-yellow-100 text-yellow-700' },
  dispatched: { label: 'Out for Delivery', color: 'bg-blue-100 text-blue-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
}

const STATUS_FLOW = ['placed', 'preparing', 'dispatched', 'delivered']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { openLogin } = useLoginModal()
  const [tab, setTab] = useState('overview')
  const [orders, setOrders] = useState([])
  const [stockMap, setStockMap] = useState({})
  const user = getCurrentUser()

  // Guard: only logged-in admins may view this page.
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      openLogin()
    }
  }, [])

  useEffect(() => {
    const load = () => {
      setOrders(getOrders())
      setStockMap(getStockMap())
    }
    load()
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [])

  if (!user || user.role !== 'admin') return null

  const revenue = orders.reduce((sum, o) => sum + o.total, 0)
  const pending = orders.filter((o) => getOrderStatus(o) !== 'delivered').length
  const unassigned = orders.filter((o) => !o.assignedTo && getOrderStatus(o) !== 'delivered').length

  const advanceStatus = (order) => {
    const current = getOrderStatus(order)
    const idx = STATUS_FLOW.indexOf(current)
    const next = STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)]
    setOrderStatus(order.orderId, next)
    setOrders(getOrders())
  }

  const handleAssign = (orderId, partnerId) => {
    if (!partnerId) return
    assignOrder(orderId, partnerId)
    setOrders(getOrders())
  }

  const handleStockChange = (productId, qty) => {
    setStock(productId, qty)
    setStockMap(getStockMap())
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-surface-container flex-shrink-0 hidden md:flex flex-col">
        <div className="p-lg border-b border-surface-container">
          <h1 className="font-headline-sm text-headline-sm text-primary">Eat &amp; Meat</h1>
          <p className="text-on-surface-variant text-label-sm">Admin — {user.name}</p>
        </div>
        <nav className="flex-1 p-sm">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-md py-2.5 rounded-lg font-label-md mb-1 transition-colors relative ${
                tab === item.id
                  ? 'bg-primary-fixed text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.label}
              {item.id === 'orders' && unassigned > 0 && (
                <span className="ml-auto bg-primary text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                  {unassigned}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-sm border-t border-surface-container">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-md py-2.5 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-surface-container z-40 flex items-center justify-between px-margin-mobile h-14">
        <h1 className="font-label-md text-primary">Admin</h1>
        <select
          value={tab}
          onChange={(e) => setTab(e.target.value)}
          className="text-label-sm border border-outline-variant rounded-lg px-2 py-1"
        >
          {NAV_ITEMS.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </div>

      {/* Main content */}
      <main className="flex-1 p-margin-mobile md:p-lg pt-20 md:pt-lg overflow-x-hidden">
        {tab === 'overview' && (
          <>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-lg">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-lg">
              <StatCard icon="payments" label="Total Revenue" value={`₹${revenue}`} />
              <StatCard icon="receipt_long" label="Total Orders" value={orders.length} />
              <StatCard icon="pending_actions" label="Unassigned Orders" value={unassigned} highlight={unassigned > 0} />
              <StatCard icon="inventory_2" label="Products Listed" value={products.length} />
            </div>

            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Recent Orders</h3>
            <OrdersTable orders={orders.slice(0, 5)} advanceStatus={advanceStatus} handleAssign={handleAssign} />
          </>
        )}

        {tab === 'orders' && (
          <>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-lg">All Orders</h2>
            <OrdersTable orders={orders} advanceStatus={advanceStatus} handleAssign={handleAssign} />
          </>
        )}

        {tab === 'inventory' && (
          <>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Inventory / Stock</h2>
            <p className="text-on-surface-variant font-label-sm mb-lg">
              Update how much of each item is available today. Items at 0 show "Out of Stock" to customers.
            </p>
            <div className="bg-white rounded-xl border border-surface-container overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-label-sm min-w-[500px]">
                <thead className="bg-surface-container-low text-on-surface-variant">
                  <tr>
                    <th className="px-md py-3">Product</th>
                    <th className="px-md py-3">Category</th>
                    <th className="px-md py-3">Price</th>
                    <th className="px-md py-3">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const stock = stockMap[p.id] ?? 0
                    return (
                      <tr key={p.id} className="border-t border-surface-container">
                        <td className="px-md py-3 flex items-center gap-2">
                          <img src={p.image} alt={p.name} className="w-8 h-8 rounded-md object-cover" />
                          {p.name}
                        </td>
                        <td className="px-md py-3 capitalize text-on-surface-variant">{p.category}</td>
                        <td className="px-md py-3">₹{p.price}</td>
                        <td className="px-md py-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={stock}
                              onChange={(e) => handleStockChange(p.id, Number(e.target.value))}
                              className="w-20 border border-outline-variant rounded-lg px-2 py-1.5"
                            />
                            <span className={stock <= 0 ? 'text-error text-[11px] font-bold' : 'text-on-surface-variant text-[11px]'}>
                              {stock <= 0 ? 'Out of Stock' : 'units'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'partners' && (
          <>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-lg">Delivery Partners</h2>
            <div className="grid md:grid-cols-3 gap-gutter">
              {DELIVERY_PARTNERS.map((p) => {
                const assignedCount = orders.filter((o) => o.assignedTo === p.id && getOrderStatus(o) !== 'delivered').length
                const completedCount = orders.filter((o) => o.assignedTo === p.id && getOrderStatus(o) === 'delivered').length
                return (
                  <div key={p.id} className="bg-white rounded-xl border border-surface-container p-md">
                    <div className="flex items-center gap-3 mb-md">
                      <div className="w-11 h-11 rounded-full bg-primary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">moped</span>
                      </div>
                      <div>
                        <p className="font-label-md text-on-surface">{p.name}</p>
                        <p className="text-on-surface-variant text-label-sm">{p.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-label-sm">
                      <div>
                        <p className="font-headline-sm text-headline-sm text-primary">{assignedCount}</p>
                        <p className="text-on-surface-variant">Active</p>
                      </div>
                      <div>
                        <p className="font-headline-sm text-headline-sm text-on-surface">{completedCount}</p>
                        <p className="text-on-surface-variant">Completed</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function StatCard({ icon, label, value, highlight }) {
  return (
    <div className={`bg-white rounded-xl border p-md ${highlight ? 'border-primary' : 'border-surface-container'}`}>
      <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center mb-2">
        <span className="material-symbols-outlined text-primary text-lg">{icon}</span>
      </div>
      <p className="font-headline-sm text-headline-sm text-on-surface">{value}</p>
      <p className="text-on-surface-variant text-label-sm">{label}</p>
    </div>
  )
}

function OrdersTable({ orders, advanceStatus, handleAssign }) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-surface-container p-lg text-center text-on-surface-variant">
        No orders yet — place a demo order from the storefront to see it here.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-surface-container overflow-hidden overflow-x-auto">
      <table className="w-full text-left text-label-sm min-w-[750px]">
        <thead className="bg-surface-container-low text-on-surface-variant">
          <tr>
            <th className="px-md py-3">Order ID</th>
            <th className="px-md py-3">Customer</th>
            <th className="px-md py-3">Zone</th>
            <th className="px-md py-3">Total</th>
            <th className="px-md py-3">Status</th>
            <th className="px-md py-3">Delivery Partner</th>
            <th className="px-md py-3"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const status = getOrderStatus(o)
            const meta = STATUS_META[status]
            const partner = getPartnerById(o.assignedTo)
            return (
              <tr key={o.orderId} className="border-t border-surface-container">
                <td className="px-md py-3 font-medium text-on-surface">{o.orderId}</td>
                <td className="px-md py-3 text-on-surface-variant">{o.name}</td>
                <td className="px-md py-3 text-on-surface-variant">{o.zoneLabel?.split(' — ')[0] || '—'}</td>
                <td className="px-md py-3 text-on-surface">₹{o.total}</td>
                <td className="px-md py-3">
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${meta.color}`}>
                    {meta.label}
                  </span>
                </td>
                <td className="px-md py-3">
                  {partner ? (
                    <span className="text-on-surface">{partner.name}</span>
                  ) : (
                    <select
                      defaultValue=""
                      onChange={(e) => handleAssign(o.orderId, e.target.value)}
                      className="text-label-sm border border-outline-variant rounded-lg px-2 py-1"
                    >
                      <option value="" disabled>Assign...</option>
                      {DELIVERY_PARTNERS.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="px-md py-3">
                  {status !== 'delivered' && (
                    <button
                      onClick={() => advanceStatus(o)}
                      className="text-primary text-label-sm hover:underline whitespace-nowrap"
                    >
                      Advance →
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
