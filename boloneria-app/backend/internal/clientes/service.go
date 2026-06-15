package clientes

import (
	"boloneria-app/ent"
	"context"
)

type Service interface {
	Listar(ctx context.Context) ([]*ent.Clientes, error)
	BuscarPorID(ctx context.Context, id int) (*ent.Clientes, error)
	BuscarPorNombre(ctx context.Context, nombre string) ([]*ent.Clientes, error)
	Crear(ctx context.Context, nombre string, telefono, email, direccion *string) (*ent.Clientes, error)
	Actualizar(ctx context.Context, id int, nombre string, telefono, email, direccion *string) (*ent.Clientes, error)
	Eliminar(ctx context.Context, id int) error
}

type service struct{ repo Repository }

func NewService(repo Repository) Service { return &service{repo: repo} }

func (s *service) Listar(ctx context.Context) ([]*ent.Clientes, error) {
	return s.repo.Listar(ctx)
}
func (s *service) BuscarPorID(ctx context.Context, id int) (*ent.Clientes, error) {
	return s.repo.BuscarPorID(ctx, id)
}
func (s *service) BuscarPorNombre(ctx context.Context, nombre string) ([]*ent.Clientes, error) {
	return s.repo.BuscarPorNombre(ctx, nombre)
}
func (s *service) Crear(ctx context.Context, nombre string, telefono, email, direccion *string) (*ent.Clientes, error) {
	return s.repo.Crear(ctx, nombre, telefono, email, direccion)
}
func (s *service) Actualizar(ctx context.Context, id int, nombre string, telefono, email, direccion *string) (*ent.Clientes, error) {
	return s.repo.Actualizar(ctx, id, nombre, telefono, email, direccion)
}
func (s *service) Eliminar(ctx context.Context, id int) error {
	return s.repo.Eliminar(ctx, id)
}
