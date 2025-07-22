package GenTrip

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RouteController struct {
	DB *gorm.DB
}

type PythonResult struct {
	Start           string          `json:"start"`
	StartName       string          `json:"start_name"`
	TripPlanByDay   []DayPlan       `json:"trip_plan_by_day"`
	Paths           []PathInfo      `json:"paths"`
	TotalDistanceKm float64         `json:"total_distance_km"`
	Accommodation   *Accommodation  `json:"accommodation,omitempty"`
	Message         string          `json:"message"`
	Error           string          `json:"error,omitempty"`
}

type DayPlan struct {
	Day  int         `json:"day"`
	Plan []PlaceInfo `json:"plan"`
}

type PlaceInfo struct {
	ID   string  `json:"id"`
	Name string  `json:"name"`
	Lat  float64 `json:"lat"`
	Lon  float64 `json:"lon"`
}

type PathInfo struct {
	From       string  `json:"from"`
	FromName   string  `json:"from_name"`
	FromLat    float64 `json:"from_lat"`
	FromLon    float64 `json:"from_lon"`
	To         string  `json:"to"`
	ToName     string  `json:"to_name"`
	ToLat      float64 `json:"to_lat"`
	ToLon      float64 `json:"to_lon"`
	DistanceKm float64 `json:"distance_km"`
	Day        int     `json:"day,omitempty"`
}

type Accommodation struct {
	ID   string  `json:"id"`
	Name string  `json:"name"`
	Lat  float64 `json:"lat"`
	Lon  float64 `json:"lon"`
}

func (rc *RouteController) GenerateRoute(c *gin.Context) {
	startNode := c.Query("start")
	if startNode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาระบุ start ผ่าน query parameters"})
		return
	}

	daysStr := c.DefaultQuery("days", "1")
	days, err := strconv.Atoi(daysStr)
	if err != nil || days < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "days ต้องเป็นจำนวนเต็มบวก"})
		return
	}

	cmd := exec.Command("python", "Code.py", startNode, daysStr)

	var outBuf, errBuf bytes.Buffer
	cmd.Stdout = &outBuf
	cmd.Stderr = &errBuf

	if err := cmd.Run(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("เรียก Python ล้มเหลว: %s, stderr: %s", err.Error(), errBuf.String()),
		})
		return
	}

	output := outBuf.Bytes()
	if len(output) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("ไม่ได้รับผลลัพธ์จาก Python เลย\nstderr: %s", errBuf.String()),
		})
		return
	}

	var pyResult PythonResult
	if err := json.Unmarshal(output, &pyResult); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("แปลงผลลัพธ์จาก Python ไม่ได้: %s\nstdout: %s\nstderr: %s",
				err.Error(), string(output), errBuf.String()),
		})
		return
	}

	if pyResult.Error != "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": pyResult.Error})
		return
	}

	c.JSON(http.StatusOK, pyResult)
}
