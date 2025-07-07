package GenTrip

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
    "os/exec"

    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

type RouteController struct {
    DB *gorm.DB
}

type PythonResult struct {
    RouteDescription string `json:"route_description"`
    Paths            []struct {
        From       string  `json:"from"`
        FromName   string  `json:"from_name"`
        To         string  `json:"to"`
        ToName     string  `json:"to_name"`
        DistanceKm float64 `json:"distance_km"`
    } `json:"paths"`
    TotalDistanceKm float64 `json:"total_distance_km"`
    ElapsedSeconds  float64 `json:"elapsed_seconds"`
    Message         string  `json:"message"`
    Error           string  `json:"error,omitempty"`
}

func (rc *RouteController) GenerateRoute(c *gin.Context) {
    startNode := c.Query("start")
    if startNode == "" {
        var req struct {
            Start string `json:"start"`
        }
        if err := c.ShouldBindJSON(&req); err != nil || req.Start == "" {
            c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาระบุ start ผ่าน query param หรือ JSON body"})
            return
        }
        startNode = req.Start
    }

    cmd := exec.Command(
        "python",
        "Code.py",
        startNode,
    )

    var stderr bytes.Buffer
    cmd.Stderr = &stderr

    var outBuf, errBuf bytes.Buffer
    cmd.Stdout = &outBuf
    cmd.Stderr = &errBuf

    err := cmd.Run()  // ใช้ Run แทน Output เพราะเราจัด stdout/stderr เอง
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
