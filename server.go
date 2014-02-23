package main

import (
    "github.com/codegangsta/martini"
    "github.com/codegangsta/martini-contrib/render"
    "github.com/ascherkus/go-id3/src/id3"
    "path/filepath"
    "os"
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

    m.Run()
}

func Songs() []Song {
    songs := make([]Song, 0)
    paths, _ := filepath.Glob("songs/*.mp3")
    for i := 0; i < len(paths); i++ {
        mp3File, err := os.Open(paths[i])
        if err != nil {
            continue
        }
        metadata := *id3.Read(mp3File)
        song := Song{Metadata: metadata, Url: "/" + paths[i][6:]}
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
    Metadata id3.File
    Url string
}
