package entity

import (
	"gorm.io/gorm"
)

type Trips struct {
	gorm.Model

	Name  string `binding:"required,min=2,max=100"`         // ต้องมีชื่อทริป อย่างน้อย 2 ตัว
	Types string `binding:"required"`                      // ต้องระบุประเภทของทริป
	Days  int    `binding:"required,gte=1,lte=30"`          // ต้องมีจำนวนวันอย่างน้อย 1 วัน สูงสุด 30 วัน

	Con_id uint        `binding:"required"`               // ต้องส่ง Condition ID
	Con    *Condition  `gorm:"foreignKey:Con_id"`

	Acc_id uint           `binding:"required"`            // ต้องส่ง Accommodation ID
	Acc    *Accommodation `gorm:"foreignKey:Acc_id"`

	ShortestPaths []Shortestpath `gorm:"foreignKey:TripID"`             // ไม่ต้อง binding เพราะเป็น relation
}
