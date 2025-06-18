import './features-section.css';
import { Card } from 'antd';
import {
    CarryOutOutlined,
    CloudOutlined,
    GlobalOutlined,
} from '@ant-design/icons';

const FeaturesSection = () => {
    return (
        <div className="features-container">
            <div className="features-section">
                <Card variant="outlined">
                    <CarryOutOutlined className="feature-icon" />
                    <h3>วางแผนอัตโนมัติ</h3>
                    <p>
                        สร้างแผนการเดินทางอัตโนมัติ
                    </p>
                </Card>

                <Card variant="outlined">
                    <CloudOutlined className="feature-icon" />
                    <h3>คำนึงถึงสภาพอากาศ</h3>
                    <p>
                        วางแผนการเที่ยวโดยคำนึงถึงสภาพอากาศ
                    </p>
                </Card>

                <Card variant="outlined">
                    <GlobalOutlined className="feature-icon" />
                    <h3>เส้นทางที่เหมาะสมที่สุด</h3>
                    <p>
                        มีการเลือกเส้นทางที่ดีที่สุด
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default FeaturesSection;
