package entity

import (
	"time"

	"gorm.io/gorm"
)

type Landmark struct {
	gorm.Model
	PlaceID       int
	Name          string 
	Category     string  
	Lat            float32    
	Lon             float32   
	Address      string            
	Province     string 
	District     string
	SubDistrict  string
	Postcode     string
	ThumbnailURL string
	CreatedAt    string
	UpdatedAt    string
	Time_open time.Time
	Time_close time.Time
	Total_people int
	Price float32
	Review int
}


