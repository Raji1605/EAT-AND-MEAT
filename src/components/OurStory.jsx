export default function OurStory() {
  return (
    <section className="mt-xl px-margin-mobile py-xl bg-surface-container-low rounded-t-[40px]">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center gap-lg">
        <div className="w-full md:w-1/2 relative">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <div
              className="bg-cover bg-center w-full h-full"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfLe1qSM2s__efUcxafcD64lZRdk2wwDIABtsi6nD4uGrvYYb9J5Wxr_uYBqoTDT2KNO6HmuO7FBhz5c7X_rqiePznyHImUxXrXf42ladz3aaddAGiiZFUSElqm6Igu92sv_RMWazFLpBdNu9CdAN4smVgr31VM8_C8zMjwBvM5S5wxhBseGc_FDeFK1Ta-uZ-I2-XfKr_xidFOFtFE9pTCoiPNYaqVSL0yo9XI_RAjN7E9iN2iyYDVQ')",
              }}
            />
          </div>
          <div className="absolute -bottom-6 -right-4 bg-secondary text-on-secondary p-md rounded-xl shadow-lg">
            <p className="font-headline-sm text-headline-sm leading-tight">75+</p>
            <p className="font-label-sm text-label-sm">Years of Purity</p>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-md">
            Crafted with Tradition, Delivered with Care
          </h3>
          <p className="text-on-surface-variant font-body-lg mb-lg">
            From the sun-drenched fields of Malabar to your kitchen, our journey is one of passion and
            purity. We still use traditional stone grinders to ensure every gram of spice retains its
            essential oils and vibrant color.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">verified</span>
              </div>
              <span className="font-label-md text-on-surface">100% Organic &amp; Preservative-Free</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">eco</span>
              </div>
              <span className="font-label-md text-on-surface">Sustainably Sourced Directly from Farmers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
