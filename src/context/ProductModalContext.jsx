import { createContext, useContext, useState } from 'react'

const ProductModalContext = createContext(null)

export function ProductModalProvider({ children, addToCart }) {
  const [openProductId, setOpenProductId] = useState(null)

  const openProduct = (id) => setOpenProductId(id)
  const closeProduct = () => setOpenProductId(null)

  return (
    <ProductModalContext.Provider value={{ openProductId, openProduct, closeProduct, addToCart }}>
      {children}
    </ProductModalContext.Provider>
  )
}

export function useProductModal() {
  const ctx = useContext(ProductModalContext)
  if (!ctx) throw new Error('useProductModal must be used inside ProductModalProvider')
  return ctx
}
