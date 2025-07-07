import './chat.css';
import { Input, Button } from 'antd';
import { useState, useRef, useEffect } from 'react';

const Chat = () => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (chatInput.trim()) {
      setMessages(prev => [
        ...prev,
        { text: chatInput.trim(), sender: 'user' },
        { text: 'This is a bot response.', sender: 'bot' },
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Let me help you to plan your trip</h3>
        <p>Just describe your stay preferences and I’ll bring you the most personalised results.</p>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input" style={{ display: 'flex', gap: 8 }}>
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
 