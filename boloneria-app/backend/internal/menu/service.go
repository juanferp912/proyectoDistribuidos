package menu

import (
	"boloneria-app/ent"
	"context"
	"errors"
)

type Service interface {
	Listar(ctx context.Context) ([]*ent.ProductosMenu, error)
	BuscarPorID(ctx context.Context, id int) (*ent.ProductosMenu, error)
	BuscarPorNombre(ctx context.Context, nombre string) ([]*ent.ProductosMenu, error)
	Crear(ctx context.Context, nombre, categoria string, precio float64) (*ent.ProductosMenu, error)
	Actualizar(ctx context.Context, id int, nombre, categoria string, precio float64) (*ent.ProductosMenu, error)
	Eliminar(ctx context.Context, id int) error
}

type service struct{ repo Repository }

func NewService(repo Repository) Service { return &service{repo: repo} }

func (s *service) Listar(ctx context.Context) ([]*ent.ProductosMenu, error) {
	return s.repo.Listar(ctx)
}
func (s *service) BuscarPorID(ctx context.Context, id int) (*ent.ProductosMenu, error) {
	return s.repo.BuscarPorID(ctx, id)
}
func (s *service) BuscarPorNombre(ctx context.Context, nombre string) ([]*ent.ProductosMenu, error) {
	return s.repo.BuscarPorNombre(ctx, nombre)
}
func (s *service) Crear(ctx context.Context, nombre, categoria string, precio float64) (*ent.ProductosMenu, error) {
	if precio < 0 {
		return nil, errors.New("el precio de venta no puede ser negativo")
	}
	return s.repo.Crear(ctx, nombre, categoria, precio)
}
func (s *service) Actualizar(ctx context.Context, id int, nombre, categoria string, precio float64) (*ent.ProductosMenu, error) {
	if precio < 0 {
		return nil, errors.New("el precio de venta no puede ser negativo")
	}
	return s.repo.Actualizar(ctx, id, nombre, categoria, precio)
}
func (s *service) Eliminar(ctx context.Context, id int) error {
	return s.repo.Eliminar(ctx, id)
}
