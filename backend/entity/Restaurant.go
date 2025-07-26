package entity

import (
	"gorm.io/gorm"
	"time"
)

type Restaurant struct {
	gorm.Model
	PlaceID       int     `binding:"required"`
	Name          string  `binding:"required,min=2,max=100"`
	Category      string  `binding:"required"` // เช่น อีสาน, ปิ้งย่าง ฯลฯ

	Lat           float32 `binding:"required"`
	Lon           float32 `binding:"required"`

	Address       string  `binding:"required"`
	Province      string  `binding:"required"`
	District      string  `binding:"required"`
	SubDistrict   string  `binding:"required"`
	Postcode      string  `binding:"required,len=5"` // ตรวจความยาวรหัสไปรษณีย์

	ThumbnailURL  string  `binding:"omitempty,url"`

	Time_open      time.Time  
	Time_close     time.Time 

	Total_people   int     `binding:"required,gte=1,lte=500"` // รองรับคน 1–500 คน
	Price         float32 `binding:"required,gte=0"`                // ราคาเฉลี่ยต่อหัว
	Review        int     `binding:"omitempty,gte=0"`              // จำนวนรีวิว (ไม่บังคับ)
}
