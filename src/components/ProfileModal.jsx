import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfileModal } from '../context/ProfileModalContext'
import {
  getCurrentUser, logout, updateProfile,
  getAddresses, addAddress, removeAddress,
} from '../auth'

export default function ProfileModal() {
  const { isOpen, closeProfile } = useProfileModal()
  const navigate = useNavigate()
  const [user, setUser] = useState(getCurrentUser())

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editEmail, setEditEmail] = useState('')

  const [addresses, setAddresses] = useState([])
  const [addressPanelOpen, setAddressPanelOpen] = useState(false)
  const [newAddrLabel, setNewAddrLabel] = useState('Home')
  const [newAddrText, setNewAddrText] = useState('')

  useEffect(() => {
    if (isOpen) {
      setUser(getCurrentUser())
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setEditing(false)
      setAddressPanelOpen(false)
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (user) setAddresses(getAddresses(user.phone))
  }, [user])

  if (!isOpen || !user) return null

  const handleLogout = () => {
    logout()
    closeProfile()
    navigate('/')
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
    setAddressPanelOpen(false)
  }

  const handleRemoveAddress = (id) => {
    removeAddress(user.phone, id)
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-on-surface/50 backdrop-blur-[2px] z-[85] fade-slide-in"
        style={{ animationDuration: '0.2s' }}
        onClick={closeProfile}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center px-margin-mobile py-8 overflow-y-auto">
        <div className="w-full max-w-md my-auto pop-in">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-primary to-[#8f0d0a] px-lg py-lg text-white flex-shrink-0">
              <button
                onClick={closeProfile}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-white text-lg">close</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">person</span>
                </div>
                <div className="min-w-0">
                  <h1 className="font-headline-sm text-headline-sm truncate">{user.name}</h1>
                  <p className="text-white/80 text-label-sm truncate">{user.phone}</p>
                  {user.email && <p className="text-white/70 text-label-sm truncate">{user.email}</p>}
                </div>
              </div>

              <div className="flex gap-2 mt-md">
                <button
                  onClick={openEdit}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white font-label-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white font-label-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  Log Out
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-lg py-lg overflow-y-auto">
              {editing && (
                <div className="mb-lg bg-surface-container-low rounded-xl p-md space-y-2.5 border border-surface-container">
                  <input
                    className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Full Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <input
                    className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Phone Number"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                  <input
                    className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Email (optional)"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={saveEdit}
                      className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary font-label-md"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2.5 rounded-lg bg-surface-container text-on-surface font-label-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-md">
                <h2 className="font-label-md text-on-surface font-bold">Saved Addresses</h2>
                <button
                  onClick={() => setAddressPanelOpen(true)}
                  className="flex items-center gap-1 text-primary font-label-sm"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Add New Address
                </button>
              </div>

              {addresses.length === 0 ? (
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

              <button
                onClick={() => { closeProfile(); navigate('/my-orders') }}
                className="w-full flex items-center justify-center gap-2 mt-lg py-3 rounded-lg border border-primary text-primary font-label-md hover:bg-primary hover:text-on-primary transition-colors"
              >
                <span className="material-symbols-outlined text-base">receipt_long</span>
                View My Orders
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Address — opens as its own sub-window sliding in from the side */}
      <div
        className={`fixed inset-0 bg-on-surface/50 z-[95] transition-opacity duration-300 ${
          addressPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setAddressPanelOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[100] shadow-2xl flex flex-col transition-transform duration-300 ${
          addressPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-lg py-4 border-b border-surface-container bg-surface-container-low">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Add New Address</h3>
          <button
            onClick={() => setAddressPanelOpen(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-lg space-y-3">
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
            rows={4}
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
      </aside>
    </>
  )
}
