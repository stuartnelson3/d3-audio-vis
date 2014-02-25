package main

import (
    "github.com/codegangsta/martini"
    "github.com/codegangsta/martini-contrib/render"
    "github.com/wtolson/go-taglib"
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
