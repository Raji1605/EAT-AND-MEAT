import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import OurStory from '../components/OurStory'
import WomenEmpowermentBanner from '../components/WomenEmpowermentBanner'
import WhyChooseUs from '../components/WhyChooseUs'
import OurProcess from '../components/OurProcess'
import QualityHygiene from '../components/QualityHygiene'
import ContactLocation from '../components/ContactLocation'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'

// About-the-company page — moved here from Home so the homepage stays
// focused on products, while this page holds everything about who we are.
export default function Shop({ cartCount }) {
  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-b from-primary-fixed/25 via-surface to-surface text-on-surface font-body-md overflow-x-hidden min-h-screen">
      <Header
        cartCount={cartCount}
        onMenuClick={() => navigate('/')}
        onCartClick={() => navigate('/cart')}
      />

      <main className="pt-20 pb-10">
        {/* Our Story */}
        <Reveal>
          <OurStory />
        </Reveal>

        {/* Women empowerment — spice grinding collective + women delivery partners */}
        <Reveal>
          <WomenEmpowermentBanner />
        </Reveal>

        {/* Why Choose Us */}
        <Reveal>
          <WhyChooseUs />
        </Reveal>

        {/* Our Process */}
        <Reveal>
          <OurProcess />
        </Reveal>

        {/* Quality & Hygiene: FSSAI License, Lab Reports, Quality Certificates, Safe Packaging */}
        <Reveal>
          <QualityHygiene />
        </Reveal>

        {/* Contact & Location */}
        <Reveal>
          <ContactLocation />
        </Reveal>

        <Footer />
      </main>
    </div>
  )
}
