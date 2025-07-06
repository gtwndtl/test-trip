import './hero-section.css';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'antd';
import { motion } from 'framer-motion'; // ✅ เพิ่มตรงนี้
import b1 from '../../../assets/a.jpg';
import b2 from '../../../assets/b.jpg';
import b3 from '../../../assets/c.jpg';
import b4 from '../../../assets/d.jpg';
import b5 from '../../../assets/e.jpg';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="hero-section">
      {/* พื้นหลังแบบ Carousel */}
      <Carousel autoplay autoplaySpeed={3500} arrows={false} dots={false}>
        <div>
          <div className="carousel-bg" style={{ backgroundImage: `url(${b1})` }} />
        </div>
        <div>
          <div className="carousel-bg" style={{ backgroundImage: `url(${b2})` }} />
        </div>
        <div>
          <div className="carousel-bg" style={{ backgroundImage: `url(${b3})` }} />
        </div>
        <div>
          <div className="carousel-bg" style={{ backgroundImage: `url(${b4})` }} />
        </div>
        <div>
          <div className="carousel-bg" style={{ backgroundImage: `url(${b5})` }} />
        </div>
      </Carousel>

      {/* เนื้อหาทับบน Carousel */}
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

export default HeroSection;
