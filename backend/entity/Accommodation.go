package entity

import (
	"time"

	"gorm.io/gorm"
)

type Accommodation struct {
	gorm.Model

	PlaceID  int    `binding:"required"`
	Name     string `binding:"required,min=2,max=100"`
	Category string `binding:"required"` // เช่น โฮสเทล, โรงแรม, รีสอร์ต

	Lat float32 `binding:"required"`
	Lon float32 `binding:"required"`

	Address     string `binding:"required"`
	Province    string `binding:"required"`
	District    string `binding:"required"`
	SubDistrict string `binding:"required"`
	Postcode    string `binding:"required,len=5"`

	ThumbnailURL string `binding:"omitempty,url"`

	Time_open  time.Time `binding:"required"` // เวลาที่พักเปิด เช่น "2025-07-25T14:00:00Z"
	Time_close time.Time `binding:"required"` // เวลาที่พักปิด

	Total_people int     `binding:"required,gte=1,lte=1000"` // ความจุที่พัก
	Price        float32 `binding:"required,gte=0"`          // ราคาต่อคืน
	Review       int     `binding:"omitempty,gte=0"`         // จำนวนรีวิว (optional)
}
