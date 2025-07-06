import './landing.css';
import HeroSection from './hero-section/hero-section';
import FeaturesSection from './features-section/features-section';
import Section from './section/section';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="hero-section"><HeroSection /></div>
      <div className="features-section"><FeaturesSection /></div>
      <div className="section"><Section /></div>
    </div>
  );
};

export default LandingPage;
