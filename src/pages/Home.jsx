import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Hero from '../components/Hero'
import TrustBanner from '../components/TrustBanner'
import SearchBar from '../components/SearchBar'
import ShopByCategory from '../components/ShopByCategory'
import FreshChicken from '../components/FreshChicken'
import PopularBlends from '../components/PopularBlends'
import TodaysCombo from '../components/TodaysCombo'
import ReviewsList from '../components/ReviewsList'
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

        {/* Customer Reviews */}
        <Reveal>
          <section className="mt-xl px-margin-mobile">
            <div className="max-w-container-max mx-auto">
              <ReviewsList />
            </div>
          </section>
        </Reveal>

        <Footer />
      </main>
    </div>
  )
}
