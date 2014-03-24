package main

import (
    "github.com/codegangsta/martini-contrib/render"
    "github.com/codegangsta/martini"
    "github.com/gorilla/websocket"
    "path/filepath"
    "net/http"
    "regexp"
    "sync"
    "log"
    "net"
)

func main() {
    m := martini.Classic()
    m.Use(martini.Static("songs"))
    m.Use(render.Renderer(render.Options{
        Layout:     "layout",
        Delims:     render.Delims{"{[{", "}]}"},
        Extensions: []string{".html"}}))

        m.Get("/", func(r render.Render) {
            scripts := Scripts()
            indexObj := index{Scripts: scripts}
            r.HTML(200, "index", indexObj)
        })

        m.Get("/sock", func(w http.ResponseWriter, r *http.Request) {
            ws, err := websocket.Upgrade(w, r, nil, 1024, 1024)
            if _, ok := err.(websocket.HandshakeError); ok {
                http.Error(w, "Not a websocket handshake", 400)
                return
            } else if err != nil {
                log.Println(err)
                return
            }
            client := ws.RemoteAddr()
            sockCli := ClientConn{ws, client}
            addClient(sockCli)
            log.Println(ActiveClients)
            // send new users current playlist
            ws.WriteMessage(1, storedPlaylist)
            for {
                messageType, p, err := ws.ReadMessage()
                if match, _ := regexp.Match(`songs`, p); match {
                    storedPlaylist = p
                }
                if err != nil {
                    deleteClient(sockCli)
                    log.Println("bye")
                    log.Println(err)
                    return
                }
                broadcastMessage(messageType, p)
            }
        })

        m.Run()
    }

    func Scripts() []string {
        scripts, _ := filepath.Glob("public/js/**/**/*.js")
        for i := 0; i < len(scripts); i++ {
            scripts[i] = scripts[i][7:]
        }
        return scripts
    }

    type index struct {
        Scripts []string
    }

    var storedPlaylist []byte
    var ActiveClients = make(map[ClientConn]int)
    var ActiveClientsRWMutex sync.RWMutex

    type ClientConn struct {
        websocket *websocket.Conn
        clientIP  net.Addr
    }

    func addClient(cc ClientConn) {
        ActiveClientsRWMutex.Lock()
        ActiveClients[cc] = 0
        ActiveClientsRWMutex.Unlock()
    }

    func deleteClient(cc ClientConn) {
        ActiveClientsRWMutex.Lock()
        delete(ActiveClients, cc)
        ActiveClientsRWMutex.Unlock()
    }

    func broadcastMessage(messageType int, message []byte) {
        ActiveClientsRWMutex.RLock()
        defer ActiveClientsRWMutex.RUnlock()

        for client, _ := range ActiveClients {
            if err := client.websocket.WriteMessage(messageType, message); err != nil {
                return
            }
        }
    }
