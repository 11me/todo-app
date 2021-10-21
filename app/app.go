package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/sirupsen/logrus"
	"github.com/todo-app/app/models"
)

var (
	HOST = "0.0.0.0"
	PORT = 3001

	DBHOST = os.Getenv("PG_HOST")
	DBPORT = 5432
	DBUSER = "postgres"
	DBNAME = "postgres"
	DBPASS = os.Getenv("PG_PASSWORD")
	SSL    = "disable"
)

var (
	log  = logrus.New()
	r    = mux.NewRouter()
	db   *sql.DB
	addr = fmt.Sprintf("%s:%d", HOST, PORT)
)

func main() {

	connStr := fmt.Sprintf("user=%s dbname=%s password=%s host=%s sslmode=%s", DBUSER, DBNAME, DBPASS, DBHOST, SSL)
	db, err := sql.Open("postgres", connStr)

	if err != nil {
		log.Error(err)
	}

	env := &models.Env{
		Log:   log,
		DB:    db,
		Mvars: mux.Vars,
	}

	r.HandleFunc("/api/create", models.CreateTodo(env)).Methods("POST")
	r.HandleFunc("/api/todos", models.GetTodos(env)).Methods("GET")
	r.HandleFunc("/api/update/{id}", models.UpdateTodo(env)).Methods("PATCH")
	r.HandleFunc("/api/delete/{id}", models.DeleteTodo(env)).Methods("DELETE")

	r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir("../web/build"))))

	methods := handlers.AllowedMethods([]string{"GET", "POST", "PATCH", "DELETE"})
	origins := handlers.AllowedOrigins([]string{"*"})

	log.Infof("Listening on %s", addr)
	log.Error(http.ListenAndServe(addr, handlers.CORS(methods, origins)(r)))
}
