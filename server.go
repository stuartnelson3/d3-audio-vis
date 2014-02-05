package main

import (
    "github.com/codegangsta/martini"
    "github.com/codegangsta/martini-contrib/render"
    "path/filepath"
)

func main() {
    m := martini.Classic()
    m.Use(martini.Static("songs"))
    m.Use(render.Renderer(render.Options{
        Layout:     "layout",
        Delims: render.Delims{"{[{", "}]}"},
        Extensions: []string{".html"}}))

    songs := Songs()

    m.Get("/", func(r render.Render) {
        r.HTML(200, "index", songs)
    })

    m.Get("/:song", func(params martini.Params, r render.Render) {
        for _, song := range songs {
            if song == params["song"] {
                r.HTML(200, "show", song)
            }
        }
    })

    m.Run()
}

func  Songs() []string {
    songs, _ := filepath.Glob("songs/*.mp3")
    for i := 0; i < len(songs); i++ {
        songs[i] = songs[i][6:]
    }
    return songs
}
