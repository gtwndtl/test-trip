package config

import (
	"fmt"
	"time"

	"github.com/gtwndtl/trip-spark-builder/entity"
	"gorm.io/driver/sqlite"
	"github.com/xuri/excelize/v2"
	"gorm.io/gorm"
	"strconv"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("final.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

func SetupDatabase() {
	db.AutoMigrate(
		//ระบบจัดการข้อมูลอาจารย์
		&entity.Accommodation{},
		&entity.Condition{},
		&entity.Landmark{},
		&entity.Restaurant{},
		&entity.Shortestpath{},
		&entity.Trips{},
		&entity.User{},
	)
	fmt.Println("✅ Tables migrated successfully")
}

func LoadExcelData(db *gorm.DB) {
	loadAccommodations(db)
	loadLandmarks(db)
	loadRestaurants(db)
}

func loadAccommodations(db *gorm.DB) {
	f, err := excelize.OpenFile("config/Attraction_data_4.xlsx")
	if err != nil {
		panic(err)
	}

	rows, err := f.GetRows("Sheet1")
	if err != nil {
		panic(err)
	}

	for i, row := range rows {
		if i == 0 || len(row) < 10 { // ข้าม header หรือแถวไม่ครบ
			continue
		}
		lat, _ := strconv.ParseFloat(row[3], 32)
		lon, _ := strconv.ParseFloat(row[4], 32)
		place, _ := strconv.Atoi(row[0])

		data := entity.Accommodation{
			PlaceID:      place,
			Name:         row[1],
			Category:     row[2],
			Lat:          float32(lat),
			Lon:          float32(lon),
			Province:     row[6],
			District:     row[7],
			SubDistrict:  row[8],
			Postcode:     row[9],
			ThumbnailURL: row[10],
			Time_open:    time.Now(),
			Time_close:   time.Now(),
			Total_people: 0,
			Price:        0.00,
			Review:       0,
		}
		db.Create(&data)
	}
}

func loadLandmarks(db *gorm.DB) {
	f, err := excelize.OpenFile("config/places_data_3.xlsx")
	if err != nil {
		panic(err)
	}

	rows, err := f.GetRows("Sheet1")
	if err != nil {
		panic(err)
	}

	for i, row := range rows {
		if i == 0 || len(row) < 7 {
			continue
		}
		lat, _ := strconv.ParseFloat(row[3], 32)
		lon, _ := strconv.ParseFloat(row[4], 32)
		place, _ := strconv.Atoi(row[0])

		data := entity.Landmark{
			PlaceID:      place,
			Name:         row[1],
			Category:     row[2],
			Lat:          float32(lat),
			Lon:          float32(lon),
			Province:     row[6],
			District:     row[7],
			SubDistrict:  row[8],
			Postcode:     row[9],
			ThumbnailURL: row[10],
			Time_open:    time.Now(),
			Time_close:   time.Now(),
			Total_people: 0,
			Price:        0.00,
			Review:       0,
		}
		db.Create(&data)
	}
}

func loadRestaurants(db *gorm.DB) {
	f, err := excelize.OpenFile("config/rharn.xlsx")
	if err != nil {
		panic(err)
	}

	rows, err := f.GetRows("Sheet1")
	if err != nil {
		panic(err)
	}

	for i, row := range rows {
		if i == 0 || len(row) < 9 {
			continue
		}
		lat, _ := strconv.ParseFloat(row[3], 32)
		lon, _ := strconv.ParseFloat(row[4], 32)
		place, _ := strconv.Atoi(row[0])

		data := entity.Restaurant{
			PlaceID:      place,
			Name:         row[1],
			Category:     row[2],
			Lat:          float32(lat),
			Lon:          float32(lon),
			Province:     row[6],
			District:     row[7],
			SubDistrict:  row[8],
			Postcode:     row[9],
			ThumbnailURL: row[10],
			Time_open:    time.Now(),
			Time_close:   time.Now(),
			Total_people: 0,
			Price:        0.00,
			Review:       0,
		}
		db.Create(&data)
	}
}
