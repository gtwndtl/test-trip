package entity

import (
	"gorm.io/gorm"
)

type Recommend struct {
	gorm.Model

	Condition string `binding:"required,min=2,max=100"` // เงื่อนไขการแนะนำ เช่น "เหมาะกับผู้สูงอายุ"

	TripID uint   `binding:"required"`       // อ้างอิงทริป
	Trip   *Trips `gorm:"foreignKey:TripID"`

	ReviewID uint    `binding:"required"`  // อ้างอิงรีวิว
	Review   *Review `gorm:"foreignKey:ReviewID"`
}
