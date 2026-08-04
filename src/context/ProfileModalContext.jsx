import { createContext, useContext, useState } from 'react'

const ProfileModalContext = createContext(null)

export function ProfileModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const openProfile = () => setIsOpen(true)
  const closeProfile = () => setIsOpen(false)

  return (
    <ProfileModalContext.Provider value={{ isOpen, openProfile, closeProfile }}>
      {children}
    </ProfileModalContext.Provider>
  )
}

export function useProfileModal() {
  const ctx = useContext(ProfileModalContext)
  if (!ctx) throw new Error('useProfileModal must be used inside ProfileModalProvider')
  return ctx
}
