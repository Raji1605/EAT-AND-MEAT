export default function WomenEmpowermentBanner() {
  return (
    <section className="mt-xl px-margin-mobile">
      <div className="max-w-container-max mx-auto bg-gradient-to-br from-secondary/15 to-primary-fixed/40 rounded-2xl p-lg flex flex-col md:flex-row items-center gap-lg border border-secondary/20">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-primary text-3xl">volunteer_activism</span>
        </div>
        <div className="text-center md:text-left">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1.5">
            Proudly Empowering Women
          </h3>
          <p className="text-on-surface-variant font-body-md">
            We're a women-driven business — our spices are stone-ground by a local women's
            collective, and every single order is delivered to your door by our team of women
            delivery partners. Every purchase supports their livelihood.
          </p>
        </div>
      </div>
    </section>
  )
}
