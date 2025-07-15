package entity

import "gorm.io/gorm"

type RestaurantGis struct {
	gorm.Model
	RestaurantID uint
	Location     string `gorm:"type:geometry(Point,4326)"`
}