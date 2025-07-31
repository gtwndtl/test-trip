package entity

import (
	"gorm.io/gorm"
)

type Shortestpath struct {
	gorm.Model

	TripID uint   `binding:"required"`             // ต้องมี Trip ID
	Trip   *Trips `gorm:"foreignKey:TripID"`

	Day       int `binding:"required,gte=1,lte=30"`    // ต้องระบุวันที่ (1-30)
	PathIndex int `binding:"required,gte=0"`    // index ของเส้นทางในแต่ละวัน

	FromCode string `binding:"required"`         // ต้องมีรหัสต้นทาง
	ToCode   string `binding:"required"`           // ต้องมีรหัสปลายทาง

	Type     string  `binding:"required"`             // ประเภท เช่น เดิน/รถ
	Distance float32 `binding:"gte=0"`   // ระยะทาง (>= 0)

	ActivityDescription string `binding:"omitempty,max=1000"` // คำบรรยายกิจกรรม ไม่บังคับ
	StartTime           string `binding:"required"`     // เวลาเริ่ม เช่น "08:00"
	EndTime             string `binding:"required"`       // เวลาเลิก เช่น "09:00"
}
