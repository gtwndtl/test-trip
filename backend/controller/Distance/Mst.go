package Distance

import (

	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type MSTRow struct {
    Seq      int     `gorm:"column:seq"`
    Depth    int     `gorm:"column:depth"`
    StartVID int     `gorm:"column:start_vid"`
    Pred     int     `gorm:"column:pred"`
    Node     int     `gorm:"column:node"`
    EdgeID   int     `gorm:"column:edge"`
    Cost     float64 `gorm:"column:cost"`
    AggCost  float64 `gorm:"column:agg_cost"`
}


func (ctrl *DistanceController) GetMST(c *gin.Context) {
    rootStr := c.Query("root")
    root, err := strconv.Atoi(rootStr)
    if err != nil || root < 1 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid root landmark id"})
        return
    }

    maxDistStr := c.DefaultQuery("maxdist", "5000")
    maxDist, err := strconv.ParseFloat(maxDistStr, 64)
    if err != nil {
        maxDist = 5000
    }

    type MSTRow struct {
        Seq      int     `gorm:"column:seq"`
        Depth    int     `gorm:"column:depth"`
        StartVID int     `gorm:"column:start_vid"`
        Pred     int     `gorm:"column:pred"`
        Node     int     `gorm:"column:node"`
        EdgeID   int     `gorm:"column:edge"`
        Cost     float64 `gorm:"column:cost"`
        AggCost  float64 `gorm:"column:agg_cost"`
    }

    var results []MSTRow
    query := `
    SELECT * FROM pgr_primDD(
      $$
      WITH edges AS (
        SELECT
          ROW_NUMBER() OVER () AS id,
          l1.landmark_id AS source,
          l2.landmark_id AS target,
          ST_DistanceSphere(l1.location, l2.location) AS cost,
          ST_DistanceSphere(l1.location, l2.location) AS reverse_cost
        FROM landmark_gis l1
        JOIN landmark_gis l2 ON l1.landmark_id <> l2.landmark_id
      )
      SELECT id, source, target, cost, reverse_cost FROM edges
      $$::text,
      $1::int,
      $2::float8
    );
    `

    err = ctrl.PostgisDB.Raw(query, root, maxDist).Scan(&results).Error
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to run MST query"})
        return
    }

    c.JSON(http.StatusOK, results)
}
