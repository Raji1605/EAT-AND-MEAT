import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, signup, verifyCustomer, markEntered } from '../auth'
import { DELIVERY_PARTNERS } from '../deliveryPartners'
import { useLoginModal } from '../context/LoginModalContext'

const ROLES = [
  { id: 'customer', label: 'Customer', icon: 'person' },
  { id: 'admin', label: 'Admin', icon: 'admin_panel_settings' },
  { id: 'delivery', label: 'Delivery Partner', icon: 'moped' },
]

export default function LoginModal() {
  const { isOpen, closeLogin } = useLoginModal()
  const navigate = useNavigate()

  const [role, setRole] = useState('customer')
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [partnerId, setPartnerId] = useState(DELIVERY_PARTNERS[0].id)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const reset = () => {
    setRole('customer'); setMode('login'); setName(''); setPhone(''); setPassword(''); setError('')
  }

  const handleClose = () => {
    reset()
    closeLogin()
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (role === 'delivery') {
      const partner = DELIVERY_PARTNERS.find((p) => p.id === partnerId)
      login({ role: 'delivery', name: partner.name, phone: partner.phone, partnerId: partner.id })
      markEntered()
      reset()
      closeLogin()
      navigate('/delivery')
      return
    }

    if (role === 'admin') {
      if (!name.trim() || phone.trim().length < 10) {
        setError('Enter your name and a valid 10-digit phone number.')
        return
      }
      login({ role, name: name.trim(), phone: phone.trim() })
      markEntered()
      reset()
      closeLogin()
      navigate('/admin')
      return
    }

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
      login({ role: 'customer', name: result.account.name, phone: result.account.phone })
      markEntered()
      reset()
      closeLogin()
      return
    }

    const result = verifyCustomer({ phone: phone.trim(), password: password.trim() })
    if (!result.ok) {
      setError(result.error)
      return
    }
    login({ role: 'customer', name: result.account.name, phone: result.account.phone })
    markEntered()
    reset()
    closeLogin()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-on-surface/50 backdrop-blur-[2px] z-[85] fade-slide-in"
        style={{ animationDuration: '0.2s' }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-start sm:items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto my-6 sm:my-auto pop-in">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Gradient header */}
            <div className="relative bg-gradient-to-br from-primary to-[#8f0d0a] px-lg pt-lg pb-10 text-center">
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-white text-lg">close</span>
              </button>
              <div className="w-14 h-14 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center mx-auto mb-sm">
                <span className="material-symbols-outlined text-white text-2xl">
                  {role === 'admin' ? 'admin_panel_settings' : role === 'delivery' ? 'moped' : 'person'}
                </span>
              </div>
              <h1 className="font-headline-sm text-headline-sm text-white">Eat &amp; Meat</h1>
              <p className="text-white/80 text-label-sm mt-1">
                {role === 'customer'
                  ? mode === 'signup' ? 'Create your account' : 'Welcome back'
                  : 'Sign in to continue'}
              </p>
            </div>

            {/* Card body, overlapping the gradient slightly */}
            <div className="px-lg pb-lg -mt-6">
              <div className="bg-white rounded-xl shadow-sm p-4">
                {/* Role tabs */}
                <div className="grid grid-cols-3 gap-2 mb-md">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => { setRole(r.id); setError(''); setMode('login') }}
                      className={`flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-lg border text-[11px] font-label-sm text-center leading-tight min-h-[64px] transition-all ${
                        role === r.id
                          ? 'border-primary bg-primary-fixed/40 text-primary scale-[1.02]'
                          : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{r.icon}</span>
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>

                {role === 'customer' && (
                  <div className="flex bg-surface-container-low rounded-lg p-1 mb-md">
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setError('') }}
                      className={`flex-1 py-2 rounded-md font-label-sm transition-colors ${
                        mode === 'login' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      type="button"
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
                    className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md shadow-md active:scale-95 hover:brightness-110 transition-all"
                  >
                    {role === 'admin'
                      ? 'Go to Admin Dashboard'
                      : role === 'delivery'
                      ? 'Go to Delivery Dashboard'
                      : mode === 'signup' ? 'Create Account' : 'Login'}
                  </button>
                </form>

                <p className="text-center text-on-surface-variant text-label-sm mt-md">
                  Demo login — OTP / real password hashing would go here with a backend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
