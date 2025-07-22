package Distance

import (
	"math"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type DistanceController struct {
	MysqlDB   *gorm.DB
	PostgisDB *gorm.DB
}

func NewDistanceController(mysqlDB *gorm.DB) *DistanceController {
	return &DistanceController{
		MysqlDB: mysqlDB,
	}
}

type DistanceNeighbor struct {
	To       string  `json:"to"`
	Distance float64 `json:"distance"` // km
}

func (ctrl *DistanceController) GetDistances(c *gin.Context) {
	type DistanceResult struct {
		FromType string
		FromID   int
		ToType   string
		ToID     int
		Distance float64
	}

	var distances []DistanceResult
	err := ctrl.PostgisDB.Raw(`
		WITH all_points AS (
			SELECT 'P' AS type, landmark_id AS id, location FROM landmark_gis
			UNION ALL
			SELECT 'A' AS type, acc_id AS id, location FROM accommodation_gis
			UNION ALL
			SELECT 'R' AS type, restaurant_id AS id, location FROM restaurant_gis
		)
		SELECT
			a.type AS from_type, a.id AS from_id,
			b.type AS to_type, b.id AS to_id,
			ST_DistanceSphere(a.location, b.location) AS distance
		FROM all_points a
		JOIN all_points b ON (a.type != b.type OR a.id != b.id)
		
	`).Scan(&distances).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate distances"})
		return
	}

	graph := make(map[string][]DistanceNeighbor)

	for _, d := range distances {
		fromKey := d.FromType + strconv.Itoa(d.FromID)
		toKey := d.ToType + strconv.Itoa(d.ToID)

		distKm := math.Round((d.Distance/1000)*100) / 100

		graph[fromKey] = append(graph[fromKey], DistanceNeighbor{
			To:       toKey,
			Distance: distKm,
		})
	}

	c.JSON(http.StatusOK, graph)
}
