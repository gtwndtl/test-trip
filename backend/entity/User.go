package entity

import (
	"time"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Firstname string    `binding:"required,min=1,max=50"`
	Lastname  string    `binding:"required,min=1,max=50"`
	Email     string    `binding:"required,email"`
	Age       int       `binding:"gte=0,lte=120"`
	Birthday  time.Time `binding:"required"` // ถ้าไม่อยากบังคับให้ส่งมา ก็ลบ `required`
	Password  string    `binding:"required,min=6,max=100"`
	Profile   string    `gorm:"type:longtext" binding:"omitempty"` // optional, สูงสุด 10000 ตัวอักษร                        
}
