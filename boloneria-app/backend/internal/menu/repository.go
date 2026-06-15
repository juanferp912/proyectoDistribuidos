package menu

import (
	"boloneria-app/ent"
	"boloneria-app/ent/productosmenu"
	"context"
)

type Repository interface {
	Listar(ctx context.Context) ([]*ent.ProductosMenu, error)
	BuscarPorID(ctx context.Context, id int) (*ent.ProductosMenu, error)
	BuscarPorNombre(ctx context.Context, nombre string) ([]*ent.ProductosMenu, error)
	Crear(ctx context.Context, nombre, categoria string, precio float64) (*ent.ProductosMenu, error)
	Actualizar(ctx context.Context, id int, nombre, categoria string, precio float64) (*ent.ProductosMenu, error)
	Eliminar(ctx context.Context, id int) error
}

type repository struct{ client *ent.Client }

func NewRepository(client *ent.Client) Repository {
	return &repository{client: client}
}

func (r *repository) Listar(ctx context.Context) ([]*ent.ProductosMenu, error) {
	return r.client.ProductosMenu.Query().All(ctx)
}

func (r *repository) BuscarPorID(ctx context.Context, id int) (*ent.ProductosMenu, error) {
	return r.client.ProductosMenu.Get(ctx, id)
}

func (r *repository) BuscarPorNombre(ctx context.Context, nombre string) ([]*ent.ProductosMenu, error) {
	return r.client.ProductosMenu.Query().
		Where(productosmenu.NombreProductoContainsFold(nombre)).
		All(ctx)
}

func (r *repository) Crear(ctx context.Context, nombre, categoria string, precio float64) (*ent.ProductosMenu, error) {
	return r.client.ProductosMenu.Create().
		SetNombreProducto(nombre).
		SetCategoriaMenu(categoria).
		SetPrecioVenta(precio).
		Save(ctx)
}

func (r *repository) Actualizar(ctx context.Context, id int, nombre, categoria string, precio float64) (*ent.ProductosMenu, error) {
	return r.client.ProductosMenu.UpdateOneID(id).
		SetNombreProducto(nombre).
		SetCategoriaMenu(categoria).
		SetPrecioVenta(precio).
		Save(ctx)
}

func (r *repository) Eliminar(ctx context.Context, id int) error {
	return r.client.ProductosMenu.DeleteOneID(id).Exec(ctx)
}
