package main

import (
    "encoding/json"
    "io/ioutil"
    "log"
    "net/http"
    "os"
    "sync"
)

type Score struct {
    Name  string `json:"name"`
    Score int    `json:"score"`
    Time  int    `json:"time"`
}

var scores []Score
var mu sync.Mutex

func loadScores() {
    file, err := os.Open("scores.json")
    if err != nil {
        if os.IsNotExist(err) {
            scores = []Score{}
            return
        }
        log.Fatal(err)
    }
    defer file.Close()

    bytes, err := ioutil.ReadAll(file)
    if err != nil {
        log.Fatal(err)
    }

    err = json.Unmarshal(bytes, &scores)
    if err != nil {
        log.Fatal(err)
    }
}

func main() {
    loadScores()

   
    log.Println("Listening on :8080...")
    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        log.Fatal(err)
    }
}