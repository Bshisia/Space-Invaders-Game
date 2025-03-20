package main

import (
	"log"
	"net/http"
)

type Score struct {
	Name  string `json:"name"`
	Score int    `json:"score"`
	Time  int    `json:"time"`
}

func main() {

	http.Handle("/", http.FileServer(http.Dir(".")))

	log.Println("Listening on :8080...")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}
