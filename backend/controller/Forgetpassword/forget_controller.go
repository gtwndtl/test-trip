package Forgetpassword

import (
	"net/http"
	"fmt"

	"github.com/gin-gonic/gin"
)

// ส่ง OTP ไป Email
func SendOTPHandler(c *gin.Context) {
	var req struct {
		Email string `json:"email"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// เรียก SendOTP แค่ครั้งเดียว
	if err := SendOTP(req.Email); err != nil {
		// log error จริง
		fmt.Println("SMTP ERROR:", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}) // ส่ง error จริงกลับไปชั่วคราว
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "OTP sent successfully"})
}

// Verify OTP
func VerifyOTPHandler(c *gin.Context) {
	var req struct {
		Email string `json:"email"`
		OTP   string `json:"otp"`
	}

	// อ่าน JSON แค่ครั้งเดียว
	if err := c.ShouldBindJSON(&req); err != nil {
		fmt.Println("BIND ERROR:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	fmt.Println("Verify OTP:", req.Email, req.OTP)

	// ตรวจสอบ OTP
	if !VerifyOTP(req.Email, req.OTP) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired OTP"})
		return
	}

	// ถ้า OTP ถูกต้อง
	c.JSON(http.StatusOK, gin.H{"message": "OTP verified successfully"})
}
