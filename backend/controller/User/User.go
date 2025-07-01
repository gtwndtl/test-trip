package User

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"github.com/gtwndtl/trip-spark-builder/entity"
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
