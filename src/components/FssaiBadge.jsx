import { BUSINESS_INFO } from '../businessInfo'

export default function FssaiBadge() {
  return (
    <div className="bg-white rounded-xl border-2 border-dashed border-primary/30 p-md flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-600 flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-green-600 text-2xl">verified</span>
      </div>
      <div className="flex-1">
        <p className="font-label-md text-on-surface flex items-center gap-1.5">
          FSSAI Certified
          <span className="text-green-600 text-[10px] font-bold bg-green-50 px-1.5 py-0.5 rounded">
            VERIFIED
          </span>
        </p>
        <p className="text-on-surface-variant text-label-sm">
          License No. {BUSINESS_INFO.fssai} — Food Safety and Standards Authority of India
        </p>
      </div>
    </div>
  )
}
