import './chat-process-simulation.css';
import doraemon from '../../../assets/doraemon.jpg';
import { Input, Button } from 'antd';
import { useEffect, useRef } from 'react';
import ProcessSpinner from '../../spinner/process-spinner/process-spinner';

type ChatMessage = {
    text: string;
    sender: 'user' | 'bot';
};

const fullMessages: ChatMessage[] = [
    { text: 'สวัสดีครับ ผมคือ DoraPlanner ผู้ช่วยวางแผนการเดินทางของคุณ', sender: 'bot' },
    { text: 'ฉันอยากไปกรุงเทพ', sender: 'user' },
    { text: 'ยอดเยี่ยมครับ คุณวางแผนไว้ว่าจะไปกี่วันครับ?', sender: 'bot' },
    { text: 'ประมาณ 3 วันค่ะ', sender: 'user' },
    { text: 'เข้าใจแล้วครับ แล้วคุณสนใจเที่ยวแบบไหนเป็นพิเศษครับ เช่น สบาย ๆ ชิล ๆ หรือแนวผจญภัย?', sender: 'bot' },
    { text: 'ขอเป็นแบบสบาย ๆ ไม่เร่งรีบค่ะ', sender: 'user' },
    { text: 'รับทราบครับ เดี๋ยวผมจะจัดแผนเที่ยวในสไตล์ที่คุณต้องการให้อย่างเหมาะสม', sender: 'bot' },
];

const ChatProcessSimulation = () => {
    const messagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll ภายในกล่องเฉพาะ ไม่ใช่ทั้งหน้า
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, []);

    return (
        <div className="chat-simulation-processing-overlay chat-simulation-disabled">
            <div className="chat-simulation-overlay-darken" />
            <div className="chat-simulation-container">
                <div className="chat-simulation-header">
                    <h3>Let me help you plan your next trip</h3>
                    <p>Watch how DoraPlanner assists with personalised travel planning.</p>
                </div>

                <div className="chat-simulation-body">
                    <div className="chat-simulation-messages" ref={messagesRef}>
                        {fullMessages.map((msg, index) =>
                            msg.sender === 'bot' ? (
                                <div key={index} className="chat-simulation-bot-wrapper">
                                    <img src={doraemon} alt="Bot Avatar" className="chat-simulation-avatar" />
                                    <div className="chat-simulation-message chat-simulation-bot">{msg.text}</div>
                                </div>
                            ) : (
                                <div key={index} className="chat-simulation-message chat-simulation-user">
                                    {msg.text}
                                </div>
                            )
                        )}
                    </div>

                    <div className="chat-simulation-input">
                        <Input
                            placeholder="กำลังพิมพ์..."
                            disabled
                            style={{
                                flexGrow: 1,
                                backgroundColor: '#f5f5f5',
                                pointerEvents: 'none',
                                fontFamily: '"Prompt", sans-serif',
                            }}
                        />
                        <Button type="text" disabled style={{ pointerEvents: 'none' }}>
                            Send
                        </Button>
                    </div>
                </div>
            </div>

            <div className="chat-simulation-spinner">
                <ProcessSpinner />
            </div>
        </div>
    );
};

export default ChatProcessSimulation;
