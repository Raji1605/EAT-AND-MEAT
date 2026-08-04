// Demo roster of delivery partners. A real backend would let admins
// add/remove partners; here it's a fixed list for the demo.
export const DELIVERY_PARTNERS = [
  { id: 'dp-1', name: 'Kavitha R', phone: '+91 90000 11111' },
  { id: 'dp-2', name: 'Meena S', phone: '+91 90000 22222' },
  { id: 'dp-3', name: 'Lakshmi K', phone: '+91 90000 33333' },
]

export function getPartnerById(id) {
  return DELIVERY_PARTNERS.find((p) => p.id === id) || null
}
