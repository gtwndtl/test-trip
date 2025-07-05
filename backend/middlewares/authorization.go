package middlewares

import (
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

var SecretKey = []byte("your_secret_key")

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "ไม่มี token"})
			c.Abort()
			return
		}

		// ตรวจสอบว่า header เริ่มด้วย "Bearer "
		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "รูปแบบ token ไม่ถูกต้อง"})
			c.Abort()
			return
		}

		// ดึง token ออกมา
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		// Parse และตรวจสอบ token
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			// ตรวจสอบ signing method ให้มั่นใจว่าใช้ HMAC
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, gin.Error{
					Err:  http.ErrAbortHandler,
					Type: gin.ErrorTypePublic,
				}
			}
			return SecretKey, nil
		})

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "token ไม่ถูกต้อง: " + err.Error()})
			c.Abort()
			return
		}

		if !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "token หมดอายุหรือไม่ถูกต้อง"})
			c.Abort()
			return
		}

		// ดึง claims และตั้งค่า user_id ลง context
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "ไม่สามารถอ่านข้อมูลจาก token"})
			c.Abort()
			return
		}

		userID, ok := claims["user_id"]
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "token ไม่มี user_id"})
			c.Abort()
			return
		}

		// ตั้งค่า user_id ใน context เพื่อให้ handler ดึงไปใช้งานได้
		c.Set("user_id", userID)

		c.Next()
	}
}
