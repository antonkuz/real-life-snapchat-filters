package main

import (
	"encoding/json"
	"fmt"
	"gorilla/websocket"
	"html/template"
	"net/http"
	"time"
)

type webapp struct {
	cameraConn      *websocket.Conn
	projectorConn   *websocket.Conn
}

func (app *webapp) cameraHandler(w http.ResponseWriter, r *http.Request) {
	tmpl, _ := template.ParseFiles("camera.html")
	tmpl.Execute(w, "whatever")
}

func (app *webapp) projectorHandler(w http.ResponseWriter, r *http.Request) {
	tmpl, _ := template.ParseFiles("projector.html")
	tmpl.Execute(w, "whatever")
}

func (app *webapp) calibrationHandler(w http.ResponseWriter, r *http.Request) {
	tmpl, _ := template.ParseFiles("calibration.html")
	tmpl.Execute(w, "whatever")
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true }, //not checking origin
}

func (app *webapp) wsCameraHandler(w http.ResponseWriter, r *http.Request) {
	conn, _ := upgrader.Upgrade(w, r, nil)
	app.cameraConn = conn
	go func() {
		for {
			data := make(map[string]interface{})
			err := conn.ReadJSON(&data)
			if err != nil {
				println("Error in ReadJSON!")
				fmt.Println(err)
				return
			}
			println("sending from camera to projector")
			data["type"] = "positions"
			// fmt.Println(data)
			if err := app.projectorConn.WriteJSON(data); err != nil {
				println("error in WriteJSON!!")
			}
			time.Sleep(time.Second)
		}
	}()
}

func (app *webapp) wsProjectorHandler(w http.ResponseWriter, r *http.Request) {
	conn, _ := upgrader.Upgrade(w, r, nil)
	app.projectorConn = conn
	data := map[string]string{
		"hello": "lol",
	}
	conn.WriteJSON(data)
}

type postProposalRequestData struct {
	Positions [][]int
}

// calibrator positions
func (app *webapp) postPositionsHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var data postProposalRequestData
	decoder.Decode(&data)
	defer r.Body.Close()

	fmt.Println(data)
	fmt.Println(data.Positions)
	w.Write([]byte("got it"))

	calibrationData := map[string]interface{}{
		"type": "calibration",
		"data": data.Positions,
	}
	app.projectorConn.WriteJSON(calibrationData)
}

func main() {
	app := &webapp{}

	http.HandleFunc("/camera", app.cameraHandler)
	http.HandleFunc("/projector", app.projectorHandler)
	http.HandleFunc("/calibration", app.calibrationHandler)
	http.HandleFunc("/post_positions", app.postPositionsHandler)
	http.HandleFunc("/ws_camera", app.wsCameraHandler)
	http.HandleFunc("/ws_projector", app.wsProjectorHandler)
	// for serving js file that's referenced in html
	s := "static"
	fs := http.FileServer(http.Dir(s))
	s2 := "/" + s + "/"
	http.Handle(s2, http.StripPrefix(s2, fs))
	http.ListenAndServe(":8080", nil) // webserver running access http://localhost:8080/
}
