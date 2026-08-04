import { createContext, useContext, useState } from 'react'

const LoginModalContext = createContext(null)

export function LoginModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const openLogin = () => setIsOpen(true)
  const closeLogin = () => setIsOpen(false)

  return (
    <LoginModalContext.Provider value={{ isOpen, openLogin, closeLogin }}>
      {children}
    </LoginModalContext.Provider>
  )
}

export function useLoginModal() {
  const ctx = useContext(LoginModalContext)
  if (!ctx) throw new Error('useLoginModal must be used inside LoginModalProvider')
  return ctx
}
