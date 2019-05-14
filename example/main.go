package main

import (
	"log"
	"net"
	"net/http"

	"github.com/myml/webssh"

	"github.com/gorilla/websocket"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("./html")))
	http.HandleFunc("/api/ssh", func(w http.ResponseWriter, r *http.Request) {
		id := r.Header.Get("Sec-WebSocket-Key")
		addr := r.URL.Query().Get("addr")
		var wssh = webssh.NewWebSSH()
		conn, err := net.Dial("tcp", addr)
		if err != nil {
			log.Panic(err)
		}
		wssh.AddSSHConn(id, conn)
		ws, err := websocket.Upgrade(w, r, nil, 512, 512)
		if err != nil {
			log.Panic(err)
		}
		wssh.AddWebsocket(id, ws)
	})
	log.Println("start")
	http.ListenAndServe(":8000", nil)
}
