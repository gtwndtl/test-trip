import './landing.css';
import HeroSection from './hero-section/hero-section';
import FeaturesSection from './features-section/features-section';

const LandingPage = () => {
  return (
    <div className="landing-page">
        <HeroSection />
        <FeaturesSection />
    </div>
  );
};

export default LandingPage;
