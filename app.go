package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type Response struct {
	Word string
}

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) FetchWord() string {
	var url string = "https://random-word-api.herokuapp.com/word"
	response, err := http.Get(url)

	if err != nil {
		log.Fatal(err)
		return ""
	}

	responseData, err := io.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
	}

	var resp Response
	json.Unmarshal(responseData, &resp)
	fmt.Println(string(responseData))
	return string(responseData)
}
