import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, markEntered } from '../auth'
import Home from './Home'

// The storefront (Home/Shop/Cart/Profile) is open to everyone — no forced
// login gate. Customers, admins, and delivery partners all sign in via the
// "Profile" tab in the header, which is where Login.jsx lives. Logged-in
// admins/delivery partners get bounced straight to their own dashboards.
export default function Landing({ cartCount, search, setSearch, addToCart }) {
  const navigate = useNavigate()
  const user = getCurrentUser()

  useEffect(() => {
    markEntered()
    if (user?.role === 'admin') navigate('/admin', { replace: true })
    else if (user?.role === 'delivery') navigate('/delivery', { replace: true })
  }, [user])

  if (user?.role === 'admin' || user?.role === 'delivery') return null

  return <Home cartCount={cartCount} search={search} setSearch={setSearch} addToCart={addToCart} />
}
