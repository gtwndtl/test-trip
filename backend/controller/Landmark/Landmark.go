package Landmark

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"github.com/gtwndtl/trip-spark-builder/entity" // ปรับตามชื่อ module ของคุณ
)

type LandmarkController struct {
	DB *gorm.DB
}

func NewLandmarkController(db *gorm.DB) *LandmarkController {
	return &LandmarkController{DB: db}
}

// POST /landmarks
func (ctrl *LandmarkController) CreateLandmark(c *gin.Context) {
	var landmark entity.Landmark
	if err := c.ShouldBindJSON(&landmark); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := ctrl.DB.Create(&landmark).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเพิ่มข้อมูลได้"})
		return
	}
	c.JSON(http.StatusOK, landmark)
}

// GET /landmarks
func (ctrl *LandmarkController) GetAllLandmarks(c *gin.Context) {
	var landmarks []entity.Landmark
	if err := ctrl.DB.Find(&landmarks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ดึงข้อมูลไม่สำเร็จ"})
		return
	}
	c.JSON(http.StatusOK, landmarks)
}

// GET /landmarks/:id
func (ctrl *LandmarkController) GetLandmarkByID(c *gin.Context) {
	id := c.Param("id")
	var landmark entity.Landmark
	if err := ctrl.DB.First(&landmark, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบสถานที่"})
		return
	}
	c.JSON(http.StatusOK, landmark)
}

// PUT /landmarks/:id
func (ctrl *LandmarkController) UpdateLandmark(c *gin.Context) {
	id := c.Param("id")
	var landmark entity.Landmark
	if err := ctrl.DB.First(&landmark, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูล"})
		return
	}

	if err := c.ShouldBindJSON(&landmark); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctrl.DB.Save(&landmark)
	c.JSON(http.StatusOK, landmark)
}

// DELETE /landmarks/:id
func (ctrl *LandmarkController) DeleteLandmark(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.Landmark{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถลบข้อมูลได้"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "ลบข้อมูลเรียบร้อยแล้ว"})
}
