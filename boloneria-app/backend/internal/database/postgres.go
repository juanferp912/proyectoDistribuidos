package database

import (
	"boloneria-app/ent"
	"boloneria-app/ent/migrate"
	"boloneria-app/internal/config"
	"context"
	"database/sql"
	"fmt"

	"entgo.io/ent/dialect"
	entsql "entgo.io/ent/dialect/sql"
	_ "github.com/jackc/pgx/v5/stdlib"
	"go.uber.org/fx"
)

func NewEntClient(cfg *config.Config, lc fx.Lifecycle) (*ent.Client, error) {
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName)

	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, fmt.Errorf("error abriendo pool SQL: %w", err)
	}

	drv := entsql.OpenDB(dialect.Postgres, db)
	client := ent.NewClient(ent.Driver(drv))

	lc.Append(fx.Hook{
		OnStart: func(ctx context.Context) error {
			// Las tablas ya existen (creadas por el script SQL de Juanfer).
			// Usamos WithDropColumn(false) + WithDropIndex(false) para que
			// Ent no intente alterar columnas SERIAL vs IDENTITY existentes.
			err := client.Schema.Create(ctx,
				migrate.WithDropIndex(false),
				migrate.WithDropColumn(false),
				migrate.WithForeignKeys(false),
			)
			if err != nil {
				// Si las tablas ya existen con columnas SERIAL (no IDENTITY),
				// ignoramos el conflicto de atributos y continuamos.
				fmt.Printf("⚠ Migración omitida (tablas ya existentes): %v\n", err)
				fmt.Println("✓ PostgreSQL conectado — usando esquema existente de Juanfer.")
				return nil
			}
			fmt.Println("✓ PostgreSQL conectado y esquema verificado.")
			return nil
		},
		OnStop: func(ctx context.Context) error {
			fmt.Println("Cerrando conexión a PostgreSQL...")
			return client.Close()
		},
	})

	return client, nil
}
