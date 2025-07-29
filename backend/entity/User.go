package entity

import (
	"time"
	"gorm.io/gorm"
)

type User struct {
    gorm.Model
    Firstname string    `binding:"omitempty,min=1,max=50"`
    Lastname  string    `binding:"omitempty,min=1,max=50"`
    Email     string    `binding:"required,email"`
    Age       int       `binding:"omitempty,gte=0,lte=120"`
    Birthday  time.Time `binding:"omitempty"`
    Password  string    `binding:"required,min=6,max=100"`
    Profile   string    `gorm:"type:longtext" binding:"omitempty"`
    Type      string    `gorm:"default:user"`
}
