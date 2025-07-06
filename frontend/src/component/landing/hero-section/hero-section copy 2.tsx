import './hero-section.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import b5 from '../../../assets/e.jpg';


const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="hero-section">
      <div className="cards">
        <figure className="card">
          <img src={b5} alt="Card Visual" className="card-image" />
        </figure>
      </div>

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
