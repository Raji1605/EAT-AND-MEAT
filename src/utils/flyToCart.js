// Animates a small clone of the product image flying from its source element
// (usually the "Add to Cart" button) into the header cart icon, then makes
// the cart icon bump. Falls back silently if either element isn't found.
export function flyToCart(imageUrl, sourceEl) {
  const cartBtn = document.getElementById('cart-icon-btn')
  if (!cartBtn || !sourceEl || !imageUrl) return

  const startRect = sourceEl.getBoundingClientRect()
  const endRect = cartBtn.getBoundingClientRect()

  const flyer = document.createElement('img')
  flyer.src = imageUrl
  flyer.style.position = 'fixed'
  flyer.style.left = `${startRect.left + startRect.width / 2 - 24}px`
  flyer.style.top = `${startRect.top + startRect.height / 2 - 24}px`
  flyer.style.width = '48px'
  flyer.style.height = '48px'
  flyer.style.objectFit = 'cover'
  flyer.style.borderRadius = '10px'
  flyer.style.zIndex = '9999'
  flyer.style.pointerEvents = 'none'
  flyer.style.boxShadow = '0 4px 14px rgba(0,0,0,0.25)'
  flyer.style.transition = 'left 0.65s cubic-bezier(.35,.02,.62,1), top 0.65s cubic-bezier(.35,.02,.62,1), width 0.65s ease, height 0.65s ease, opacity 0.3s ease 0.4s'
  document.body.appendChild(flyer)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flyer.style.left = `${endRect.left + endRect.width / 2 - 8}px`
      flyer.style.top = `${endRect.top + endRect.height / 2 - 8}px`
      flyer.style.width = '16px'
      flyer.style.height = '16px'
      flyer.style.opacity = '0.2'
    })
  })

  setTimeout(() => {
    flyer.remove()
    cartBtn.classList.add('cart-bump')
    setTimeout(() => cartBtn.classList.remove('cart-bump'), 450)
  }, 650)
}
