package entity

import (
	"gorm.io/gorm"
)

type Recommend struct {
	gorm.Model 
	condition string
	trip_id uint
	Trip    *Trips  `gorm:"foreignKey:trip_id"`
	review_id uint
	Review  *Review `gorm:"foreignKey:review_id"`
}