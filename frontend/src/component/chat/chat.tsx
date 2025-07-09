import './chat.css';
import { Input, Button } from 'antd';
import { useState, useRef, useEffect } from 'react';
import doraemon from '../../assets/doraemon.jpg';

const Chat = () => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (chatInput.trim()) {
      setMessages(prev => [
        ...prev,
        { text: chatInput.trim(), sender: 'user' },
        { text: 'นี่คือตัวอย่างคำตอบจากระบบอัตโนมัติ', sender: 'bot' },
      ]);
      setChatInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    // ข้อความเริ่มต้นจากบอท
    setMessages([
      {
        text:
          'สวัสดีครับ ผมคือ DoraPlanner ผู้ช่วยวางแผนการเดินทางส่วนตัวของคุณ กรุณาบอกจุดหมายที่คุณต้องการไป แล้วผมจะช่วยจัดทริปที่เหมาะกับคุณที่สุด',
        sender: 'bot',
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Let me help you to plan your trip</h3>
        <p>Just describe your stay preferences and I’ll bring you the most personalised results.</p>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) =>
          msg.sender === 'bot' ? (
            <div key={index} className="bot-message-wrapper">
              <img src={doraemon} alt="Bot Avatar" className="bot-avatar" />
              <div className="chat-message bot-message">{msg.text}</div>
            </div>
          ) : (
            <div key={index} className="chat-message user-message">
              {msg.text}
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <Input
          placeholder="Ask anything..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="borderless"
          onPressEnter={sendMessage}
          style={{ flexGrow: 1 }}
        />
        <Button type="text" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
