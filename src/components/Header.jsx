import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../auth'
import { useLoginModal } from '../context/LoginModalContext'
import { useCartDrawer } from '../context/CartDrawerContext'
import { useProfileModal } from '../context/ProfileModalContext'

const TABS = [
  { id: 'home', label: 'Home', icon: 'home', path: '/' },
  { id: 'cart', label: 'Cart', icon: 'shopping_cart', path: null },
]

export default function Header({ cartCount = 0 }) {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = getCurrentUser()
  const { openLogin } = useLoginModal()
  const { openCart } = useCartDrawer()
  const { openProfile } = useProfileModal()

  // Profile tab adapts to login state: logged-out visitors get "Login"
  // (opens the role-picker modal: customer / admin / delivery partner).
  // Logged-in customers get a Profile sub-window; logged-in admins/delivery
  // partners get their own dashboard.
  const profileTab = !user
    ? { id: 'profile', label: 'Login', icon: 'login', path: null }
    : user.role === 'admin'
    ? { id: 'profile', label: 'Admin', icon: 'admin_panel_settings', path: '/admin' }
    : user.role === 'delivery'
    ? { id: 'profile', label: 'Delivery', icon: 'moped', path: '/delivery' }
    : { id: 'profile', label: 'Profile', icon: 'person', path: null }

  // "My Orders" sits right next to Profile, only for logged-in customers.
  const ordersTab =
    user && user.role !== 'admin' && user.role !== 'delivery'
      ? [{ id: 'orders', label: 'My Orders', icon: 'receipt_long', path: '/my-orders' }]
      : []

  const tabs = [...TABS, ...ordersTab, profileTab]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleTabClick = (tab) => {
    if (tab.id === 'cart') {
      openCart()
      return
    }
    if (tab.id === 'profile') {
      if (!user) openLogin()
      else if (tab.path) navigate(tab.path)
      else openProfile()
      return
    }
    if (tab.path) navigate(tab.path)
  }

  return (
    <header
      id="top-bar"
      className={`fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile h-16 bg-surface dark:bg-surface-container-high transition-all duration-300 ${
        scrolled ? 'shadow-md bg-white/95 backdrop-blur-md' : 'shadow-sm'
      }`}
    >
      <h1 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed whitespace-nowrap">
        Eat &amp; Meat
      </h1>

      <nav id="top-nav" className="flex items-center gap-1">
        {tabs.map((tab) => {
          const isActive = tab.path && location.pathname === tab.path
          return (
            <a
              key={tab.id}
              href={tab.path || '#'}
              onClick={(e) => {
                e.preventDefault()
                handleTabClick(tab)
              }}
              className={`relative flex flex-col items-center justify-center transition-all px-2.5 py-1.5 rounded-full ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              {tab.id === 'cart' && cartCount > 0 && (
                <span
                  key={cartCount}
                  className="absolute -top-0.5 -right-0.5 bg-secondary text-on-secondary text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold badge-bounce"
                >
                  {cartCount}
                </span>
              )}
              <span className="font-label-sm text-[10px] leading-tight">{tab.label}</span>
            </a>
          )
        })}
      </nav>
    </header>
  )
}
