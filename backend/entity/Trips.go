package entity

import (
	"time"

	"gorm.io/gorm"
)

type Trips struct {
	gorm.Model
    Created_at     time.Time
	Name string 
	Types string 
	Day time.Time 

	TripList []string `gorm:"type:text[]"`

	Tripone string
	Triptwo string
	Tripthree string
	Tripfour string
	Tripfive string
	Tripsix string
	Tripseven string
	Tripeight string

	Con_id  uint      
   	Con    *Condition  `gorm:"foreignKey:Con_id"`

	Acc_id  uint      
   	Acc    *Accommodation  `gorm:"foreignKey:Acc_id"`

	Path_id  uint      
   	Path    *Shortestpath  `gorm:"foreignKey:Path_id"`

}