import './features-section.css';
import { Card } from 'antd';
import {
  CarryOutOutlined,
  CloudOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { easeOut, motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

const FeaturesSection = () => {
  return (
    <div className="features-container">
      <div className="features-section">
        <div className="motion-wrapper">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Card className="feature-card">
              <CarryOutOutlined className="feature-icon" />
              <h3>วางแผนอัตโนมัติ</h3>
              <p>สร้างแผนการเดินทางอัตโนมัติ</p>
            </Card>
          </motion.div>
        </div>

        <div className="motion-wrapper">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Card className="feature-card">
              <CloudOutlined className="feature-icon" />
              <h3>คำนึงถึงสภาพอากาศ</h3>
              <p>วางแผนการเที่ยวโดยคำนึงถึงสภาพอากาศ</p>
            </Card>
          </motion.div>
        </div>

        <div className="motion-wrapper">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Card className="feature-card">
              <GlobalOutlined className="feature-icon" />
              <h3>เส้นทางที่เหมาะสมที่สุด</h3>
              <p>มีการเลือกเส้นทางที่ดีที่สุด</p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
