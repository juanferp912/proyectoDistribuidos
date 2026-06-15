package main

import (
	"boloneria-app/internal/clientes"
	"boloneria-app/internal/config"
	"boloneria-app/internal/database"
	"boloneria-app/internal/inventory"
	"boloneria-app/internal/menu"
	"boloneria-app/internal/pedidos"
	"boloneria-app/internal/server"

	"go.uber.org/fx"
)

func main() {
	app := fx.New(
		config.Module,
		database.Module,
		server.Module,
		inventory.Module,
		menu.Module,
		clientes.Module,
		pedidos.Module,
	)
	app.Run()
}
