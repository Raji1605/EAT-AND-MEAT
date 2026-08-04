// Zone-wise delivery config. Edit areas/fees here as the business expands.
export const DELIVERY_ZONES = [
  {
    id: 'zone-a',
    label: 'Zone A — Nearby',
    areas: 'R.S. Puram, Gandhipuram, Town Hall',
    fee: 0,
    etaMinutes: 45,
  },
  {
    id: 'zone-b',
    label: 'Zone B — Mid Range',
    areas: 'Peelamedu, Saibaba Colony, Ram Nagar',
    fee: 30,
    etaMinutes: 75,
  },
  {
    id: 'zone-c',
    label: 'Zone C — Outskirts',
    areas: 'Saravanampatti, Vadavalli, Kovaipudur',
    fee: 60,
    etaMinutes: 120,
  },
]

export function getZoneById(id) {
  return DELIVERY_ZONES.find((z) => z.id === id) || null
}
