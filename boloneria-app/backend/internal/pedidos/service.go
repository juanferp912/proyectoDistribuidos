package pedidos

import (
	"boloneria-app/ent"
	"context"
	"errors"
)

type Service interface {
	Listar(ctx context.Context) ([]*ent.Pedidos, error)
	BuscarPorID(ctx context.Context, id int) (*ent.Pedidos, error)
	Crear(ctx context.Context, clienteID *int, estado string, detalles []DetalleLine) (*ent.Pedidos, error)
	ActualizarEstado(ctx context.Context, id int, estado string) (*ent.Pedidos, error)
	Eliminar(ctx context.Context, id int) error
}

type service struct{ repo Repository }

func NewService(repo Repository) Service { return &service{repo: repo} }

func (s *service) Listar(ctx context.Context) ([]*ent.Pedidos, error) {
	return s.repo.Listar(ctx)
}
func (s *service) BuscarPorID(ctx context.Context, id int) (*ent.Pedidos, error) {
	return s.repo.BuscarPorID(ctx, id)
}
func (s *service) Crear(ctx context.Context, clienteID *int, estado string, detalles []DetalleLine) (*ent.Pedidos, error) {
	if len(detalles) == 0 {
		return nil, errors.New("el pedido debe tener al menos un producto")
	}
	var total float64
	for _, d := range detalles {
		if d.Cantidad <= 0 {
			return nil, errors.New("la cantidad de cada producto debe ser mayor a cero")
		}
		total += float64(d.Cantidad) * d.PrecioUnitario
	}
	if estado == "" {
		estado = "COMPLETADO"
	}
	return s.repo.Crear(ctx, clienteID, estado, total, detalles)
}
func (s *service) ActualizarEstado(ctx context.Context, id int, estado string) (*ent.Pedidos, error) {
	return s.repo.ActualizarEstado(ctx, id, estado)
}
func (s *service) Eliminar(ctx context.Context, id int) error {
	return s.repo.Eliminar(ctx, id)
}
