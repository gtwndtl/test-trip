
import secondPicture from '../../../assets/landing/2.jpg';
import thirdPicture from '../../../assets/landing/3.jpg';
import './section.css';
import ChatSimulation from '../chat-simulation/chat-simulation';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import ChatProcessSimulation from '../chat-process-simulation/chat-process-simulation';

const Section = () => {
    const chatRef = useRef(null);
    const isInView = useInView(chatRef, { once: true, margin: '0px 0px -100px 0px' }); // ช้าเล็กน้อยตอนขึ้น
    const [shouldRenderChat, setShouldRenderChat] = useState(false);

    useEffect(() => {
        if (isInView) {
            setShouldRenderChat(true);
        }
    }, [isInView]);

    return (
        <div className="section">
            {/* Step 1 */}
            <div className="section-step">
                <div className="section-step-left">
                    <motion.div
                        className="section-step-content"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2>Tell us your destination</h2>
                        <p>บอกเราว่าคุณอยากไปที่ไหน หรือเลือกจากหมุดหมายยอดนิยม</p>
                    </motion.div>
                    <motion.h1
                        className="section-step-number"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        01
                    </motion.h1>
                </div>

                <motion.div
                    className="section-step-chat"
                    initial={{ opacity: 0, x: 100, y: 100 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    viewport={{ once: true, amount: 0.3 }}
                    ref={chatRef}
                >
                    {shouldRenderChat && <ChatSimulation />}
                </motion.div>
            </div>


            {/* Step 2 - from left-bottom */}
            <div className="section-step reverse">
                <div className="section-step-left">
                    <motion.div
                        className="section-step-content"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2>We’ll plan it for you</h2>
                        <p>ระบบจะจัดการประมวลผลข้อมูล และเตรียม route ที่เหมาะกับคุณที่สุด</p>
                    </motion.div>
                    <motion.h1
                        className="section-step-number"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        02
                    </motion.h1>
                </div>
                <motion.div
                    className="section-step-chat"
                    initial={{ opacity: 0, x: -100, y: 100 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <ChatProcessSimulation />
                </motion.div>

            </div>

            {/* Step 3 - from right-bottom */}
            <div className="section-step">
                <div className="section-step-left">
                    <motion.div
                        className="section-step-content"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2>Your trip is ready</h2>
                        <p>รับแผนการเดินทาง พร้อมเวลาและสถานที่ที่คุณเลือก เดินทางได้เลยทันที</p>
                    </motion.div>
                    <motion.h1
                        className="section-step-number"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        03
                    </motion.h1>
                </div>
                <picture className="section-step-image">
                    <motion.img
                        src={thirdPicture}
                        alt="trip ready step"
                        initial={{ opacity: 0, x: 100, y: 100 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        viewport={{ once: true, amount: 0.3 }}
                    />
                </picture>
            </div>
        </div>

    );
};

export default Section;
