package inventory

import (
	"boloneria-app/ent"
	"context"
	// Importamos el paquete específico autogenerado para usar filtros
)

// 1. El Contrato (Interfaz)
type Repository interface {
	Listar(ctx context.Context) ([]*ent.MateriaPrima, error)
	BuscarPorID(ctx context.Context, id int) (*ent.MateriaPrima, error)
	Crear(ctx context.Context, nombre, categoria, proveedor, unidad string, costo, stock, reorden float64) (*ent.MateriaPrima, error)
	ActualizarStock(ctx context.Context, id int, nuevoStock float64) (*ent.MateriaPrima, error)
	Eliminar(ctx context.Context, id int) error
}

// 2. La Estructura Privada
type repository struct {
	client *ent.Client
}

// 3. El Constructor de Uber Fx
func NewRepository(client *ent.Client) Repository {
	return &repository{
		client: client,
	}
}

// 4. Implementación de los Métodos

// Listar trae todos los registros de la base de datos de Juanfer
func (r *repository) Listar(ctx context.Context) ([]*ent.MateriaPrima, error) {
	productos, err := r.client.MateriaPrima.Query().All(ctx)
	if err != nil {
		return nil, err
	}
	return productos, nil
}

// BuscarPorID trae un solo registro
func (r *repository) BuscarPorID(ctx context.Context, id int) (*ent.MateriaPrima, error) {
	producto, err := r.client.MateriaPrima.Get(ctx, id)
	if err != nil {
		return nil, err // Puede retornar error si no lo encuentra (Not Found)
	}
	return producto, nil
}

// Crear inserta un nuevo registro
func (r *repository) Crear(ctx context.Context, nombre, categoria, proveedor, unidad string, costo, stock, reorden float64) (*ent.MateriaPrima, error) {
	producto, err := r.client.MateriaPrima.Create().
		SetNombreInsumo(nombre).
		SetCategoria(categoria).
		SetProveedor(proveedor).
		SetUnidadMedida(unidad).
		SetCostoUnitario(costo).
		SetStockActual(stock).
		SetPuntoReorden(reorden).
		Save(ctx)

	if err != nil {
		return nil, err
	}
	return producto, nil
}

// ActualizarStock modifica específicamente la columna stock_actual
func (r *repository) ActualizarStock(ctx context.Context, id int, nuevoStock float64) (*ent.MateriaPrima, error) {
	producto, err := r.client.MateriaPrima.UpdateOneID(id).
		SetStockActual(nuevoStock).
		Save(ctx)

	if err != nil {
		return nil, err
	}
	return producto, nil
}

// Eliminar borra físicamente el registro (Ojo: Ent también soporta Soft Deletes si se configura)
func (r *repository) Eliminar(ctx context.Context, id int) error {
	err := r.client.MateriaPrima.DeleteOneID(id).Exec(ctx)
	return err // Si es exitoso, err será nil automáticamente
}
