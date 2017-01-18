package main

import (
	"encoding/json"
	"fmt"
	"gorilla/websocket"
	"html/template"
	"net/http"
)

type webapp struct {
	cameraConn      *websocket.Conn
	projectorConn   *websocket.Conn
	calirationArray [][]int
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
	data := map[string]string{
		"hello": "lol",
	}
	conn.WriteJSON(data)
}

func (app *webapp) wsProjectorHandler(w http.ResponseWriter, r *http.Request) {
	conn, _ := upgrader.Upgrade(w, r, nil)
	app.projectorConn = conn
	data := map[string]string{
		"hello": "lol",
	}
	conn.WriteJSON(data)
	go func() {
		for {
			messageType, p, err := app.cameraConn.ReadMessage()
			if err != nil {
				println("Error in ReadMessage!")
			}
			if err = conn.WriteMessage(messageType, p); err != nil {
				println("error in WriteMessage!!")
				return
			}
		}
	}()
}

type postProposalRequestData struct {
	Positions [][]int
}

func (app *webapp) postPositionsHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var data postProposalRequestData
	decoder.Decode(&data)
	defer r.Body.Close()
	app.calirationArray = data.Positions

	fmt.Println(data.Positions)

	result := make(map[string]bool)
	result["thx"] = true

	marshalled, _ := json.Marshal(result)
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Write(marshalled)
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
