export interface ShortestpathInterface {
  ID?: number;              // gorm.Model.ID
  CreatedAt?: string;       // gorm.Model.CreatedAt
  UpdatedAt?: string;       // gorm.Model.UpdatedAt
  DeletedAt?: string | null;// gorm.Model.DeletedAt

  TripID?: number;          // Foreign key ไป Trips.ID
  Day?: number;             // วันที่
  PathIndex ?: number;           // ลำดับกิจกรรมในวัน

  FromCode?: string;        // รหัสสถานที่เริ่มต้น
  ToCode?: string;          // รหัสสถานที่ปลายทาง

  Type?: string;            // ประเภทเส้นทาง (เช่น "walk", "drive")

  Distance?: number;        // ระยะทาง (float32 ใน Go ใช้ number ใน TS)

  ActivityDescription?: string; // คำอธิบายกิจกรรม
  StartTime?: string;           // เวลาเริ่ม เช่น "08:00"
  EndTime?: string;             // เวลาสิ้นสุด เช่น "09:00"
}


	// Start_node_id  uint      
   	// Acc    *Accommodation  `gorm:"foreignKey:Start_node_id"`

	// End_node_lan  uint      
   	// Lan    *Landmark  `gorm:"foreignKey:End_node_lan"`

	// End_node_res  uint      
   	// Res    *Restaurant  `gorm:"foreignKey:End_node_res"`

	// Time time.Time 

	// Total_distance float32