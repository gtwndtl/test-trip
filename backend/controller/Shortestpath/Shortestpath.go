package Shortestpath

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"github.com/gtwndtl/trip-spark-builder/entity"
)

type ShortestPathController struct {
	DB *gorm.DB
}

func NewShortestPathController(db *gorm.DB) *ShortestPathController {
	return &ShortestPathController{DB: db}
}

// POST /shortest-paths
func (ctrl *ShortestPathController) CreateShortestPath(c *gin.Context) {
	var path entity.Shortestpath
	if err := c.ShouldBindJSON(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := ctrl.DB.Create(&path).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถสร้างข้อมูลได้"})
		return
	}
	c.JSON(http.StatusOK, path)
}

// GET /shortest-paths
func (ctrl *ShortestPathController) GetAllShortestPaths(c *gin.Context) {
	var paths []entity.Shortestpath
	if err := ctrl.DB.Preload("Acc").Preload("Lan").Preload("Res").Find(&paths).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลได้"})
		return
	}
	c.JSON(http.StatusOK, paths)
}

// GET /shortest-paths/:id
func (ctrl *ShortestPathController) GetShortestPathByID(c *gin.Context) {
	id := c.Param("id")
	var path entity.Shortestpath
	if err := ctrl.DB.Preload("Acc").Preload("Lan").Preload("Res").First(&path, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลเส้นทาง"})
		return
	}
	c.JSON(http.StatusOK, path)
}

// PUT /shortest-paths/:id
func (ctrl *ShortestPathController) UpdateShortestPath(c *gin.Context) {
	id := c.Param("id")
	var path entity.Shortestpath
	if err := ctrl.DB.First(&path, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูล"})
		return
	}

	if err := c.ShouldBindJSON(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctrl.DB.Save(&path)
	c.JSON(http.StatusOK, path)
}

// DELETE /shortest-paths/:id
func (ctrl *ShortestPathController) DeleteShortestPath(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.Shortestpath{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถลบข้อมูลได้"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "ลบข้อมูลสำเร็จ"})
}
