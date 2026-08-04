// Demo/static data for the "Our Store" trust section. Reviews and the lab
// report are placeholders — swap for real review + lab data when available.

export const STORE_REVIEWS = [
  {
    name: 'Priya Raghunathan',
    rating: 5,
    comment: 'Tastes exactly like home-ground masala. The chicken masala blend is unreal in a curry.',
  },
  {
    name: 'Arun Kumaresan',
    rating: 4,
    comment: 'Fresh chicken, well packed, and delivered fast. My go-to for weekend biryani now.',
  },
  {
    name: 'Divya Shanmugam',
    rating: 5,
    comment: "Finally a masala brand that isn't loaded with preservatives. You can smell the difference.",
  },
]

export const STORE_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=600&q=80',
    caption: 'Storefront on Market Street',
  },
  {
    url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80',
    caption: 'Spice grinding in progress',
  },
  {
    url: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&q=80',
    caption: 'Fresh cuts, prepped daily',
  },
]

// This is a clearly-labeled SAMPLE/DEMO report — there is no live lab
// integration yet. Replace with a real report reference once available.
export const SAMPLE_LAB_REPORT = {
  reference: 'SC-LAB-2026-0417',
  issuedBy: 'Demo Reference Lab (sample data)',
  summary: 'No harmful bacteria, pesticide residue within safe limits, moisture content normal.',
  isSample: true,
}
