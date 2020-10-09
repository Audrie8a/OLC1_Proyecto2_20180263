package main

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

//Prueba funcion para probar si funciona
func Prueba(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "<h1>Holiwis</h1>")
}

type mensaje struct {
	msg string
}

func (m mensaje) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, m.msg)
}

func main() {
	msg := mensaje{
		msg: "<h1>Hola Mundo</h1>",
	}
	mux := http.NewServeMux()
	fs := http.FileServer(http.Dir("Frontend"))

	mux.Handle("/", fs)
	mux.Handle("/hola", msg)

	server := &http.Server{
		Addr:           ":8086",
		Handler:        mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	log.Println("Listening...")
	log.Fatal(server.ListenAndServe())
}
