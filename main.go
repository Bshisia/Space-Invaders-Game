package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sync"
)

type Score struct {
	Index int `json:"index"`
	Name  string `json:"name"`
	Score int    `json:"score"`
	Time  int    `json:"time"`
}

var (
	scores []Score
	mu     sync.Mutex
)

func loadScores() {
	bytes, err := os.ReadFile("scores.json")
	if err != nil {
		log.Fatal(err)
	}

	err = json.Unmarshal(bytes, &scores)
	if err != nil {
		log.Fatal(err)
	}
}

func saveScores() {
	bytes, err := json.MarshalIndent(scores, "", "    ")
	if err != nil {
		log.Fatal(err)
	}

	err = os.WriteFile("scores.json", bytes, 0644)
	if err != nil {
		log.Fatal(err)
	}
}

func getScores(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(scores)
}

func addScore(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()

	var newScore Score
	err := json.NewDecoder(r.Body).Decode(&newScore)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	newScore.Index = len(scores) + 1

	scores = append(scores, newScore)
	saveScores()

	w.WriteHeader(http.StatusCreated)
}

func main() {
	loadScores()

	http.Handle("/", http.FileServer(http.Dir(".")))
	http.HandleFunc("/api/scores", getScores)
	http.HandleFunc("/api/scores/add", addScore)

	log.Println("Listening on :8080...")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}
