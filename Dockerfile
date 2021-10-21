FROM node:lts-stretch AS builder
WORKDIR /web
COPY /web ./
RUN yarn install --prod
RUN yarn build

FROM golang:alpine3.14 AS go-builder
RUN apk update && apk add git
WORKDIR /todo-app
COPY /app ./app
COPY go.mod go.sum ./
RUN go mod tidy
WORKDIR /todo-app/app
RUN go build .../..

FROM alpine:3.13.6
WORKDIR /todo-app
COPY --from=builder /web/build ./web/build
COPY --from=go-builder /todo-app/app/app ./app/app
EXPOSE 8080
WORKDIR /todo-app/app
CMD ["./app"]
