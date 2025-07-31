package GroqApi

import (
	"context"
	"log"
	"net"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
	"github.com/joho/godotenv"
)

var groqApiKey string
var restyClient *resty.Client

func init() {
	// โหลดไฟล์ .env (ถ้ามี)
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using environment variables")
	}

	groqApiKey = os.Getenv("GROQ_API_KEY")
	if groqApiKey == "" {
		log.Fatal("GROQ_API_KEY is not set")
	}

	// ✅ สร้าง HTTP client ที่ใช้ IPv4 เท่านั้น
	dialer := &net.Dialer{
		Timeout:   5 * time.Second,
		KeepAlive: 30 * time.Second,
		Resolver: &net.Resolver{
			PreferGo: true,
			Dial: func(ctx context.Context, network, address string) (net.Conn, error) {
				return net.Dial("tcp4", address) // ❗️บังคับ IPv4
			},
		},
	}

	transport := &http.Transport{
		DialContext:         dialer.DialContext,
		TLSHandshakeTimeout: 10 * time.Second,
	}

	httpClient := &http.Client{
		Transport: transport,
		Timeout:   30 * time.Second,
	}

	// ✅ สร้าง Resty client พร้อม retry และใช้ HTTP client ที่บังคับ IPv4
	restyClient = resty.NewWithClient(httpClient).
		SetRetryCount(3).
		SetRetryWaitTime(2 * time.Second).
		SetRetryMaxWaitTime(10 * time.Second)
}

type GroqRequest struct {
	Prompt string `json:"prompt"`
}

func PostGroq(c *gin.Context) {
	var req GroqRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid prompt"})
		return
	}

	resp, err := restyClient.R().
		SetHeader("Authorization", "Bearer "+groqApiKey).
		SetHeader("Content-Type", "application/json").
		SetBody(map[string]interface{}{
			"model": "meta-llama/llama-4-scout-17b-16e-instruct",
			"messages": []map[string]string{
				{"role": "system", "content": "You are a helpful travel assistant."},
				{"role": "user", "content": req.Prompt},
			},
			"temperature": 0.7,
		}).
		Post("https://api.groq.com/openai/v1/chat/completions")

	if err != nil {
		log.Println("Groq API error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to contact Groq API"})
		return
	}

	c.Data(resp.StatusCode(), "application/json", resp.Body())
}
