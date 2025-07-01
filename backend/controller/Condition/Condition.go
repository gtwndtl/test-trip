package Condition

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"github.com/gtwndtl/trip-spark-builder/entity" 
)

type ConditionController struct {
	DB *gorm.DB
}

func NewConditionController(db *gorm.DB) *ConditionController {
	return &ConditionController{DB: db}
}

// POST /conditions
func (ctrl *ConditionController) Create(c *gin.Context) {
	var condition entity.Condition
	if err := c.ShouldBindJSON(&condition); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := ctrl.DB.Create(&condition).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถบันทึกข้อมูลได้"})
		return
	}
	c.JSON(http.StatusOK, condition)
}

// GET /conditions
func (ctrl *ConditionController) GetAll(c *gin.Context) {
	var conditions []entity.Condition
	if err := ctrl.DB.Preload("User").Find(&conditions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลได้"})
		return
	}
	c.JSON(http.StatusOK, conditions)
}

// GET /conditions/:id
func (ctrl *ConditionController) GetByID(c *gin.Context) {
	id := c.Param("id")
	var condition entity.Condition
	if err := ctrl.DB.Preload("User").First(&condition, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูล"})
		return
	}
	c.JSON(http.StatusOK, condition)
}

// PUT /conditions/:id
func (ctrl *ConditionController) Update(c *gin.Context) {
	id := c.Param("id")
	var condition entity.Condition
	if err := ctrl.DB.First(&condition, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูล"})
		return
	}
	if err := c.ShouldBindJSON(&condition); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctrl.DB.Save(&condition)
	c.JSON(http.StatusOK, condition)
}

// DELETE /conditions/:id
func (ctrl *ConditionController) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.Condition{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ลบไม่สำเร็จ"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "ลบสำเร็จ"})
}
