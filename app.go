package main

import (
	"context"
	"encoding/json"
	"io"
	"os"

	"github.com/tjarratt/babble"
)

type Response struct {
	Word string
}

type Data struct {
	Wpm  float32 `json:"wpm"`
	Awpm float32 `json:"awpm"`
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
	babbler := babble.NewBabbler()
	babbler.Count = 1
	return babbler.Babble()
}

func (a *App) SaveResult(wpm float32, awpm float32) {
	if _, err := os.Stat("data.json"); err != nil {
		file, _ := os.Create("data.json")
		defer file.Close()
	} else {
		file, err := os.Open("data.json")
		if err != nil {
			panic(err)
		}

		defer file.Close()

		byteValue, _ := io.ReadAll(file)

		var data Data
		json.Unmarshal(byteValue, &data)

		if wpm > data.Wpm {
			wpm_data := Data{
				Wpm:  wpm,
				Awpm: data.Awpm,
			}
			f, _ := json.MarshalIndent(wpm_data, "", " ")

			_ = os.WriteFile("data.json", f, 0644)
		}

		if awpm > data.Awpm {
			awpm_data := Data{
				Wpm:  wpm,
				Awpm: awpm,
			}
			f, _ := json.MarshalIndent(awpm_data, "", " ")

			_ = os.WriteFile("data.json", f, 0644)
		}
	}
}

func (a *App) GetData() [2]float32 {
	if _, err := os.Stat("data.json"); err != nil {
		file, _ := os.Create("data.json")
		defer file.Close()
	} else {
		file, err := os.Open("data.json")
		if err != nil {
			panic(err)
		}

		defer file.Close()

		byteValue, _ := io.ReadAll(file)

		var data Data
		json.Unmarshal(byteValue, &data)

		resp := [2]float32{data.Wpm, data.Awpm}
		return resp
	}

	d := [2]float32{0, 0}
	return d
}
