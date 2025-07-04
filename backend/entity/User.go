package entity

import (
	"time"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Firstname          string    
	Email            string     
	Lastname              string    
	Age               int             
	Birthday 	time.Time
	Password	string                              
}
