import HowItWorks from "../../components/landing/HowItWorks";
import HeroSection from "../../components/landing/HeroSection";
import WhyAlphaNom from "../../components/landing/WhyAlphaNom";
import TrustedBy from "../../components/landing/TrsutedBy";
import Testimonials from "../../components/landing/Testimonials";
import CTABanner from "../../components/landing/CTAbanner"


export default function Home() {
  return (
    <main >

      <HeroSection />
      <HowItWorks />
      <WhyAlphaNom />
      <TrustedBy />
      <Testimonials />
      <CTABanner/>
    </main>
  );
}