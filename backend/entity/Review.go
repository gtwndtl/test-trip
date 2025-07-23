package entity

import (
	"gorm.io/gorm"
	"time"
)

type Review struct {
	gorm.Model
	Day    time.Time   
	rate int
	trip_id uint
	Trip    *Trips  `gorm:"foreignKey:trip_id"`
	comment string
	User_id  uint      
   	User    *User  `gorm:"foreignKey:User_id"`
}