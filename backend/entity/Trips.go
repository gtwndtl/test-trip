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

	Con_id  uint      
   	Con    *Condition  `gorm:"foreignKey:Con_id"`

	Acc_id  uint      
   	Acc    *Accommodation  `gorm:"foreignKey:Acc_id"`

	Path_id  uint      
   	Path    *Shortestpath  `gorm:"foreignKey:Path_id"`

}