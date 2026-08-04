import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Cart from './pages/Cart'
import CategoryPage from './pages/CategoryPage'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Profile from './pages/Profile'
import MyOrders from './pages/MyOrders'
import ProductDetail from './pages/ProductDetail'
import AdminDashboard from './pages/AdminDashboard'
import DeliveryDashboard from './pages/DeliveryDashboard'
import { ProductModalProvider } from './context/ProductModalContext'
import ProductQuickView from './components/ProductQuickView'
import { LoginModalProvider } from './context/LoginModalContext'
import LoginModal from './components/LoginModal'
import { CartDrawerProvider } from './context/CartDrawerContext'
import CartDrawer from './components/CartDrawer'
import { ProfileModalProvider } from './context/ProfileModalContext'
import ProfileModal from './components/ProfileModal'

export default function App() {
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')

  // Adds item to cart, or increments quantity if it's already there.
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id)
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p))
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  // Removes an item entirely, regardless of quantity.
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id))
  }

  // Increases/decreases quantity; removes item if it drops to 0.
  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: p.qty + delta } : p))
        .filter((p) => p.qty > 0)
    )
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  const clearCart = () => setCart([])

  return (
    <LoginModalProvider>
      <ProfileModalProvider>
      <CartDrawerProvider>
      <ProductModalProvider addToCart={addToCart}>
        <Routes>
          <Route
            path="/"
            element={
              <Landing
                cartCount={cartCount}
                search={search}
                setSearch={setSearch}
                addToCart={addToCart}
              />
            }
          />

          <Route
            path="/category/:categoryId"
            element={<CategoryPage cartCount={cartCount} addToCart={addToCart} />}
          />

          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                removeFromCart={removeFromCart}
                updateQty={updateQty}
              />
            }
          />

          <Route
            path="/checkout"
            element={<Checkout cart={cart} clearCart={clearCart} />}
          />

          <Route path="/order-success" element={<OrderSuccess />} />

          <Route path="/profile" element={<Profile cartCount={cartCount} addToCart={addToCart} />} />

          <Route path="/my-orders" element={<MyOrders cartCount={cartCount} addToCart={addToCart} />} />

          <Route
            path="/product/:productId"
            element={<ProductDetail cartCount={cartCount} addToCart={addToCart} />}
          />

          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/delivery" element={<DeliveryDashboard />} />
        </Routes>

        <ProductQuickView />
        <CartDrawer cart={cart} removeFromCart={removeFromCart} updateQty={updateQty} />
        <ProfileModal />
      </ProductModalProvider>
      </CartDrawerProvider>
      </ProfileModalProvider>

      <LoginModal />
    </LoginModalProvider>
  )
}
