import { products } from './data'

const STOCK_KEY = 'saffron-cumin-stock'

function defaultStock() {
  const map = {}
  products.forEach((p) => {
    map[p.id] = p.stock ?? 20
  })
  return map
}

export function getStockMap() {
  try {
    const raw = localStorage.getItem(STOCK_KEY)
    if (!raw) {
      const initial = defaultStock()
      localStorage.setItem(STOCK_KEY, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  } catch {
    return defaultStock()
  }
}

export function getStock(productId) {
  const map = getStockMap()
  return map[productId] ?? 0
}

export function setStock(productId, qty) {
  const map = getStockMap()
  map[productId] = Math.max(0, qty)
  localStorage.setItem(STOCK_KEY, JSON.stringify(map))
}

export function decrementStock(productId, qty = 1) {
  const map = getStockMap()
  map[productId] = Math.max(0, (map[productId] ?? 0) - qty)
  localStorage.setItem(STOCK_KEY, JSON.stringify(map))
}
