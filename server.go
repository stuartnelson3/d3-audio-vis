package main

import (
    eventsource "github.com/antage/eventsource/http"
    "github.com/codegangsta/martini-contrib/render"
    "github.com/codegangsta/martini"
    "path/filepath"
    "io/ioutil"
    "net/http"
    "strconv"
    "regexp"
    "fmt"
)

func main() {
    id := 1
    es := eventsource.New(
        eventsource.DefaultSettings(),
        func(req *http.Request) [][]byte {
            return [][]byte{
                []byte("X-Accel-Buffering: no"),
                []byte("Access-Control-Allow-Origin: *"),
            }
        },
    )
    defer es.Close()

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

    m.Get("/stream", es.ServeHTTP)

    m.Get("/current-playlist", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "%s", storedPlaylist)
    })

    m.Post("/update_stream", func(w http.ResponseWriter, r *http.Request) {
        body, _ := ioutil.ReadAll(r.Body)
        if match, _ := regexp.Match(`songs`, body); match {
            storedPlaylist = body
            fmt.Println(string(storedPlaylist))
        }
        es.SendMessage(string(body), "", strconv.Itoa(id))
        id++
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

