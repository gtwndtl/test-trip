package User

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"github.com/gtwndtl/trip-spark-builder/entity"
	"github.com/gtwndtl/trip-spark-builder/config"
	"golang.org/x/crypto/bcrypt"

	"github.com/gtwndtl/trip-spark-builder/services"
)

type UserController struct {
	DB *gorm.DB
}

func NewUserController(db *gorm.DB) *UserController {
	return &UserController{DB: db}
}

// POST /users
func (ctrl *UserController) CreateUser(c *gin.Context) {
	var user entity.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ✅ ตรวจสอบว่ามีรหัสผ่าน
	if user.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ต้องระบุรหัสผ่าน"})
		return
	}

	// ✅ เข้ารหัส (hash) รหัสผ่าน
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเข้ารหัสรหัสผ่านได้"})
		return
	}
	user.Password = string(hashedPassword)

	// ✅ สร้างผู้ใช้
	if err := ctrl.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถสร้างผู้ใช้ได้"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// GET /users
func (ctrl *UserController) GetAllUsers(c *gin.Context) {
	var users []entity.User
	if err := ctrl.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลผู้ใช้ได้"})
		return
	}
	c.JSON(http.StatusOK, users)
}

// GET /users/:id
func (ctrl *UserController) GetUserByID(c *gin.Context) {
	id := c.Param("id")
	var user entity.User
	if err := ctrl.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบผู้ใช้งาน"})
		return
	}
	c.JSON(http.StatusOK, user)
}

// PUT /users/:id
func (ctrl *UserController) UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var user entity.User
	if err := ctrl.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบผู้ใช้"})
		return
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctrl.DB.Save(&user)
	c.JSON(http.StatusOK, user)
}

// DELETE /users/:id
func (ctrl *UserController) DeleteUser(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.User{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถลบผู้ใช้ได้"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "ลบผู้ใช้เรียบร้อยแล้ว"})
}

type (
	Authen struct {
		Email string 

		Password string 
	}
)

func (ctrl *UserController) SignInUser(c *gin.Context) {
    var payload Authen
    var user entity.User

    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ค้นหา user ด้วย email
    if err := config.DB().Raw("SELECT * FROM users WHERE email = ?", payload.Email).Scan(&user).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบผู้ใช้งาน"})
        return
    }

    // ตรวจสอบรหัสผ่าน
    err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสผ่านไม่ถูกต้อง"})
        return
    }

    // สร้าง JWT Token
    jwtWrapper := services.JwtWrapper{
        SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
        Issuer:          "AuthService",
        ExpirationHours: 24,
    }

    signedToken, err := jwtWrapper.GenerateToken(user.Email, user.ID) // ✅ ส่ง user.ID
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "เกิดข้อผิดพลาดในการสร้าง token"})
        return
    }

    // ส่ง token กลับไป
    c.JSON(http.StatusOK, gin.H{
        "token_type": "Bearer",
        "token":      signedToken,
        "id":         user.ID,
    })
}

type ChangePasswordInput struct {
	CurrentPassword string `json:"currentPassword" binding:"required"`
	NewPassword     string `json:"newPassword" binding:"required"`
}

func (ctrl *UserController) ChangePassword(c *gin.Context) {
    var input ChangePasswordInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    uid, exists := c.Get("user_id")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "ไม่พบ user ใน token"})
        return
    }

    floatID, ok := uid.(float64)
    if !ok {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถอ่าน user id จาก token ได้"})
        return
    }
    userID := uint(floatID)

    var user entity.User
    if err := ctrl.DB.First(&user, userID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบผู้ใช้งาน"})
        return
    }

    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.CurrentPassword)); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสผ่านเดิมไม่ถูกต้อง"})
        return
    }

    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเข้ารหัส รหัสผ่านใหม่ได้"})
        return
    }

    user.Password = string(hashedPassword)
    if err := ctrl.DB.Save(&user).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถบันทึกรหัสผ่านใหม่ได้"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว"})
}
