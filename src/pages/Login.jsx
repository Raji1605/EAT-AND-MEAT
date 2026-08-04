import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { login, signup, verifyCustomer, markEntered } from '../auth'
import { DELIVERY_PARTNERS } from '../deliveryPartners'

const ROLES = [
  { id: 'customer', label: 'Customer', icon: 'person' },
  { id: 'admin', label: 'Admin', icon: 'admin_panel_settings' },
  { id: 'delivery', label: 'Delivery Partner', icon: 'moped' },
]

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'

  const [role, setRole] = useState('customer')
  const [mode, setMode] = useState('login') // 'login' | 'signup' (customer only)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [partnerId, setPartnerId] = useState(DELIVERY_PARTNERS[0].id)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (role === 'delivery') {
      const partner = DELIVERY_PARTNERS.find((p) => p.id === partnerId)
      login({ role: 'delivery', name: partner.name, phone: partner.phone, partnerId: partner.id })
      markEntered()
      navigate('/delivery')
      return
    }

    if (role === 'admin') {
      if (!name.trim() || phone.trim().length < 10) {
        setError('Enter your name and a valid 10-digit phone number.')
        return
      }
      setError('')
      login({ role, name: name.trim(), phone: phone.trim() })
      markEntered()
      navigate('/admin')
      return
    }

    // Customer flow: real create-account / login against saved accounts.
    if (phone.trim().length < 10) {
      setError('Enter a valid 10-digit phone number.')
      return
    }
    if (password.trim().length < 4) {
      setError('Password must be at least 4 characters.')
      return
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Enter your full name.')
        return
      }
      const result = signup({ name: name.trim(), phone: phone.trim(), password: password.trim() })
      if (!result.ok) {
        setError(result.error)
        setMode('login')
        return
      }
      setError('')
      login({ role: 'customer', name: result.account.name, phone: result.account.phone })
      markEntered()
      navigate(redirectTo)
      return
    }

    // login mode
    const result = verifyCustomer({ phone: phone.trim(), password: password.trim() })
    if (!result.ok) {
      setError(result.error)
      return
    }
    setError('')
    login({ role: 'customer', name: result.account.name, phone: result.account.phone })
    markEntered()
    navigate(redirectTo)
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center px-margin-mobile">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-surface-container p-lg">
        <div className="text-center mb-lg">
          <h1 className="font-headline-sm text-headline-sm text-primary mb-1">Eat &amp; Meat</h1>
          <p className="text-on-surface-variant font-label-sm">
            {role === 'customer'
              ? mode === 'signup' ? 'Create your account' : 'Login to your account'
              : 'Sign in to continue'}
          </p>
        </div>

        {/* Role tabs */}
        <div className="grid grid-cols-3 gap-2 mb-lg">
          {ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => { setRole(r.id); setError(''); setMode('login') }}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-lg border text-[11px] font-label-sm transition-colors ${
                role === r.id
                  ? 'border-primary bg-primary-fixed/40 text-primary'
                  : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>

        {/* Login / Create account toggle — customers only */}
        {role === 'customer' && (
          <div className="flex bg-surface-container-low rounded-lg p-1 mb-lg">
            <button
              onClick={() => { setMode('login'); setError('') }}
              className={`flex-1 py-2 rounded-md font-label-sm transition-colors ${
                mode === 'login' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('signup'); setError('') }}
              className={`flex-1 py-2 rounded-md font-label-sm transition-colors ${
                mode === 'signup' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {role === 'delivery' ? (
            <div>
              <label className="text-label-sm text-on-surface-variant mb-1.5 block">Select Your Profile</label>
              <select
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {DELIVERY_PARTNERS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — {p.phone}</option>
                ))}
              </select>
            </div>
          ) : role === 'admin' ? (
            <>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          ) : (
            <>
              {mode === 'signup' && (
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                type="password"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}

          {error && <p className="text-error font-label-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md shadow-md active:scale-95 transition-all"
          >
            {role === 'admin'
              ? 'Go to Admin Dashboard'
              : role === 'delivery'
              ? 'Go to Delivery Dashboard'
              : mode === 'signup' ? 'Create Account' : 'Login'}
          </button>
        </form>

        <p className="text-center text-on-surface-variant text-label-sm mt-lg">
          Demo login — OTP / real password hashing would go here with a backend.
        </p>

        <button
          onClick={() => { markEntered(); navigate('/') }}
          className="w-full text-center text-primary font-label-sm mt-md hover:underline"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  )
}
