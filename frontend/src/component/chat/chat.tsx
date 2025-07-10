import './chat.css';
import { Input, Button } from 'antd';
import { useState, useRef, useEffect } from 'react';
import doraemon from '../../assets/doraemon.jpg';
import type { LandmarkInterface } from '../../interfaces/Landmark';
import { GetAllLandmarks, GetRouteFromAPI, PostGroq } from '../../services/https';

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
      setMessages((prev) => [...prev, { text: `กำลังสร้างแผนทริปสำหรับ "${keyword}"...`, sender: 'bot' }]);

      const routeData = await GetRouteFromAPI(id, days);

      // ปรับ prompt ให้ LLM สร้างแผนทริปแบบแบ่งวันและเวลา ตามตัวอย่าง
      const prompt = `
คุณคือผู้ช่วยวางแผนทริปท่องเที่ยวมืออาชีพ ช่วยจัดเส้นทางและแบ่งเวลากิจกรรมให้เหมาะสมกับความสะดวกของผู้เดินทาง

ผู้ใช้เดินทางในกรุงเทพฯ จำนวน ${days} วัน เริ่มต้นจาก "${routeData.start_name}"

ข้อมูลเส้นทางทั้งหมด (paths) และแผนเดินทางรายวัน (trip_plan) มีดังนี้:
${JSON.stringify(routeData.paths, null, 2)}

${JSON.stringify(routeData.trip_plan, null, 2)}

โปรดช่วยจัดแผนทริปในรูปแบบนี้:

- แบ่งตามวัน เช่น "วันที่หนึ่ง", "วันที่สอง" ตามจำนวนวันเดินทาง
- กำหนดเวลาทำกิจกรรมแต่ละช่วงอัตโนมัติ ช่วงละประมาณ 1.5-3 ชั่วโมง โดยปรับเวลาตามจำนวนกิจกรรมและเวลาว่างในแต่ละวัน

- กิจกรรมในแต่ละวันอยู่ระหว่าง 08:00-21:00 ต่อเนื่อง ไม่ซ้อนกัน
- เพิ่มเวลาพักผ่อนที่ที่พัก 19:00-21:00 หลังมื้อเย็นทุกวัน
- หากสถานที่ซ้ำกันในหลายวัน ให้จัดกิจกรรมให้แตกต่างกันและไม่ซ้ำซ้อน
- สำหรับแต่ละสถานที่:
  - รหัสขึ้นต้น P = สถานที่ท่องเที่ยว ให้ระบุชื่อสถานที่และคำอธิบายกิจกรรม เช่น "ไหว้พระที่...", "เที่ยวชม...", "เดินเล่นที่..."
  - รหัสขึ้นต้น R = ร้านอาหารหรือของว่าง ให้ระบุชื่อร้านและคำอธิบาย เช่น "รับประทานอาหารกลางวันที่...", "ทานของว่างที่..."
  - รหัสขึ้นต้น A = ที่พัก ให้ระบุชื่อที่พักและคำอธิบาย เช่น "พักผ่อนที่ที่พัก", "เช็คอินและพักผ่อน"
- ห้ามใช้รหัสสถานที่ในข้อความแผนทริป แสดงเฉพาะชื่อสถานที่และคำอธิบายเท่านั้น
- จัดเรียงกิจกรรมตามลำดับในข้อมูล paths และ trip_plan
- ใช้ภาษากระชับ สุภาพ อ่านง่าย มีการเว้นบรรทัดและแบ่งช่วงเวลาอย่างชัดเจน
- หากสถานที่หรือร้านอาหารซ้ำในหลายวัน ให้เขียนแผนแยกวันอย่างชัดเจน

กรุณาจัดแผนทริปให้ครบทั้ง ${days} วัน โดยเรียงลำดับสถานที่ตามข้อมูลเส้นทางที่ให้มา
`
;




      const groqRes = await PostGroq(prompt);
      const tripPlan = groqRes?.choices?.[0]?.message?.content?.trim();

      if (!tripPlan) {
        throw new Error('Groq ไม่ได้ตอบกลับข้อความที่ต้องการ');
      }

      setMessages((prev) => [...prev, { text: tripPlan, sender: 'bot', isTripPlan: true }]);
    } catch (error) {
      console.error('Error generating route or calling Groq', error);
      setMessages((prev) => [
        ...prev,
        { text: 'ขออภัย เกิดข้อผิดพลาดระหว่างการสร้างแผนทริป กรุณาลองใหม่ภายหลัง', sender: 'bot' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;
    setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);

    const lastConfirm = [...messages].reverse().find((m) => m.sender === 'bot' && m.data && m.data.id && !m.data.days);

    if (lastConfirm) {
      const days = parseInt(userMessage.replace(/[^\d]/g, ''), 10);
      if (!isNaN(days) && days > 0) {
        generateRouteAndPlan(lastConfirm.data.id, lastConfirm.data.keyword, days);
        return;
      } else {
        setMessages((prev) => [
          ...prev,
          {
            text: 'กรุณาพิมพ์จำนวนวันเป็นตัวเลข เช่น 3',
            sender: 'bot',
          },
        ]);
        return;
      }
    }

    const analysis = extractKeywordAndDays(userMessage);
    if (analysis?.keyword) {
      const keyword = analysis.keyword.toLowerCase();
      const matched = landmarks.find((l) => l.Name?.toLowerCase().includes(keyword));

      if (matched && matched.ID != null) {
        if (analysis.days) {
          generateRouteAndPlan(matched.ID, analysis.keyword, analysis.days);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              text: `คุณต้องการไป "${analysis.keyword}" กี่วันคะ? กรุณาพิมพ์จำนวนวันเป็นตัวเลข`,
              sender: 'bot',
              data: { keyword: analysis.keyword, id: matched.ID, days: null },
            },
          ]);
        }
      } else {
        setMessages((prev) => [...prev, { text: `ไม่พบสถานที่ "${analysis.keyword}"`, sender: 'bot' }]);
      }
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        text: 'ขอบคุณสำหรับข้อความค่ะ หากต้องการวางแผนทริป พิมพ์ว่า "ฉันอยากไป..." พร้อมจำนวนวัน',
        sender: 'bot',
      },
    ]);
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
