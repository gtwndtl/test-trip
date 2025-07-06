package middlewares

import (
    "net/http"
    "strings"
	"fmt"

    "github.com/dgrijalva/jwt-go"
    "github.com/gin-gonic/gin"
)

var SecretKey = []byte("SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx") // ให้ตรงกับ JwtWrapper

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
		fmt.Println("AuthMiddleware: เริ่มตรวจสอบ token")
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "ไม่มี token"})
            c.Abort()
            return
        }

        if !strings.HasPrefix(authHeader, "Bearer ") {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "รูปแบบ token ไม่ถูกต้อง"})
            c.Abort()
            return
        }

        tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
        token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
            if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, gin.Error{
                    Err:  http.ErrAbortHandler,
                    Type: gin.ErrorTypePublic,
                }
            }
            return SecretKey, nil
        })

        if err != nil || !token.Valid {
			fmt.Println("AuthMiddleware: token ไม่ถูกต้อง", err)
            c.JSON(http.StatusUnauthorized, gin.H{"error": "token ไม่ถูกต้องหรือหมดอายุ"})
            c.Abort()
            return
        }

        claims, ok := token.Claims.(jwt.MapClaims)
        if !ok {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "ไม่สามารถอ่าน claims จาก token"})
            c.Abort()
            return
        }

        userID, ok := claims["user_id"]
        if !ok {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "token ไม่มี user_id"})
            c.Abort()
            return
        }
		fmt.Println("AuthMiddleware: token ผ่าน ตรวจเจอ user_id =", userID)
        c.Set("user_id", userID)
        c.Next()
    }
}
