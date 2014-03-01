package main

import (
    "github.com/codegangsta/martini"
    "github.com/codegangsta/martini-contrib/render"
    "github.com/wtolson/go-taglib"
    "github.com/gorilla/websocket"
    "path/filepath"
    "encoding/json"
    "net/http"
    "regexp"
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
        scripts := Scripts()
        indexObj := index{Songs:songs, Scripts:scripts}
        r.HTML(200, "index", indexObj)
    })

    m.Get("/search", func(w http.ResponseWriter, r *http.Request) {
        search := r.FormValue("search")
        enc := json.NewEncoder(w)
        // write querySongs method
        s := QuerySongs(search)
        enc.Encode(s)
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
        ws.WriteMessage(1, storedPlaylist);
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

var songs = Songs()
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
        song.Path = "/" + paths[i][6:]
        songs = append(songs, song)

    }
    return songs
}

func QuerySongs(search string) []Song {
    matches := make([]Song, 0)
    if search == "" {
        return matches
    }
    for _, song := range songs {
        s := []string{song.Name, song.Artist, song.Album, song.Genre}
        for _, attr := range s {
            // make this case insensitive
            if match, _ := regexp.MatchString(search, attr); match {
                matches = append(matches, song)
                break
            }
        }
    }
    return matches
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
