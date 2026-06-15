package inventory

import (
	"boloneria-app/ent"
	"context"
	"errors"
)

// 1. El Contrato (Interfaz)
type Service interface {
	Listar(ctx context.Context) ([]*ent.MateriaPrima, error)
	BuscarPorID(ctx context.Context, id int) (*ent.MateriaPrima, error)
	Crear(ctx context.Context, nombre, categoria, proveedor, unidad string, costo, stock, reorden float64) (*ent.MateriaPrima, error)
	ActualizarStock(ctx context.Context, id int, nuevoStock float64) (*ent.MateriaPrima, error)
	Eliminar(ctx context.Context, id int) error
}

// 2. La Estructura Privada
type service struct {
	repo Repository
}

// 3. El Constructor de Uber Fx
// Fíjate que exige la interfaz Repository, no la base de datos.
func NewService(repo Repository) Service {
	return &service{
		repo: repo,
	}
}

// 4. Implementación de la Lógica de Negocio

func (s *service) Listar(ctx context.Context) ([]*ent.MateriaPrima, error) {
	// Pasa directo, no hay reglas de negocio para listar
	return s.repo.Listar(ctx)
}

func (s *service) BuscarPorID(ctx context.Context, id int) (*ent.MateriaPrima, error) {
	return s.repo.BuscarPorID(ctx, id)
}

func (s *service) Crear(ctx context.Context, nombre, categoria, proveedor, unidad string, costo, stock, reorden float64) (*ent.MateriaPrima, error) {
	// Regla de Negocio: No se pueden crear productos con costo o stock negativo
	if costo < 0 || stock < 0 {
		return nil, errors.New("el costo y el stock inicial no pueden ser valores negativos")
	}
	return s.repo.Crear(ctx, nombre, categoria, proveedor, unidad, costo, stock, reorden)
}

func (s *service) ActualizarStock(ctx context.Context, id int, nuevoStock float64) (*ent.MateriaPrima, error) {
	// Regla de Negocio: El stock no puede bajar de cero
	if nuevoStock < 0 {
		return nil, errors.New("operación denegada: el stock resultante no puede ser negativo")
	}
	return s.repo.ActualizarStock(ctx, id, nuevoStock)
}

func (s *service) Eliminar(ctx context.Context, id int) error {
	return s.repo.Eliminar(ctx, id)
}
