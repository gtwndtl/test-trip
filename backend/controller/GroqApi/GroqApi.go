package GroqApi

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
	"github.com/joho/godotenv"
)

var groqApiKey string

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

	client := resty.New()
	resp, err := client.R().
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
