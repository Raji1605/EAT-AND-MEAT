const ORDERS_KEY = 'saffron-cumin-orders'

export function saveOrder(order) {
  const orders = getOrders()
  orders.unshift({ ...order, assignedTo: null })
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function getOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Admin assigns an order to a delivery partner by their partner id.
export function assignOrder(orderId, partnerId) {
  const orders = getOrders().map((o) =>
    o.orderId === orderId ? { ...o, assignedTo: partnerId, manualStatus: 'preparing' } : o
  )
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function getOrdersForPartner(partnerId) {
  return getOrders().filter((o) => o.assignedTo === partnerId)
}

// Admin / delivery partner dashboards can manually push an order's status
// forward — this overrides the automatic time-based simulation below.
export function setOrderStatus(orderId, status) {
  const orders = getOrders().map((o) => (o.orderId === orderId ? { ...o, manualStatus: status } : o))
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

// Demo status simulation — real status would come from a backend.
// Placed -> Preparing (20%) -> Out for Delivery (60%) -> Delivered (100% of ETA)
// A manualStatus set by admin/delivery always takes priority.
export function getOrderStatus(order) {
  if (order.manualStatus) return order.manualStatus

  const placedAt = new Date(order.placedAt).getTime()
  const now = Date.now()
  const minutesElapsed = (now - placedAt) / 60000
  const etaMinutes = order.etaMinutes || 45

  if (minutesElapsed >= etaMinutes) return 'delivered'
  if (minutesElapsed >= etaMinutes * 0.6) return 'dispatched'
  if (minutesElapsed >= etaMinutes * 0.2) return 'preparing'
  return 'placed'
}
