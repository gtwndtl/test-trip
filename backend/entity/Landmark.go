package entity

import (
	"time"

	"gorm.io/gorm"
)

type Landmark struct {
	gorm.Model

	PlaceID  int    `binding:"required"`
	Name     string `binding:"required,min=2,max=100"`
	Category string `json:"category" binding:"required"`

	Lat float32 `binding:"required"`
	Lon float32 `binding:"required"`

	Address     string `binding:"required"`
	Province    string `binding:"required"`
	District    string `binding:"required"`
	SubDistrict string ` binding:"required"`
	Postcode    string `binding:"required,len=5"`

	ThumbnailURL string `binding:"omitempty,url"`

	Time_open  time.Time `binding:"required"`  // เวลาเปิด เช่น "2025-07-25T08:00:00Z"
	Time_close time.Time `binding:"required"` // เวลาเปิด เช่น "2025-07-25T17:00:00Z"

	Total_people int     `binding:"required,gte=1,lte=10000"`
	Price       float32 `binding:"required,gte=0"`
	Review      int     `binding:"omitempty,gte=0"`
}
