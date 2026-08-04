import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import FssaiBadge from '../components/FssaiBadge'
import {
  getCurrentUser, logout, updateProfile,
  getAddresses, addAddress, removeAddress,
} from '../auth'
import { BUSINESS_INFO } from '../businessInfo'
import { useLoginModal } from '../context/LoginModalContext'

const MENU_ROWS = [
  { id: 'help', label: 'Help & Support', icon: 'support_agent' },
  { id: 'payments', label: 'Payment Methods', icon: 'credit_card' },
  { id: 'about', label: `About ${BUSINESS_INFO.name}`, icon: 'info' },
]

export default function Profile({ cartCount, addToCart }) {
  const navigate = useNavigate()
  const { openLogin } = useLoginModal()
  const [user, setUser] = useState(getCurrentUser())

  const [openMenu, setOpenMenu] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editEmail, setEditEmail] = useState('')

  const [addresses, setAddresses] = useState([])
  const [addingAddress, setAddingAddress] = useState(false)
  const [newAddrLabel, setNewAddrLabel] = useState('Home')
  const [newAddrText, setNewAddrText] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/')
      openLogin()
    }
  }, [user, navigate])

  useEffect(() => {
    if (user) setAddresses(getAddresses(user.phone))
  }, [user])

  const handleLogout = () => {
    logout()
    setUser(null)
  }

  const openEdit = () => {
    setEditName(user.name || '')
    setEditPhone(user.phone || '')
    setEditEmail(user.email || '')
    setEditing(true)
  }

  const saveEdit = () => {
    if (!editName.trim() || editPhone.trim().length < 10) return
    const updated = updateProfile({ name: editName.trim(), phone: editPhone.trim(), email: editEmail.trim() })
    setUser(updated)
    setEditing(false)
  }

  const handleAddAddress = () => {
    if (!newAddrText.trim()) return
    const entry = addAddress(user.phone, { label: newAddrLabel, text: newAddrText.trim() })
    setAddresses((prev) => [...prev, entry])
    setNewAddrText('')
    setAddingAddress(false)
  }

  const handleRemoveAddress = (id) => {
    removeAddress(user.phone, id)
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  if (!user) return null

  return (
    <div className="bg-gradient-to-b from-primary-fixed/25 via-surface to-surface text-on-surface min-h-screen">
      <Header cartCount={cartCount || 0} />

      <main className="pt-20 pb-10 px-margin-mobile max-w-2xl mx-auto">
        {/* Customer details */}
        <div className="bg-gradient-to-br from-primary to-[#8f0d0a] rounded-2xl p-lg text-white mb-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">person</span>
              </div>
              <div>
                <h1 className="font-headline-sm text-headline-sm">{user.name}</h1>
                <p className="text-white/80 text-label-sm">{user.phone}</p>
                {user.email && <p className="text-white/70 text-label-sm">{user.email}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => navigate('/my-orders')}
                className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center"
                aria-label="My Orders"
              >
                <span className="material-symbols-outlined text-lg">receipt_long</span>
              </button>
              <button
                onClick={openEdit}
                className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            </div>
          </div>

          {/* Inline edit form */}
          {editing && (
            <div className="mt-lg bg-white/10 rounded-xl p-md space-y-2.5">
              <input
                className="w-full bg-white/95 text-on-surface rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-white/40"
                placeholder="Full Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <input
                className="w-full bg-white/95 text-on-surface rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-white/40"
                placeholder="Phone Number"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
              <input
                className="w-full bg-white/95 text-on-surface rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-white/40"
                placeholder="Email (optional)"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
              <div className="flex gap-2 pt-1">
                <button
                  onClick={saveEdit}
                  className="flex-1 py-2.5 rounded-lg bg-white text-primary font-label-md"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2.5 rounded-lg bg-white/15 text-white font-label-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Saved addresses */}
        <div className="mb-xl">
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Saved Addresses</h2>
            <button
              onClick={() => setAddingAddress((v) => !v)}
              className="flex items-center gap-1 text-primary font-label-sm"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Add New
            </button>
          </div>

          {addingAddress && (
            <div className="bg-surface-container-low rounded-xl p-md border border-surface-container mb-3 space-y-2.5">
              <div className="flex gap-2">
                {['Home', 'Work', 'Other'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setNewAddrLabel(l)}
                    className={`px-3 py-1.5 rounded-full text-label-sm border ${
                      newAddrLabel === l
                        ? 'bg-primary text-on-primary border-primary'
                        : 'border-outline-variant text-on-surface-variant'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <textarea
                className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                rows={2}
                placeholder="House / street / area / landmark"
                value={newAddrText}
                onChange={(e) => setNewAddrText(e.target.value)}
              />
              <button
                onClick={handleAddAddress}
                className="w-full py-2.5 rounded-lg bg-primary text-on-primary font-label-md"
              >
                Save Address
              </button>
            </div>
          )}

          {addresses.length === 0 && !addingAddress ? (
            <p className="text-on-surface-variant font-label-sm">No saved addresses yet.</p>
          ) : (
            <div className="space-y-2">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-start justify-between bg-surface-container-low rounded-xl p-md border border-surface-container"
                >
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">
                      {addr.label === 'Work' ? 'work' : addr.label === 'Home' ? 'home' : 'location_on'}
                    </span>
                    <div>
                      <p className="font-label-md text-on-surface">{addr.label}</p>
                      <p className="text-on-surface-variant text-label-sm">{addr.text}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveAddress(addr.id)}
                    className="text-on-surface-variant/60 hover:text-error"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick menu — help, payments, about */}
        <div className="bg-surface-container-low rounded-xl border border-surface-container divide-y divide-surface-container mb-lg overflow-hidden">
          {MENU_ROWS.map((row) => {
            const isOpen = openMenu === row.id
            return (
              <div key={row.id}>
                <button
                  onClick={() => setOpenMenu(isOpen ? null : row.id)}
                  className="w-full flex items-center justify-between p-md hover:bg-surface transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">{row.icon}</span>
                    <span className="font-label-md text-on-surface">{row.label}</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant/50 text-lg">
                    {isOpen ? 'expand_less' : 'chevron_right'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-md pb-md">
                    {row.id === 'help' && (
                      <div className="bg-surface rounded-lg p-md border border-surface-container space-y-3">
                        <a
                          href={`tel:${BUSINESS_INFO.phone.replace(/\s/g, '')}`}
                          className="flex items-center gap-3 text-on-surface"
                        >
                          <span className="material-symbols-outlined text-primary text-lg">call</span>
                          <span className="font-label-sm">{BUSINESS_INFO.phone}</span>
                        </a>
                        <a
                          href={`https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[^\d]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 text-on-surface"
                        >
                          <span className="material-symbols-outlined text-primary text-lg">chat</span>
                          <span className="font-label-sm">Chat on WhatsApp</span>
                        </a>
                        <a
                          href={`mailto:${BUSINESS_INFO.email}`}
                          className="flex items-center gap-3 text-on-surface"
                        >
                          <span className="material-symbols-outlined text-primary text-lg">mail</span>
                          <span className="font-label-sm">{BUSINESS_INFO.email}</span>
                        </a>
                        <p className="text-on-surface-variant text-label-sm pt-1 border-t border-surface-container">
                          Support hours: {BUSINESS_INFO.hours}
                        </p>
                      </div>
                    )}

                    {row.id === 'payments' && (
                      <div className="bg-surface rounded-lg p-md border border-surface-container space-y-3">
                        {[
                          { icon: 'payments', label: 'Cash on Delivery' },
                          { icon: 'account_balance_wallet', label: 'UPI (GPay, PhonePe, Paytm)' },
                          { icon: 'credit_card', label: 'Credit / Debit Card' },
                        ].map((m) => (
                          <div key={m.label} className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-lg">{m.icon}</span>
                            <span className="font-label-sm text-on-surface">{m.label}</span>
                          </div>
                        ))}
                        <p className="text-on-surface-variant text-label-sm pt-1 border-t border-surface-container">
                          You choose your payment method at checkout for every order.
                        </p>
                      </div>
                    )}

                    {row.id === 'about' && (
                      <div className="bg-surface rounded-lg p-md border border-surface-container">
                        <p className="text-on-surface-variant font-body-md mb-md">
                          Your neighborhood destination for farm-fresh chicken and premium, stone-ground masalas.
                          Run by {BUSINESS_INFO.owner}, serving Coimbatore since 1948, and proudly supporting local
                          women artisans in our spice-grinding collective.
                        </p>
                        <div className="space-y-2 text-label-sm text-on-surface-variant">
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-primary text-base">location_on</span>
                            <span>{BUSINESS_INFO.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-base">schedule</span>
                            <span>{BUSINESS_INFO.hours}</span>
                          </div>
                        </div>
                        <div className="mt-md">
                          <FssaiBadge />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
