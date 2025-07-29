import { Carousel } from 'antd';
import b1 from '../../../assets/a.jpg';
import b2 from '../../../assets/b.jpg';
import b3 from '../../../assets/c.jpg';
import b4 from '../../../assets/d.jpg';
import b5 from '../../../assets/e.jpg';
import './hero-section.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroCarousel = () => {
  const navigate = useNavigate();
  return (
    <div className="hero-section">
      <Carousel autoplay autoplaySpeed={3500} arrows={false} dots={false}>
        {[b1, b2, b3, b4, b5].map((image, index) => (
          <div key={index}>
            <div className="carousel-bg" style={{ backgroundImage: `url(${image})` }}>
              <div className="carousel-overlay-fade" />
            </div>
          </div>
        ))}
      </Carousel>
      <div className="overlay">
        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          TRIP PLANNER
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        >
          จัดสรรการเดินทางโดยง่ายเพียงแค่ระบุสถานที่
        </motion.p>

        <motion.button
          className="hero-button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.6,
            duration: 0.5,
            type: 'spring',
            stiffness: 120,
            damping: 10
          }}
          onClick={() => navigate('/chat')}
        >
          เริ่มต้นการวางแผน
        </motion.button>
      </div>
    </div>
  );
};

export default HeroCarousel;
