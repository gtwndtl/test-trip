import './hero-section.css';
import backgroundImage from '../../../assets/b.jpg';

const HeroSection = () => {
  return (
    <div
      className="hero-section"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay">
        <h1>TRIP PLANNER</h1>
        <p>จัดสรรการเดินทางโดยง่ายเพียงแค่ระบุสถานที่</p>
        <button>เริ่มต้นการวางแผน</button>
      </div>
    </div>
  );
};

export default HeroSection;
