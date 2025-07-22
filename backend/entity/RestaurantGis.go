package entity

import "gorm.io/gorm"

type RestaurantGis struct {
	gorm.Model
	RestaurantID uint    `gorm:"column:restaurant_id"`
	Location     string `gorm:"type:geometry(Point,4326)"`
}