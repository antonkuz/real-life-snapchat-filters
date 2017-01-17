package main

import (
	"html/template"
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
	// tmpl, _ := template.ParseFiles("face_tracker.htm")
	tmpl, _ := template.ParseFiles("webcam example.htm")
	tmpl.Execute(w, "whatever")
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true }, //not checking origin
}

func (app *webapp) wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, _ := upgrader.Upgrade(w, r, nil)
	app.playerConn = conn
	app.connectedToPlayer = true
	//push videos that have been proposed so far
	for _, videoID := range app.playlist {
		videoData := map[string]string{
			"id":    videoID,
			"title": app.playlistNames[videoID],
		}
		conn.WriteJSON(videoData)
	}
}

func main() {
	http.HandleFunc("/", handler) // handler on initial landing page
	http.HandleFunc("/ws_camera", wsCamera)
	http.HandleFunc("/ws_projector", wsProjector)
	// for serving js file that's referenced in html
	s := "webcam example_files"
	fs := http.FileServer(http.Dir(s))
	s2 := "/" + s + "/"
	http.Handle(s2, http.StripPrefix(s2, fs))
	http.ListenAndServe(":8080", nil) // webserver running access http://localhost:8080/
}
