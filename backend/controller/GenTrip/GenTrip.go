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
	Start     string `json:"start"`
	StartName string `json:"start_name"`
	Paths     []struct {
		From       string  `json:"from"`
		FromName   string  `json:"from_name"`
		To         string  `json:"to"`
		ToName     string  `json:"to_name"`
		DistanceKm float64 `json:"distance_km"`
	} `json:"paths"`
	TotalDistanceKm float64 `json:"total_distance_km"`
	Message         string  `json:"message"`
	Error           string  `json:"error,omitempty"`
}

func (rc *RouteController) GenerateRoute(c *gin.Context) {
	startNode := c.Query("start")
	daysStr := c.Query("days")

	if startNode == "" || daysStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาระบุ start และ days ผ่าน query parameters"})
		return
	}

	days, err := strconv.Atoi(daysStr)
	if err != nil || days <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "days ต้องเป็นจำนวนเต็มบวก"})
		return
	}

	cmd := exec.Command(
		"python",
		"Code.py", // ชื่อไฟล์ Python script ของคุณ
		startNode,
		daysStr,
	)

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	var outBuf, errBuf bytes.Buffer
	cmd.Stdout = &outBuf
	cmd.Stderr = &errBuf

	err = cmd.Run()
	output := outBuf.Bytes()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("รัน Python script ไม่ได้: %s, stderr: %s, stdout: %s", err.Error(), errBuf.String(), outBuf.String()),
		})
		return
	}

	var result PythonResult
	if err := json.Unmarshal(output, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("แปลงผลลัพธ์จาก Python ไม่ได้: %s, output: %s", err.Error(), string(output)),
		})
		return
	}

	if result.Error != "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, result)
}
