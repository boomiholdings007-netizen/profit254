import Navbar from "@/components/Navbar";
import TickerBar from "@/components/TickerBar";
import HeroSection from "@/components/HeroSection";
import TradingPanel from "@/components/TradingPanel";
import HowItWorks from "@/components/HowItWorks";
import WalletSection from "@/components/WalletSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <TickerBar />
    <HeroSection />
    <TradingPanel />
    <HowItWorks />
    <WalletSection />
    <Footer />
  </div>
);

export default Index;
