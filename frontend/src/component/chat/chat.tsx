import './chat.css';
import { Input, Button } from 'antd';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import doraemon from '../../assets/doraemon.jpg';
import type { AccommodationInterface } from "../../interfaces/Accommodation";
import { GetAllAccommodations } from "../../services/https";

const Chat = () => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<
    { text: string; sender: 'user' | 'bot' | 'confirm'; data?: any; isTripPlan?: boolean }[]
  >([
    {
      text: 'สวัสดีค่ะ! ฉันช่วยวางแผนทริปที่พักให้คุณได้เลย ลองบอกมาว่าคุณอยากไปที่ไหน?',
      sender: 'bot',
    },
  ]);
  const [accommodations, setAccommodations] = useState<AccommodationInterface[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const data = await GetAllAccommodations();
        setAccommodations(data);
      } catch (error) {
        console.error('โหลดข้อมูล accommodation ล้มเหลว', error);
      }
    };
    fetchAccommodations();
  }, []);

  // ดึง keyword หลัง "ฉันอยากไป"
  const extractKeyword = (text: string) => {
    const trigger = 'ฉันอยากไป';
    const idx = text.indexOf(trigger);
    if (idx === -1) return null;
    return text.slice(idx + trigger.length).trim();
  };

  // หาที่พักที่ชื่อมีคำนี้
  const findAccommodationId = (keyword: string) => {
    const match = accommodations.find(acc =>
      acc.Name?.toLowerCase().includes(keyword.toLowerCase())
    );
    return match?.ID || null;
  };

  // เรียก API gen-route และส่งข้อมูลไป Groq จัดแผนทริป
  const generateRouteAndPlan = async (placeId: string, keyword: string) => {
    try {
      setLoading(true);
      setMessages(prev => [...prev, { text: `กำลังสร้างแผนทริปสำหรับ "${keyword}"...`, sender: 'bot' }]);

      // เรียก gen-route
      const res = await axios.get(`http://localhost:8080/gen-route?start=P${placeId}`);
      const routeData = res.data;

      const prompt = 
`You are a Thai travel planner.

Given this JSON route data, create a complete trip plan in **Thai language**. 

คุณเป็นผู้ช่วยวางแผนทริปท่องเที่ยวในภาษาไทยที่เล่าเรื่องเป็นช่วงเวลา เช่น เช้า สาย เที่ยง บ่าย เย็น 

จงสร้างแผนทริปที่สรุปกิจกรรมตามเส้นทางนี้โดยแบ่งเวลาคร่าว ๆ ตามช่วงเวลาในวันเดียวกัน เช่น

- เช้า (ประมาณ 9:00 น.): บอกสถานที่แรกและกิจกรรมที่น่าสนใจของสถานนั้น
- สาย: ไปสถานที่ถัดไป พร้อมบอกกิจกรรมที่น่าสนใจของสถานนั้น
- เที่ยง: ถ้ามีร้านอาหารในเส้นทาง ให้บอกสถานที่และแนะนำอาหาร
- บ่าย: ต่อด้วยสถานที่ถัดไป และกิจกรรมที่น่าสนใจของสถานนั้น
- เย็น: สรุปกิจกรรมสุดท้ายและการพักผ่อน
เมื่อถึงเวลา 18.00 ให้เริ่มวันใหม่เลย
สำหรับแต่ละช่วงเวลา:
- ให้ประมาณเวลาทำกิจกรรมสถานที่ละประมาณ 1-2 ชั่วโมง
- เวลาการเดินทางคิดจากระยะทางด้วยความเร็วเดิน 5 กม./ชม.
- ถ้าเป็นร้านอาหาร ให้เวลารับประทานอาหาร 60 นาที

ถ้าข้อมูลกิจกรรมใน route data ไม่ระบุ หรือบอกว่า "ไม่ระบุกิจกรรม" ให้คุณช่วยค้นหาข้อมูลกิจกรรมหรือจุดเด่นของสถานที่นั้น ๆ และเติมรายละเอียดกิจกรรมนั้นลงไปในแผนทริปด้วย

นอกจากนี้ โปรดตรวจสอบเส้นทางว่ามีการวนลูป (เช่น กลับไปยังสถานที่เดิมหรือผ่านสถานที่ซ้ำ) หรือไม่ หากพบลูป กรุณาอธิบายหรือจัดการแผนทริปให้เหมาะสมกับลูปนั้นในเนื้อหาแผนทริป

จงเขียนแผนทริปในรูปแบบที่อ่านง่าย คล้ายกับตัวอย่างนี้:

---

วันที่ 1: 

เช้า (ประมาณ 9:00 น.): เริ่มต้นที่ วัดสุทัศนเทพวรารามราชวรมหาวิหาร  
กิจกรรม: เยี่ยมชมวัดและสักการะพระพุทธรูป  
เดินทางต่อไปยัง เสาชิงช้า (ระยะทาง 0.09 กม. ใช้เวลาประมาณ 1 นาที)

...

สุดท้าย สรุประยะทางรวมทั้งหมดและเวลาที่ใช้โดยประมาณในทริป

---

ให้ตอบกลับเฉพาะแผนทริปตามรูปแบบนี้เท่านั้น

Route data: 
${JSON.stringify(routeData, null, 2)}

Make sure the response covers the entire route and is not cut off.
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
        {
          text: 'ขออภัย เกิดข้อผิดพลาดระหว่างการสร้างแผนทริป กรุณาลองใหม่ภายหลัง',
          sender: 'bot',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // รับข้อความผู้ใช้
  const handleUserMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);

    // ถ้าข้อความคือ "ใช่" แล้วมี confirm message ล่าสุด ให้สร้างแผนทริปเลย
    if (userMessage.trim() === 'ใช่') {
      const lastConfirm = [...messages].reverse().find(m => m.sender === 'bot' && m.text.includes('คุณต้องการให้ฉันวางแผนทริป'));
      if (lastConfirm && lastConfirm.data) {
        generateRouteAndPlan(lastConfirm.data.placeId, lastConfirm.data.keyword);
        return;
      }
    }

    const keyword = extractKeyword(userMessage);

    if (keyword) {
      const placeId = findAccommodationId(keyword);
      if (placeId) {
        // แจ้งให้ผู้ใช้พิมพ์ "ใช่" เพื่อยืนยัน
        setMessages(prev => [
          ...prev,
          {
            text: `คุณต้องการให้ฉันวางแผนทริปโดยเริ่มต้นจาก "${keyword}" ใช่ไหมคะ? กรุณาพิมพ์ "ใช่" เพื่อยืนยัน`,
            sender: 'bot',
            data: { keyword, placeId },
          },
        ]);
        return;
      }
    }

    // ถ้าไม่ใช่ทริป ทักทายทั่วไป
    const lower = userMessage.toLowerCase();
    let botReply = '';
    if (lower.includes('สวัสดี')) {
      botReply = 'สวัสดีค่ะ 😊 ยินดีที่ได้คุยกับคุณ';
    } else if (lower.includes('ชื่ออะไร')) {
      botReply = 'ฉันชื่อ TravelBot ค่ะ ยินดีช่วยวางแผนทริปให้คุณ!';
    } else {
      botReply = 'ขอบคุณสำหรับข้อความนะคะ 😊 ถ้าคุณมีคำถามเกี่ยวกับการท่องเที่ยวหรือที่พัก บอกฉันได้เลย!';
    }

    setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
  };

  // กด Enter ส่งข้อความ
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (chatInput.trim()) {
        handleUserMessage(chatInput.trim());
        setChatInput('');
      }
    }
  };

  // เลื่อนแชทให้ดูข้อความล่าสุดอัตโนมัติ
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
              <div className="chat-message bot-message" style={msg.isTripPlan ? { whiteSpace: 'pre-wrap', lineHeight: 1.5 } : {}}>
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
