package entity

import (
	"gorm.io/gorm"
	"time"
)

type Condition struct {
	gorm.Model
	Day    time.Time   
	Price  float32
	Accommodation string
	Landmark string
	Style string
	User_id  uint      
   	User    *User  `gorm:"foreignKey:User_id"`
}