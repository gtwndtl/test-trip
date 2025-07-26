package entity

import (
	"gorm.io/gorm"
	"time"
)

type Review struct {
	gorm.Model

	Day    time.Time `binding:"required"`               // วันที่รีวิว
	Rate   int       `binding:"required,gte=1,lte=5"` // คะแนนรีวิว 1-5 ดาว

	TripID uint   `binding:"required"`             // ต้องระบุ trip ที่รีวิว
	Trip   *Trips `gorm:"foreignKey:TripID"`

	Comment string `binding:"omitempty,max=1000"`  // คอมเมนต์ ไม่บังคับ แต่จำกัดความยาว

	User_id uint  `binding:"required"`              // ผู้ใช้ที่รีวิว
	User   *User `gorm:"foreignKey:User_id"` // foreign key อ้างอิง User
}
