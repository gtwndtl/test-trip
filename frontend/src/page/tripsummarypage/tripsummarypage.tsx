import { Table } from 'antd';
import { useEffect, useState } from 'react';
import Navbar from '../../navbar/navbar';
import './tripsummarypage.css';
import { GetTripById } from '../../services/https';
import type { TripInterface } from '../../interfaces/Trips';
import type { ShortestpathInterface } from '../../interfaces/Shortestpath';

const TripSummaryPage = () => {
  const TripID = localStorage.getItem('TripID') ?? '';
  const [trip, setTrip] = useState<TripInterface | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      if (TripID) {
        const tripData = await GetTripById(Number(TripID));
        setTrip(tripData);
      }
    };
    fetchTrip();
  }, [TripID]);

  // Columns สำหรับกิจกรรมแต่ละวัน
  const columns = [
    {
      title: 'เวลา',
      render: (record: ShortestpathInterface) =>
        `${record.StartTime} - ${record.EndTime}`,
      width: 120,
    },
    {
      title: 'กิจกรรม',
      dataIndex: 'ActivityDescription',
      render: (text: string) =>
        <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />,
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'Details', // ถ้ามีข้อมูลรายละเอียดเพิ่มเติม
      render: () => '-', // คุณสามารถเปลี่ยนให้ dynamic ได้
    },
  ];

  // กลุ่มข้อมูลแยกตามวัน
  const groupedByDay = trip?.ShortestPaths?.reduce((acc, curr) => {
    const day = curr.Day ?? 0;
    if (!acc[day]) acc[day] = [];
    acc[day].push(curr);
    return acc;
  }, {} as Record<number, ShortestpathInterface[]>);

  // แปลงวันเป็นข้อความ เช่น "วันเสาร์ที่ 26 เมษายน 2024"
  const getDayHeaderText = (dayIndex: number): string => {
    const today = new Date(); // หรือจะเริ่มจาก trip.StartDate ถ้ามี
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + (dayIndex - 1));

    return `วันที่ ${dayIndex} - ${targetDate.toLocaleDateString('th-TH', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}`;
  };

  return (
    <div className="trip-summary-page-container">
      <div className="navbar-container">
        <Navbar />
      </div>
      <div className="trip-summary-page-content">
        <h2 className="trip-summary-title">สรุปแผนการเดินทาง</h2>
        <div className="trip-summary-subtitle">รายละเอียดการเดินทางและกิจกรรมทั้งหมด</div>
        <div className="trip-summary-card">
          {/* ส่วนหัวทริป */}
          <div className="trip-summary-head">
            <h3>สรุปแผนการเดินทาง {trip?.Name ?? ''}</h3>
            <p>{trip?.Days} วัน — 30000บาท — ชิวๆ</p>
          </div>

          {/* ตารางแยกตามวัน */}
          {groupedByDay &&
            Object.entries(groupedByDay).map(([day, activities]) => (
              <div key={day}>
                <h3 className="trip-day-header">
                  {getDayHeaderText(Number(day))}
                </h3>
                <Table
                  className="trip-summary-table"
                  columns={columns}
                  dataSource={activities}
                  rowKey="ID"
                  pagination={false}
                  size="middle"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );

};

export default TripSummaryPage;
