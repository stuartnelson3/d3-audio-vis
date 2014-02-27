package main

import (
    "github.com/codegangsta/martini"
    "github.com/codegangsta/martini-contrib/render"
    "github.com/wtolson/go-taglib"
    "github.com/gorilla/websocket"
    "path/filepath"
    "net/http"
    "sync"
    "net"
    "log"
)

func main() {
    m := martini.Classic()
    m.Use(martini.Static("songs"))
    m.Use(render.Renderer(render.Options{
        Layout:     "layout",
        Delims: render.Delims{"{[{", "}]}"},
        Extensions: []string{".html"}}))

    m.Get("/", func(r render.Render) {
        songs := Songs()
        scripts := Scripts()
        indexObj := index{Songs:songs, Scripts:scripts}
        r.HTML(200, "index", indexObj)
    })

    m.Get("/sock", func(w http.ResponseWriter, r *http.Request) {
        log.Println(ActiveClients)
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

        for {
            messageType, p, err := ws.ReadMessage()
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

func Songs() []Song {
    songs := make([]Song, 0)
    paths, _ := filepath.Glob("songs/*.mp3")
    for i := 0; i < len(paths); i++ {
        f, err := taglib.Read(paths[i])
        if err != nil {
            continue
        }
        song := Song{}
        song.Name = f.Title()
        song.Artist = f.Artist()
        song.Album = f.Album()
        song.Year = f.Year()
        song.Track = f.Track()
        song.Genre = f.Genre()
        song.Length = int(f.Length().Seconds())
        song.Url = "/" + paths[i]
        songs = append(songs, song)

    }
    return songs
}

func Scripts() []string {
    scripts, _ := filepath.Glob("public/js/**/**/*.js")
    for i := 0; i < len(scripts); i++ {
        scripts[i] = scripts[i][7:]
    }
    return scripts
}

type index struct {
    Songs []Song
    Scripts []string
}

type Song struct {
    Name string
    Artist string
    Album string
    Year int
    Track int
    Genre string
    Length int
    Path string
    Url string
}

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
