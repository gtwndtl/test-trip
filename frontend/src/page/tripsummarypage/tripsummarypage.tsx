import { Button, Table, Select } from 'antd';
import { useEffect, useState } from 'react';
import Navbar from '../../navbar/navbar';
import './tripsummarypage.css';
import { GetTripById } from '../../services/https';
import type { TripInterface } from '../../interfaces/Trips';
import type { ShortestpathInterface } from '../../interfaces/Shortestpath';

const { Option } = Select;

const TripSummaryPage = () => {
  const TripID = localStorage.getItem('TripID') ?? '';
  const [trip, setTrip] = useState<TripInterface | null>(null);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<Record<number, ShortestpathInterface[]>>({});

  // สมมุติ list สถานที่ (ควรมาจาก API จริง)
  const availableLocations = ['BKK', 'CNX', 'HKT', 'KBI', 'UBP'];

  useEffect(() => {
    const fetchTrip = async () => {
      if (TripID) {
        const tripData = await GetTripById(Number(TripID));
        setTrip(tripData);
      }
    };
    fetchTrip();
  }, [TripID]);

  const groupedByDay = trip?.ShortestPaths?.reduce((acc, curr) => {
    const day = curr.Day ?? 0;
    if (!acc[day]) acc[day] = [];
    acc[day].push(curr);
    return acc;
  }, {} as Record<number, ShortestpathInterface[]>);

  const handleEditClick = (day: number) => {
    setEditingDay(day);
    if (groupedByDay && groupedByDay[day]) {
      setEditedData((prev) => ({
        ...prev,
        [day]: JSON.parse(JSON.stringify(groupedByDay[day])) // deep copy
      }));
    }
  };

  const handleLocationChange = (day: number, index: number, value: string) => {
    const updated = [...(editedData[day] || [])];
    updated[index] = { ...updated[index], ToCode: value };
    setEditedData((prev) => ({ ...prev, [day]: updated }));
  };

  const handleSave = (day: number) => {
    if (editedData[day]) {
      const updatedTrip = {
        ...trip!,
        ShortestPaths: (trip!.ShortestPaths ?? []).map(sp =>
          sp.Day === day ? editedData[day].find(e => e.ID === sp.ID) || sp : sp
        ),
      };
      setTrip(updatedTrip);
    }
    setEditingDay(null);
  };

  const handleCancel = () => {
    setEditingDay(null);
    setEditedData({});
  };

  const columns = (day: number) => [
    {
      title: 'เวลา',
      render: (record: ShortestpathInterface) => `${record.StartTime} - ${record.EndTime}`,
      width: 120,
    },
    {
      title: 'สถานที่',
      render: (_: any, record: ShortestpathInterface, index: number) => {
        if (editingDay === day) {
          return (
            <Select
              value={editedData[day]?.[index]?.ToCode}
              onChange={(value) => handleLocationChange(day, index, value)}
              style={{ width: 120 }}
            >
              {availableLocations.map((loc) => (
                <Option key={loc} value={loc}>{loc}</Option>
              ))}
            </Select>
          );
        }
        return record.ToCode;
      },
      width: 120,
    },
    {
      title: 'กิจกรรม',
      dataIndex: 'ActivityDescription',
      render: (text: string) => (
        <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
      ),
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'Details',
      render: () => '-',
    },
  ];

  const getDayHeaderText = (dayIndex: number): string => {
    const today = new Date();
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
      <Navbar />
      <div className="trip-summary-page-content">
        <div className="trip-summary-box">
          <div className="trip-summary-head">
            <h2>สรุปแผนการเดินทาง {trip?.Name ?? ''}</h2>
            <p>{trip?.Days} วัน — 30000บาท — ชิวๆ</p>
          </div>

          {groupedByDay && Object.entries(groupedByDay).map(([day, activities]) => {
            const dayNum = Number(day);
            const isEditing = editingDay === dayNum;

            return (
              <div key={day}>
                <h3 className="trip-day-header">
                  <span className="day-header-text">
                    {getDayHeaderText(dayNum)}
                  </span>
                  <div className="button-edit-group">
                    {isEditing ? (
                      <>
                        <Button danger onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button type="primary" onClick={() => handleSave(dayNum)} style={{ marginLeft: 8 }}>
                          Save
                        </Button>
                      </>
                    ) : (
                      <Button type="default" onClick={() => handleEditClick(dayNum)} style={{ marginLeft: 10 }}>
                        Edit
                      </Button>
                    )}
                  </div>
                </h3>
                <Table
                  className="trip-summary-table"
                  columns={columns(dayNum)}
                  dataSource={isEditing ? editedData[dayNum] : activities}
                  rowKey="ID"
                  pagination={false}
                  size="middle"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TripSummaryPage;
