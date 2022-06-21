package main

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"time"
)

func InternalServer(c *gin.Context) {
	c.Status(http.StatusInternalServerError)
}

func BadRequest(c *gin.Context) {
	c.Status(http.StatusBadRequest)
}

func main() {
	var database Database
	database.List = append(database.List, Product{
		ID:    0,
		Title: "123",
		Body:  "Papulova",
	})

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "POST", "GET", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Access-Control-Allow-Headers", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// CREATE
	router.POST("/product", func(c *gin.Context) {
		var input InputNote

		if err := c.BindJSON(&input); err != nil {
			InternalServer(c)
			fmt.Println(err.Error())
			return
		}

		if input.Body == "" || input.Title == "" {
			BadRequest(c)
			fmt.Println("Пустые поля")
			return
		}

		var output Product
		output.ID = len(database.List)
		output.Body = input.Body
		output.Title = input.Title

		database.List = append(database.List, output)

		c.Status(http.StatusOK)
	})

	// GET
	router.GET("", func(c *gin.Context) {
		var output Database

		for _, e := range database.List {
			fmt.Println(e)
			if e.Deleted == false {
				output.List = append(output.List, e)
			}
		}

		c.JSON(http.StatusOK, output)
	})

	// UPDATE
	router.PUT("/:item_id", func(c *gin.Context) {
		idString := c.Param("item_id")

		if idString == "" {
			BadRequest(c)
			return
		}

		id, err := strconv.Atoi(idString)
		if err != nil || id < 0 || id > len(database.List)-1 {
			BadRequest(c)
			return
		}

		var inputTitleBody InputNote
		if err = c.BindJSON(&inputTitleBody); err != nil {
			BadRequest(c)
			return
		}

		database.List[id].Title = inputTitleBody.Title
		database.List[id].Body = inputTitleBody.Body

		c.Status(http.StatusOK)
	})

	// DELETE
	router.DELETE("/:item_id", func(c *gin.Context) {
		idString := c.Param("item_id")

		if idString == "" {
			BadRequest(c)
			return
		}

		id, err := strconv.Atoi(idString)
		if err != nil || id < 0 || id > len(database.List)-1 {
			BadRequest(c)
			return
		}

		database.List[id].Deleted = true

		c.Status(http.StatusOK)
	})

	router.Run()
}

type Database struct {
	List []Product `json:"list"`
}

type Product struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Body    string `json:"body"`
	Deleted bool   `json:"-"`
}

type InputNote struct {
	Title string `json:"title"`
	Body  string `json:"body"`
}
