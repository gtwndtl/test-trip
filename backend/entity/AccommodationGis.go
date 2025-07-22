package entity

import (

	"gorm.io/gorm"
)

type AccommodationGis struct {
	gorm.Model
	Acc_ID   uint     `gorm:"column:acc_id"`
	Location string  `gorm:"type:geometry(Point,4326)"`
}
