package config

import (
	"log"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	AppPort    string
}

func NewConfig() (*Config, error) {
	err := godotenv.Load()
	if err != nil {
		log.Println("Aviso: No se encontro el archivo .env, leyendo variables del sistema")
	}
	return &Config{}, nil
}
