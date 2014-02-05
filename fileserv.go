package main

import (
    "fmt"
    "net/http"
)

func main() {
    port := "8080"
    fmt.Println("Listening on " + port)
    http.Handle("/", http.FileServer(http.Dir("./")))
    http.ListenAndServe(":" + port, nil)
}
