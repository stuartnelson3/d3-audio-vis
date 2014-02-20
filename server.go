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

    m.Get("/", func(r render.Render) {
        songs := Songs()
        scripts := Scripts()
        indexObj := index{Songs:songs, Scripts:scripts}
        r.HTML(200, "index", indexObj)
    })

    m.Run()
}

func Songs() []string {
    songs, _ := filepath.Glob("songs/*.mp3")
    for i := 0; i < len(songs); i++ {
        songs[i] = songs[i][6:]
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
    Songs []string
    Scripts []string
}
