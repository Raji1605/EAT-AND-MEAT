// Demo coupon system. There's no backend validating real coupon codes yet,
// so — by design, for this demo — ANY non-empty code the shopper enters is
// accepted and gives a flat 10% off. SPICE10 is just the code we advertise
// on the product detail page; typing something else works too.
//
// To move to real per-code / per-category rules later, swap the body of
// applyCoupon() for a lookup against a real coupon table/API.

export const FEATURED_COUPON = {
  code: 'SPICE10',
  label: '10% off',
  description: 'Use code SPICE10 for 10% off your order',
}

export const DEMO_DISCOUNT_RATE = 0.1

export function applyCoupon(code) {
  const trimmed = (code || '').trim()
  if (!trimmed) {
    return { valid: false, discountRate: 0, message: 'Enter a coupon code.' }
  }
  return {
    valid: true,
    discountRate: DEMO_DISCOUNT_RATE,
    message: `"${trimmed.toUpperCase()}" applied — 10% off (demo mode: any code works).`,
  }
}
