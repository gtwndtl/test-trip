package Accommodation

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"github.com/gtwndtl/trip-spark-builder/entity" 
)

type AccommodationController struct {
	DB *gorm.DB
}

func NewAccommodationController(db *gorm.DB) *AccommodationController {
	return &AccommodationController{DB: db}
}

// POST /accommodations
func (ctrl *AccommodationController) CreateAccommodation(c *gin.Context) {
	var accommodation entity.Accommodation
	if err := c.ShouldBindJSON(&accommodation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := ctrl.DB.Create(&accommodation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถบันทึกข้อมูลได้"})
		return
	}
	c.JSON(http.StatusOK, accommodation)
}

// GET /accommodations
func (ctrl *AccommodationController) GetAll(c *gin.Context) {
	var accommodations []entity.Accommodation
	if err := ctrl.DB.Find(&accommodations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "เกิดข้อผิดพลาดในการดึงข้อมูล"})
		return
	}
	c.JSON(http.StatusOK, accommodations)
}

// GET /accommodations/:id
func (ctrl *AccommodationController) GetByID(c *gin.Context) {
	id := c.Param("id")
	var accommodation entity.Accommodation
	if err := ctrl.DB.First(&accommodation, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูล"})
		return
	}
	c.JSON(http.StatusOK, accommodation)
}

// PUT /accommodations/:id
func (ctrl *AccommodationController) Update(c *gin.Context) {
	id := c.Param("id")
	var accommodation entity.Accommodation
	if err := ctrl.DB.First(&accommodation, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูล"})
		return
	}

	if err := c.ShouldBindJSON(&accommodation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctrl.DB.Save(&accommodation)
	c.JSON(http.StatusOK, accommodation)
}

// DELETE /accommodations/:id
func (ctrl *AccommodationController) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.Accommodation{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ลบไม่สำเร็จ"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "ลบสำเร็จ"})
}
