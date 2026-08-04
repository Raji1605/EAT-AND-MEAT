import { useNavigate } from 'react-router-dom'
import { BUSINESS_INFO } from '../businessInfo'
import { useCartDrawer } from '../context/CartDrawerContext'

export default function Footer() {
  const navigate = useNavigate()
  const { openCart } = useCartDrawer()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-lg bg-surface-container-high">
      <div className="px-margin-mobile py-lg max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 gap-lg">
        <div className="col-span-2 md:col-span-1">
          <h4 className="font-headline-sm text-headline-sm text-primary mb-xs">Eat &amp; Meat</h4>
          <p className="text-on-surface-variant font-label-sm text-label-sm">
            Fresh Chicken &amp; Premium Masalas — Est. 1948
          </p>
        </div>

        <div>
          <h5 className="font-label-md text-on-surface mb-sm">Quick Links</h5>
          <ul className="space-y-1.5 text-label-sm text-on-surface-variant">
            <li><button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Home</button></li>
            <li><button onClick={() => openCart()} className="hover:text-primary transition-colors">Cart</button></li>
            <li><button onClick={() => navigate('/my-orders')} className="hover:text-primary transition-colors">My Orders</button></li>
          </ul>
        </div>

        <div>
          <h5 className="font-label-md text-on-surface mb-sm">Contact Us</h5>
          <ul className="space-y-1.5 text-label-sm text-on-surface-variant">
            <li className="flex items-start gap-1.5">
              <span className="material-symbols-outlined text-sm mt-0.5">call</span>
              <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-primary transition-colors">
                {BUSINESS_INFO.phone}
              </a>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="material-symbols-outlined text-sm mt-0.5">mail</span>
              <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-primary transition-colors">
                {BUSINESS_INFO.email}
              </a>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="material-symbols-outlined text-sm mt-0.5">location_on</span>
              <span>{BUSINESS_INFO.address}</span>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-label-md text-on-surface mb-sm">Store Hours</h5>
          <p className="text-label-sm text-on-surface-variant mb-md">{BUSINESS_INFO.hours}</p>
          <h5 className="font-label-md text-on-surface mb-sm mt-md">Follow Us</h5>
          <div className="flex gap-2">
            <a
              href={BUSINESS_INFO.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-fixed/40 transition-colors"
            >
              <span className="material-symbols-outlined text-base">thumb_up</span>
            </a>
            <a
              href={BUSINESS_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-fixed/40 transition-colors"
            >
              <span className="material-symbols-outlined text-base">photo_camera</span>
            </a>
            <a
              href={BUSINESS_INFO.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-fixed/40 transition-colors"
            >
              <span className="material-symbols-outlined text-base">alternate_email</span>
            </a>
            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-fixed/40 transition-colors"
            >
              <span className="material-symbols-outlined text-base">chat</span>
            </a>
            <a
              href={BUSINESS_INFO.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-fixed/40 transition-colors"
            >
              <span className="material-symbols-outlined text-base">smart_display</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-surface-container px-margin-mobile py-md">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-on-surface-variant font-label-sm text-label-sm text-center md:text-left">
            © {year} Eat &amp; Meat. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-sm text-primary">verified</span>
            FSSAI Lic. No. {BUSINESS_INFO.fssai}
          </div>
        </div>
      </div>
    </footer>
  )
}
