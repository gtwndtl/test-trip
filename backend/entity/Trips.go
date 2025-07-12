package entity

import (
	"gorm.io/gorm"

)


type Trips struct {
	gorm.Model
	Name      string
	Types     string
	Days      int


	Con_id uint
	Con    *Condition `gorm:"foreignKey:Con_id"`

	Acc_id uint
	Acc    *Accommodation `gorm:"foreignKey:Acc_id"`

	ShortestPaths []Shortestpath `gorm:"foreignKey:TripID"`
}