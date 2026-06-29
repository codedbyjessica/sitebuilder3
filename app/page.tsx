import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import TemplatePreviews from '@/components/landing/TemplatePreviews'
import Pricing from '@/components/landing/Pricing'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <TemplatePreviews />
        <Pricing />
      </main>
      <Footer />
    </>
  )
}
