import './chat.css';
import { Input, Button } from 'antd';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import doraemon from '../../assets/doraemon.jpg';
import type { LandmarkInterface } from '../../interfaces/Landmark';
import { GetAllLandmarks } from '../../services/https';

const Chat = () => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<
    { text: string; sender: 'user' | 'bot'; data?: any; isTripPlan?: boolean }[]
  >([
    {
      text: 'สวัสดีค่ะ! ฉันช่วยวางแผนทริปให้คุณได้เลย ลองบอกมาว่าคุณอยากไปที่ไหน? เช่น "ฉันอยากไปวัดพระแก้ว 3 วัน"',
      sender: 'bot',
    },
  ]);
  const [landmarks, setLandmarks] = useState<LandmarkInterface[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLandmarks = async () => {
      try {
        const data = await GetAllLandmarks();
        setLandmarks(data);
      } catch (error) {
        console.error('โหลดข้อมูล landmark ล้มเหลว', error);
      }
    };
    fetchLandmarks();
  }, []);

  const extractKeywordAndDays = (text: string) => {
    const match = text.match(/อยากไป(.*?)(\d+)\s*วัน/);
    if (match) {
      return { keyword: match[1].trim(), days: parseInt(match[2], 10) };
    }
    const match2 = text.match(/อยากไป\s*(.+)/);
    if (match2) {
      return { keyword: match2[1].trim(), days: null };
    }
    return null;
  };

  const generateRouteAndPlan = async (id: number, keyword: string, days: number) => {
    try {
      setLoading(true);
      setMessages(prev => [...prev, { text: `กำลังสร้างแผนทริปสำหรับ "${keyword}"...`, sender: 'bot' }]);

      const res = await axios.get(`http://localhost:8080/gen-route?start=P${id}&days=${days}`);
      const routeData = res.data;

      const prompt = `
      คุณคือผู้ช่วยวางแผนทัวร์ที่เชี่ยวชาญ

      ข้อมูลเส้นทางนี้เริ่มจาก "${keyword}" มีจำนวนวัน ${days} วัน

      โปรดช่วยจัดแผนทริปให้อ่านง่ายและสนุก เหมือนเล่าให้เพื่อนฟัง โดย:

      - แบ่งแผนเป็นแต่ละวัน (เช่น วันแรก, วันที่สอง, ...)
      - แต่ละวันบอกลำดับสถานที่ที่ไป พร้อมคำอธิบายสั้นๆ ว่าควรทำอะไรที่นั่น เช่น ชมวิว, ทานอาหาร, พักผ่อน
      - เขียนเป็นข้อความธรรมชาติ ไม่ต้องเป็นตาราง หรือแสดงรหัสสถานที่ เช่น Pxxx, Rxxx
      - สรุประยะทางคร่าวๆ ของแต่ละวันให้ท้ายข้อความ

      ข้อมูลเส้นทาง (paths) ดังนี้:
      ${JSON.stringify(routeData.paths, null, 2)}

      ช่วยจัดแผนท่องเที่ยวตามข้อมูลนี้ให้ด้วยค่ะ
      `;



      const groqApiKey = import.meta.env.VITE_REACT_APP_GROQ_API_KEY;
      const groqRes = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            { role: 'system', content: 'You are a helpful travel assistant.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const tripPlan = groqRes.data.choices[0].message.content.trim();
      setMessages(prev => [...prev, { text: tripPlan, sender: 'bot', isTripPlan: true }]);
    } catch (error) {
      console.error('Error generating route or calling Groq', error);
      setMessages(prev => [
        ...prev,
        { text: 'ขออภัย เกิดข้อผิดพลาดระหว่างการสร้างแผนทริป กรุณาลองใหม่ภายหลัง', sender: 'bot' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);

    const lastConfirm = [...messages].reverse().find(
      m => m.sender === 'bot' && m.data && m.data.id && !m.data.days
    );

    if (lastConfirm) {
      const days = parseInt(userMessage.replace(/[^\d]/g, ''), 10);
      if (!isNaN(days) && days > 0) {
        generateRouteAndPlan(lastConfirm.data.id, lastConfirm.data.keyword, days);
        return;
      } else {
        setMessages(prev => [...prev, {
          text: 'กรุณาพิมพ์จำนวนวันเป็นตัวเลข เช่น 3', sender: 'bot'
        }]);
        return;
      }
    }

    const analysis = extractKeywordAndDays(userMessage);
    if (analysis?.keyword) {
      const keyword = analysis.keyword.toLowerCase();
      const matched = landmarks.find(l =>
        l.Name?.toLowerCase().includes(keyword)
      );

      if (matched && matched.ID != null) {
        if (analysis.days) {
          generateRouteAndPlan(matched.ID, analysis.keyword, analysis.days);
        } else {
          setMessages(prev => [
            ...prev,
            {
              text: `คุณต้องการไป "${analysis.keyword}" กี่วันคะ? กรุณาพิมพ์จำนวนวันเป็นตัวเลข`,
              sender: 'bot',
              data: { keyword: analysis.keyword, id: matched.ID, days: null },
            },
          ]);
        }
      } else {
        setMessages(prev => [...prev, {
          text: `ไม่พบสถานที่ "${analysis.keyword}"`, sender: 'bot'
        }]);
      }
      return;
    }

    setMessages(prev => [...prev, {
      text: 'ขอบคุณสำหรับข้อความค่ะ หากต้องการวางแผนทริป พิมพ์ว่า "ฉันอยากไป..." พร้อมจำนวนวัน',
      sender: 'bot'
    }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (chatInput.trim()) {
        handleUserMessage(chatInput.trim());
        setChatInput('');
      }
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
        {messages.map((msg, index) =>
          msg.sender === 'bot' ? (
            <div key={index} className="bot-message-wrapper">
              <img src={doraemon} alt="Bot Avatar" className="bot-avatar" />
              <div
                className="chat-message bot-message"
                style={msg.isTripPlan ? { whiteSpace: 'pre-wrap', lineHeight: 1.5 } : {}}
              >
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={index} className="chat-message user-message">
              {msg.text}
            </div>
          )
        )}
        {loading && (
          <div className="bot-message-wrapper">
            <img src={doraemon} alt="Bot Avatar" className="bot-avatar" />
            <div className="chat-message bot-message">กำลังพิมพ์...</div>
          </div>
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
          disabled={loading}
          style={{ flexGrow: 1 }}
        />
        <Button
          type="text"
          onClick={() => {
            if (chatInput.trim()) {
              handleUserMessage(chatInput.trim());
              setChatInput('');
            }
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
