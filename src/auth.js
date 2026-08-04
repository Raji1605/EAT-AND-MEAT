// DEMO auth — no real backend/password hashing. Good enough to demo the
// UI flow (login state, role-based dashboards). A real launch needs
// proper server-side auth (JWT, hashed passwords, role checks, etc).
const USER_KEY = 'saffron-cumin-user'
const ACCOUNTS_KEY = 'saffron-cumin-accounts'

function getAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

// Create a new customer account. Returns { ok, error }.
export function signup({ name, phone, password }) {
  const accounts = getAccounts()
  if (accounts.some((a) => a.phone === phone)) {
    return { ok: false, error: 'An account with this phone number already exists. Please login.' }
  }
  const account = { name, phone, password, createdAt: new Date().toISOString() }
  saveAccounts([...accounts, account])
  return { ok: true, account }
}

// Verify a customer login against created accounts. Returns { ok, error, account }.
export function verifyCustomer({ phone, password }) {
  const accounts = getAccounts()
  const account = accounts.find((a) => a.phone === phone)
  if (!account) return { ok: false, error: 'No account found for this phone number. Please create an account.' }
  if (account.password !== password) return { ok: false, error: 'Incorrect password.' }
  return { ok: true, account }
}

export function login({ role, name, phone, partnerId }) {
  const user = { role, name, phone, partnerId: partnerId || null, loggedInAt: new Date().toISOString() }
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

// Update the logged-in user's own details (name/phone/email), and keep the
// matching account record in sync so future logins reflect the new info.
export function updateProfile(updates) {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  const current = JSON.parse(raw)
  const updated = { ...current, ...updates }
  localStorage.setItem(USER_KEY, JSON.stringify(updated))

  const accounts = getAccounts()
  const idx = accounts.findIndex((a) => a.phone === current.phone)
  if (idx !== -1) {
    accounts[idx] = { ...accounts[idx], ...updates }
    saveAccounts(accounts)
  }
  return updated
}

// Saved delivery addresses, keyed per-user by phone number.
const ADDRESSES_KEY = 'saffron-cumin-addresses'

function getAllAddresses() {
  try {
    const raw = localStorage.getItem(ADDRESSES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function getAddresses(phone) {
  return getAllAddresses()[phone] || []
}

export function addAddress(phone, address) {
  const all = getAllAddresses()
  const list = all[phone] || []
  const entry = { id: `addr_${Date.now()}`, ...address }
  all[phone] = [...list, entry]
  localStorage.setItem(ADDRESSES_KEY, JSON.stringify(all))
  return entry
}

export function removeAddress(phone, id) {
  const all = getAllAddresses()
  all[phone] = (all[phone] || []).filter((a) => a.id !== id)
  localStorage.setItem(ADDRESSES_KEY, JSON.stringify(all))
}

export function logout() {
  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem('saffron-cumin-entered')
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Tracks whether this browser session has passed the login/landing gate
// (either by logging in, or choosing "Continue as Guest"). Resets when
// the browser tab is closed — a fresh visit shows the login page again.
const ENTERED_KEY = 'saffron-cumin-entered'

export function markEntered() {
  sessionStorage.setItem(ENTERED_KEY, 'true')
}

export function hasEntered() {
  return sessionStorage.getItem(ENTERED_KEY) === 'true'
}
