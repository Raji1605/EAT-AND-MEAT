import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Hero from '../components/Hero'
import TrustBanner from '../components/TrustBanner'
import SearchBar from '../components/SearchBar'
import ShopByCategory from '../components/ShopByCategory'
import FreshChicken from '../components/FreshChicken'
import PopularBlends from '../components/PopularBlends'
import TodaysCombo from '../components/TodaysCombo'
import OurStory from '../components/OurStory'
import WomenEmpowermentBanner from '../components/WomenEmpowermentBanner'
import WhyChooseUs from '../components/WhyChooseUs'
import OurProcess from '../components/OurProcess'
import QualityHygiene from '../components/QualityHygiene'
import ReviewsList from '../components/ReviewsList'
import ContactLocation from '../components/ContactLocation'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'

export default function Home({ cartCount, search, setSearch, addToCart }) {
  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-b from-primary-fixed/25 via-surface to-surface text-on-surface font-body-md overflow-x-hidden selection:bg-primary/20 min-h-screen">
      <Header
        cartCount={cartCount}
        onMenuClick={() => {}}
        onCartClick={() => navigate('/cart')}
      />

      <main className="pt-20 pb-10">
        {/* Hero Banner */}
        <Hero />
        <SearchBar value={search} onChange={setSearch} onAddToCart={addToCart} />
        <TrustBanner />

        {/* Shop Categories */}
        <Reveal>
          <ShopByCategory />
        </Reveal>

        {/* Chicken Products */}
        <Reveal direction="left">
          <FreshChicken onAddToCart={addToCart} />
        </Reveal>

        {/* Masala Products */}
        <Reveal direction="right">
          <PopularBlends onAddToCart={addToCart} />
        </Reveal>

        {/* Combo Offers */}
        <Reveal direction="left">
          <TodaysCombo onAddToCart={addToCart} />
        </Reveal>

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

        {/* Customer Reviews */}
        <Reveal>
          <section className="mt-xl px-margin-mobile">
            <div className="max-w-container-max mx-auto">
              <ReviewsList />
            </div>
          </section>
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
