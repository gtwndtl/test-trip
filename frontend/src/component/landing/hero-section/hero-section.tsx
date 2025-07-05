import './hero-section.css';
import backgroundImage from '../../../assets/b.jpg';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div
      className="hero-section"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay">
        <h1>TRIP PLANNER</h1>
        <p>จัดสรรการเดินทางโดยง่ายเพียงแค่ระบุสถานที่</p>
        <button className="hero-button" onClick={() => navigate('/chat')}>
          เริ่มต้นการวางแผน
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
