package Forgetpassword

import "time"

// โครงสร้างเก็บ OTP
type OTPData struct {
	Email     string
	OTP       string
	ExpiresAt time.Time
}
