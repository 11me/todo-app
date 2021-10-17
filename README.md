# Simple Fullstack Web Application

It is a simple web application written using React and Gorilla/mux.
It could be run locally, but one should install following requirements
on the system.

## Requirements
1. PostgreSQL
2. Golang
3. NodeJS

## Quick start
1. If you have docker-compose on the system
```
$ docker-compose up
```

## How to start the application:
1. Install PostgreSQL, it is recommened to install it from dockerHub
```
$ docker run --name postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```
2. You have to have a postresql client on your system to create a schema
```
$ psql -h localhost -U postgres -f initdb.sql
```
3. Install node packages:
```
$ cd web/ && yarn install
```
4. Start the frontend
```
$ yarn start
```
5. Start Go server
```
$ cd app/ && go run app.go
```
## API endpoints
- **GET** /api/todos
- **POST** /api/create
- **PATCH** /api/update/{id}
- **DELETE** /api/delete/{id}
