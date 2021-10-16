package models

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/sirupsen/logrus"
)

type Env struct {
	DB    *sql.DB
	Log   *logrus.Logger
	Mvars func(*http.Request) map[string]string
}

type Todo struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Done      bool      `json:"done"`
	CreatedAt time.Time `json:"createdAt"`
}

func CreateTodo(env *Env) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		//TODO: fix empty inserts
		var todo Todo
		env.Log.Info(parseHeaders(r))

		body, _ := io.ReadAll(r.Body)

		err := json.Unmarshal(body, &todo)
		if err != nil {
			sendErrorMessage(w, "Invalid json")
			return
		}

		err = env.DB.QueryRow(`INSERT INTO todo.todo (name, done) values ($1, $2) returning id`, todo.Name, todo.Done).Scan(&todo.ID)
		if err != nil {
			sendErrorMessage(w, "Item not found")
			return
		}
		w.WriteHeader(http.StatusCreated)
		io.WriteString(w, strconv.FormatInt(int64(todo.ID), 10))
	}
}

func GetTodos(env *Env) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var todos []Todo
		env.Log.Info(parseHeaders(r))

		// get todos from db
		rows, err := env.DB.Query(`select * from todo.todo`)

		for {
			var todo Todo
			if rows.Next() {
				err = rows.Scan(&todo.ID, &todo.Name, &todo.Done, &todo.CreatedAt)
				asserError(env, w, err)
				todos = append(todos, todo)
			} else {
				break
			}
		}

		jsonResp, err := json.Marshal(todos)
		asserError(env, w, err)
		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonResp)
	}
}

func UpdateTodo(env *Env) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		env.Log.Info(parseHeaders(r))
		var_id := env.Mvars(r)["id"]
		// parse id to string
		id, err := strconv.ParseInt(var_id, 10, 64)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Header().Set("Content-Type", "application/json")
			io.WriteString(w, `"{"error": "Invalid id format"}"`)
			return
		}

		// search in db
		rows, err := env.DB.Query(`select name, done from todo.todo where id = $1`, id)
		//err = row.Scan(&todo.Name, &todo.Done)

		if err != nil {
			env.Log.Error(err)
			sendErrorMessage(w, "Item not found")
			return
		}

		if rows.Next() {
			// exists
			var todo Todo
			var body []byte
			body, _ = io.ReadAll(r.Body)

			err := json.Unmarshal(body, &todo)

			if err != nil {
				sendErrorMessage(w, "Invalid json")
				return
			}

			env.DB.Exec(`update todo.todo set name = $1, done = $2 where id = $3`, todo.Name, todo.Done, id)
		} else {
			env.Log.Error("Not found")
			sendErrorMessage(w, "Item not found")
			return
		}

	}
}

func DeleteTodo(env *Env) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		env.Log.Info(parseHeaders(r))
		var_id := env.Mvars(r)["id"]
		// parse id to string
		id, err := strconv.ParseInt(var_id, 10, 64)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Header().Set("Content-Type", "application/json")
			io.WriteString(w, `"{"error": "Invalid id format"}"`)
			return
		}

		// search in db
		rows, err := env.DB.Query(`select name, done from todo.todo where id = $1`, id)
		//err = row.Scan(&todo.Name, &todo.Done)

		if err != nil {
			env.Log.Error(err)
			sendErrorMessage(w, "Item not found")
			return
		}

		if rows.Next() {
			// exists
			env.DB.Exec(`delete from todo.todo where id = $1`, id)

		} else {
			env.Log.Error("Not found")
			sendErrorMessage(w, "Item not found")
			return
		}

	}
}

func parseHeaders(r *http.Request) string {
	return fmt.Sprintf("From: %s, Method: %s, Requested: %v", r.RemoteAddr, r.Method, r.RequestURI)
}

func asserError(env *Env, w http.ResponseWriter, err error) {
	if err != nil {
		env.Log.Error(err)
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, "Invalid request")
		return
	}
}

func sendErrorMessage(w http.ResponseWriter, errMsg string) {
	msg := fmt.Sprintf(`"{"error": %s}"`, errMsg)
	w.WriteHeader(http.StatusBadRequest)
	w.Header().Set("Content-Type", "application/json")
	io.WriteString(w, msg)
}
