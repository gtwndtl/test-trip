package Forgetpassword

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"net/smtp"
	"time"
)

var otpStore = make(map[string]OTPData) // ใช้ memory เก็บ OTP (Production ควรใช้ DB)

// สร้างรหัส OTP 6 หลัก
func generateOTP() string {
	max := big.NewInt(999999)
	n, _ := rand.Int(rand.Reader, max)
	return fmt.Sprintf("%06d", n.Int64())
}

// ส่ง Email OTP (ต้องตั้งค่า SMTP)
func sendEmail(toEmail, otp string) error {
	from := "jaonai0954400179@gmail.com" // เปลี่ยนเป็น Email ของคุณ
	password := "qqajmfbtemtimbms"      // ใช้ App Password ของ Gmail หรือ SMTP อื่น

	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	message := []byte("Subject: Password Reset OTP\n\nYour OTP is: " + otp)

	auth := smtp.PlainAuth("", from, password, smtpHost)
	// เรียกครั้งเดียวพอ
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{toEmail}, message)
	if err != nil {
		fmt.Println("SendMail ERROR:", err)
	}
	return err
}


// เก็บ OTP และส่ง Email
func SendOTP(email string) error {
	otp := generateOTP()
	otpStore[email] = OTPData{
		Email:     email,
		OTP:       otp,
		ExpiresAt: time.Now().Add(5 * time.Minute),
	}
	fmt.Println("Generated OTP:", otp) // log OTP สำหรับ debug (ลบออกใน production)
	return sendEmail(email, otp)
}

// ตรวจสอบ OTP
func VerifyOTP(email, otp string) bool {
	data, exists := otpStore[email]
	if !exists || time.Now().After(data.ExpiresAt) {
		return false
	}
	return data.OTP == otp
}
