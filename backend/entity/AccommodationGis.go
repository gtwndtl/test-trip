package entity

import (

	"gorm.io/gorm"
)

type AccommodationGis struct {
	gorm.Model
	Acc_ID   uint
	Location string `gorm:"type:geometry(Point,4326)"`
}

