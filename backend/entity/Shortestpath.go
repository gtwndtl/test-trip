package entity

import (
	"gorm.io/gorm"
)

type Shortestpath struct {
	gorm.Model

	TripID uint
	Trip   *Trips `gorm:"foreignKey:TripID"`

	Day   int
	PathIndex  int

	FromCode string
	ToCode   string

	Type string

	Distance float32

	// ข้อมูลกิจกรรมและเวลา
	ActivityDescription string `gorm:"type:text"` // บรรยายกิจกรรม เช่น "ไหว้พระที่วัดพระแก้ว"
	StartTime           string // เวลาเริ่ม เช่น "08:00"
	EndTime             string // เวลาสิ้นสุด เช่น "09:00"
}
