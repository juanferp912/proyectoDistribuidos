package server

import (
	"boloneria-app/internal/config"
	"context"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"go.uber.org/fx"
)

func NewFiberApp(cfg *config.Config, lc fx.Lifecycle) *fiber.App {
	app := fiber.New(fiber.Config{
		AppName: "Bolonería App v1.0",
	})

	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PATCH,DELETE,OPTIONS",
		AllowHeaders: "Content-Type,Accept",
	}))

	app.Static("/", "./web")

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"service": "boloneria-inventario",
		})
	})

	lc.Append(fx.Hook{
		OnStart: func(ctx context.Context) error {
			go func() {
				port := fmt.Sprintf(":%s", cfg.AppPort)
				fmt.Printf("Servidor iniciado en http://0.0.0.0%s\n", port)
				if err := app.Listen(port); err != nil {
					fmt.Println("Error Fiber:", err)
				}
			}()
			return nil
		},
		OnStop: func(ctx context.Context) error {
			fmt.Println("Apagando servidor Fiber...")
			return app.Shutdown()
		},
	})

	return app
}
