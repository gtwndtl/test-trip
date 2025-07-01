package Restaurant

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"github.com/gtwndtl/trip-spark-builder/entity" // ปรับตามชื่อ module ของคุณ
)

type RestaurantController struct {
	DB *gorm.DB
}

func NewRestaurantController(db *gorm.DB) *RestaurantController {
	return &RestaurantController{DB: db}
}

// POST /restaurants
func (ctrl *RestaurantController) CreateRestaurant(c *gin.Context) {
	var restaurant entity.Restaurant
	if err := c.ShouldBindJSON(&restaurant); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := ctrl.DB.Create(&restaurant).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถบันทึกข้อมูลได้"})
		return
	}
	c.JSON(http.StatusOK, restaurant)
}

// GET /restaurants
func (ctrl *RestaurantController) GetAllRestaurants(c *gin.Context) {
	var restaurants []entity.Restaurant
	if err := ctrl.DB.Find(&restaurants).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "เกิดข้อผิดพลาดในการดึงข้อมูล"})
		return
	}
	c.JSON(http.StatusOK, restaurants)
}

// GET /restaurants/:id
func (ctrl *RestaurantController) GetRestaurantByID(c *gin.Context) {
	id := c.Param("id")
	var restaurant entity.Restaurant
	if err := ctrl.DB.First(&restaurant, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบร้านอาหารนี้"})
		return
	}
	c.JSON(http.StatusOK, restaurant)
}

// PUT /restaurants/:id
func (ctrl *RestaurantController) UpdateRestaurant(c *gin.Context) {
	id := c.Param("id")
	var restaurant entity.Restaurant
	if err := ctrl.DB.First(&restaurant, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูล"})
		return
	}

	if err := c.ShouldBindJSON(&restaurant); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctrl.DB.Save(&restaurant)
	c.JSON(http.StatusOK, restaurant)
}

// DELETE /restaurants/:id
func (ctrl *RestaurantController) DeleteRestaurant(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.Restaurant{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถลบข้อมูลได้"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "ลบข้อมูลเรียบร้อยแล้ว"})
}
