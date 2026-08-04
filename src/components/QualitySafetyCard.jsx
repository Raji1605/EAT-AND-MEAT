import { SAMPLE_LAB_REPORT } from '../storeTrust'
import { BUSINESS_INFO } from '../businessInfo'

export default function QualitySafetyCard() {
  return (
    <div className="bg-white rounded-2xl p-lg border border-surface-container shadow-sm">
      <h4 className="font-headline-sm text-headline-sm text-on-surface mb-md">Quality &amp; safety</h4>

      <div className="grid grid-cols-2 gap-3">
        <div className="group bg-surface-container-low rounded-xl p-md border border-surface-container hover:border-green-600/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default">
          <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-green-600 text-xl">verified</span>
          </div>
          <p className="font-label-md text-on-surface flex items-center gap-1.5 flex-wrap">
            FSSAI certified
          </p>
          <p className="text-on-surface-variant text-label-sm mt-0.5">Lic. {BUSINESS_INFO.fssai}</p>
          <span className="inline-flex items-center gap-1 text-green-700 text-[10px] font-bold bg-green-50 px-1.5 py-0.5 rounded mt-2">
            <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            VERIFIED
          </span>
        </div>

        <div className="group bg-surface-container-low rounded-xl p-md border border-surface-container hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-primary text-xl">science</span>
          </div>
          <p className="font-label-md text-on-surface">Lab tested fresh</p>
          <p className="text-on-surface-variant text-label-sm mt-0.5">Ref. {SAMPLE_LAB_REPORT.reference}</p>
          {SAMPLE_LAB_REPORT.isSample && (
            <span className="inline-flex items-center gap-1 text-secondary text-[10px] font-bold bg-secondary/10 px-1.5 py-0.5 rounded mt-2">
              SAMPLE
            </span>
          )}
        </div>
      </div>

      <p className="text-on-surface-variant/70 text-[11px] mt-md leading-relaxed">
        {SAMPLE_LAB_REPORT.summary} — issued by {SAMPLE_LAB_REPORT.issuedBy}.
      </p>
    </div>
  )
}
