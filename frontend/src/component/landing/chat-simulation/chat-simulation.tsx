import './chat-simulation.css';
import doraemon from '../../../assets/doraemon.jpg';
import { Input, Button } from 'antd';
import { useEffect, useRef, useState } from 'react';

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

const ChatSimulation = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingText, setTypingText] = useState('');
  const [typingSender, setTypingSender] = useState<'user' | 'bot' | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  // Reset state on component mount (e.g. F5)
  useEffect(() => {
    setMessages([]);
    setTypingText('');
    setTypingSender(null);
    setCurrentIndex(0);
    setIsTyping(false);
  }, []);

  // Typing animation
  useEffect(() => {
    const startTyping = async () => {
      if (isTyping || currentIndex >= fullMessages.length) return;
      setIsTyping(true);

      const { text, sender } = fullMessages[currentIndex];
      setTypingSender(sender);
      setTypingText('');

      for (let i = 0; i <= text.length; i++) {
        setTypingText(text.slice(0, i));
        await delay(25);
      }

      await delay(300);
      setMessages((prev) => [...prev, { text, sender }]);
      setTypingText('');
      setTypingSender(null);

      const isLast = currentIndex === fullMessages.length - 1;
      await delay(isLast ? 2000 : 500);

      if (isLast) {
        setMessages([]);
        setCurrentIndex(0);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }

      setIsTyping(false);
    };

    startTyping();
  }, [currentIndex, isTyping]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, typingText]);

  return (
    <div className="chat-simulation-container chat-simulation-disabled">
      <div className="chat-simulation-header">
        <h3>Let me help you plan your next trip</h3>
        <p>Watch how DoraPlanner assists with personalised travel planning.</p>
      </div>

      <div className="chat-simulation-body">
        <div className="chat-simulation-messages" ref={scrollContainerRef}>
          {messages.map((msg, index) =>
            msg.sender === 'bot' ? (
              <div key={index} className="chat-simulation-bot-wrapper">
                <img src={doraemon} alt="Bot Avatar" className="chat-simulation-avatar" />
                <div className="chat-simulation-message chat-simulation-bot">{msg.text}</div>
              </div>
            ) : (
              <div key={index} className="chat-simulation-message chat-simulation-user">{msg.text}</div>
            )
          )}

          {typingText && typingSender && (
            typingSender === 'bot' ? (
              <div className="chat-simulation-bot-wrapper">
                <img src={doraemon} alt="Bot Avatar" className="chat-simulation-avatar" />
                <div className="chat-simulation-message chat-simulation-bot">
                  {typingText}
                  <span className="chat-simulation-cursor" />
                </div>
              </div>
            ) : (
              <div className="chat-simulation-message chat-simulation-user">
                {typingText}
                <span className="chat-simulation-cursor" />
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
  );
};

export default ChatSimulation;
