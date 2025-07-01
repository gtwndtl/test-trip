package main

import (
	"github.com/gin-gonic/gin"

	"github.com/gtwndtl/trip-spark-builder/config"
	"github.com/gtwndtl/trip-spark-builder/controller/Accommodation"
	"github.com/gtwndtl/trip-spark-builder/controller/Condition"
	"github.com/gtwndtl/trip-spark-builder/controller/Landmark"
	"github.com/gtwndtl/trip-spark-builder/controller/Restaurant"
	"github.com/gtwndtl/trip-spark-builder/controller/Shortestpath"
	"github.com/gtwndtl/trip-spark-builder/controller/Trips"
	"github.com/gtwndtl/trip-spark-builder/controller/User"
)

func main() {
	// สร้างการเชื่อมต่อฐานข้อมูล และเก็บไว้ใน config.db
	config.ConnectionDB()

	// ดึงตัวแปร db ที่เก็บ connection ออกมาใช้
	db := config.DB()

	// สร้างตาราง (migrate)
	config.SetupDatabase()// ✅ Create tables first

	config.LoadExcelData(config.DB())// ✅ Load data after tables exist

	r := gin.Default()

	accommodationCtrl := Accommodation.NewAccommodationController(db)
	r.POST("/accommodations", accommodationCtrl.CreateAccommodation)
	r.GET("/accommodations", accommodationCtrl.GetAll)
	r.GET("/accommodations/:id", accommodationCtrl.GetByID)
	r.PUT("/accommodations/:id", accommodationCtrl.Update)
	r.DELETE("/accommodations/:id", accommodationCtrl.Delete)

	conditionCtrl := Condition.NewConditionController(db)
	r.POST("/conditions", conditionCtrl.Create)
	r.GET("/conditions", conditionCtrl.GetAll)
	r.GET("/conditions/:id", conditionCtrl.GetByID)
	r.PUT("/conditions/:id", conditionCtrl.Update)
	r.DELETE("/conditions/:id", conditionCtrl.Delete)

	landmarkCtrl := Landmark.NewLandmarkController(db)
	r.POST("/landmarks", landmarkCtrl.CreateLandmark)
	r.GET("/landmarks", landmarkCtrl.GetAllLandmarks)
	r.GET("/landmarks/:id", landmarkCtrl.GetLandmarkByID)
	r.PUT("/landmarks/:id", landmarkCtrl.UpdateLandmark)
	r.DELETE("/landmarks/:id", landmarkCtrl.DeleteLandmark)

	restaurantCtrl := Restaurant.NewRestaurantController(db)
	r.POST("/restaurants", restaurantCtrl.CreateRestaurant)
	r.GET("/restaurants", restaurantCtrl.GetAllRestaurants)
	r.GET("/restaurants/:id", restaurantCtrl.GetRestaurantByID)
	r.PUT("/restaurants/:id", restaurantCtrl.UpdateRestaurant)
	r.DELETE("/restaurants/:id", restaurantCtrl.DeleteRestaurant)

	userCtrl := User.NewUserController(db)
	r.POST("/users", userCtrl.CreateUser)
	r.GET("/users", userCtrl.GetAllUsers)
	r.GET("/users/:id", userCtrl.GetUserByID)
	r.PUT("/users/:id", userCtrl.UpdateUser)
	r.DELETE("/users/:id", userCtrl.DeleteUser)

	tripsCtrl := Trips.NewTripsController(db)
	r.POST("/trips", tripsCtrl.CreateTrip)
	r.GET("/trips", tripsCtrl.GetAllTrips)
	r.GET("/trips/:id", tripsCtrl.GetTripByID)
	r.PUT("/trips/:id", tripsCtrl.UpdateTrip)
	r.DELETE("/trips/:id", tripsCtrl.DeleteTrip)

	shortestpathCtrl := Shortestpath.NewShortestPathController(db)
	r.POST("/shortest-paths", shortestpathCtrl.CreateShortestPath)
	r.GET("/shortest-paths", shortestpathCtrl.GetAllShortestPaths)
	r.GET("/shortest-paths/:id", shortestpathCtrl.GetShortestPathByID)
	r.PUT("/shortest-paths/:id", shortestpathCtrl.UpdateShortestPath)
	r.DELETE("/shortest-paths/:id", shortestpathCtrl.DeleteShortestPath)

	r.Run() // รันเซิร์ฟเวอร์ที่พอร์ต 8080
}
