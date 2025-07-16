package Trips

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gtwndtl/trip-spark-builder/entity"
	"gorm.io/gorm"
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
		Preload("ShortestPaths", func(db *gorm.DB) *gorm.DB {
			return db.Order("day, path_index")
		}).
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
		Preload("ShortestPaths", func(db *gorm.DB) *gorm.DB {
			return db.Order("day, path_index")
		}).
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
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลทริป"})
		return
	}

	var input entity.Trips
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	trip.Name = input.Name
	trip.Types = input.Types
	trip.Days = input.Days
	trip.Con_id = input.Con_id
	trip.Acc_id = input.Acc_id

	if err := ctrl.DB.Save(&trip).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถอัพเดตข้อมูลได้"})
		return
	}

	c.JSON(http.StatusOK, trip)
}

// DELETE /trips/:id
func (ctrl *TripsController) DeleteTrip(c *gin.Context) {
	id := c.Param("id")

	if err := ctrl.DB.Where("trip_id = ?", id).Delete(&entity.Shortestpath{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถลบเส้นทางได้"})
		return
	}

	if err := ctrl.DB.Delete(&entity.Trips{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถลบทริปได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ลบข้อมูลสำเร็จ"})
}
