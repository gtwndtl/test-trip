package Trips

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"github.com/gtwndtl/trip-spark-builder/entity"
)

type TripsController struct {
	DB *gorm.DB
}

func NewTripsController(db *gorm.DB) *TripsController {
	return &TripsController{DB: db}
}

// POST /trips
func (ctrl *TripsController) CreateTrip(c *gin.Context) {
	var trip entity.Trips
	if err := c.ShouldBindJSON(&trip); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := ctrl.DB.Create(&trip).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถบันทึกข้อมูลได้"})
		return
	}
	c.JSON(http.StatusOK, trip)
}

// GET /trips
func (ctrl *TripsController) GetAllTrips(c *gin.Context) {
	var trips []entity.Trips
	if err := ctrl.DB.
		Preload("Con").
		Preload("Acc").
		Preload("Path").
		Find(&trips).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลได้"})
		return
	}
	c.JSON(http.StatusOK, trips)
}

// GET /trips/:id
func (ctrl *TripsController) GetTripByID(c *gin.Context) {
	id := c.Param("id")
	var trip entity.Trips
	if err := ctrl.DB.
		Preload("Con").
		Preload("Acc").
		Preload("Path").
		First(&trip, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลทริป"})
		return
	}
	c.JSON(http.StatusOK, trip)
}

// PUT /trips/:id
func (ctrl *TripsController) UpdateTrip(c *gin.Context) {
	id := c.Param("id")
	var trip entity.Trips
	if err := ctrl.DB.First(&trip, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูล"})
		return
	}

	if err := c.ShouldBindJSON(&trip); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctrl.DB.Save(&trip)
	c.JSON(http.StatusOK, trip)
}

// DELETE /trips/:id
func (ctrl *TripsController) DeleteTrip(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.Trips{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถลบข้อมูลได้"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "ลบข้อมูลสำเร็จ"})
}
