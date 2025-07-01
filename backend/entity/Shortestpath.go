package entity

import (
	"time"

	"gorm.io/gorm"
)

type Shortestpath struct {
	gorm.Model
	Start_node_id  uint      
   	Acc    *Accommodation  `gorm:"foreignKey:Start_node_id"`

	End_node_lan  uint      
   	Lan    *Landmark  `gorm:"foreignKey:End_node_lan"`

	End_node_res  uint      
   	Res    *Restaurant  `gorm:"foreignKey:End_node_res"`

	Time time.Time 

	Total_distance float32

}
