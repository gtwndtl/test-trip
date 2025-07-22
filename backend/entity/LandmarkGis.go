package entity

import (
	"gorm.io/gorm"
)

type LandmarkGis struct {
	gorm.Model
	LandmarkID uint     `gorm:"column:landmark_id"`
	Location   string  `gorm:"type:geometry(Point,4326)"`
}