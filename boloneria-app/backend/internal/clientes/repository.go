package clientes

import (
	"boloneria-app/ent"
	"boloneria-app/ent/clientes"
	"context"
)

type Repository interface {
	Listar(ctx context.Context) ([]*ent.Clientes, error)
	BuscarPorID(ctx context.Context, id int) (*ent.Clientes, error)
	BuscarPorNombre(ctx context.Context, nombre string) ([]*ent.Clientes, error)
	Crear(ctx context.Context, nombre string, telefono, email, direccion *string) (*ent.Clientes, error)
	Actualizar(ctx context.Context, id int, nombre string, telefono, email, direccion *string) (*ent.Clientes, error)
	Eliminar(ctx context.Context, id int) error
}

type repository struct{ client *ent.Client }

func NewRepository(client *ent.Client) Repository { return &repository{client: client} }

func (r *repository) Listar(ctx context.Context) ([]*ent.Clientes, error) {
	return r.client.Clientes.Query().All(ctx)
}

func (r *repository) BuscarPorID(ctx context.Context, id int) (*ent.Clientes, error) {
	return r.client.Clientes.Get(ctx, id)
}

func (r *repository) BuscarPorNombre(ctx context.Context, nombre string) ([]*ent.Clientes, error) {
	return r.client.Clientes.Query().
		Where(clientes.NombreCompletoContainsFold(nombre)).
		All(ctx)
}

func (r *repository) Crear(ctx context.Context, nombre string, telefono, email, direccion *string) (*ent.Clientes, error) {
	q := r.client.Clientes.Create().SetNombreCompleto(nombre)
	if telefono != nil {
		q = q.SetTelefono(*telefono)
	}
	if email != nil {
		q = q.SetEmail(*email)
	}
	if direccion != nil {
		q = q.SetDireccion(*direccion)
	}
	return q.Save(ctx)
}

func (r *repository) Actualizar(ctx context.Context, id int, nombre string, telefono, email, direccion *string) (*ent.Clientes, error) {
	q := r.client.Clientes.UpdateOneID(id).SetNombreCompleto(nombre)
	if telefono != nil {
		q = q.SetTelefono(*telefono)
	} else {
		q = q.ClearTelefono()
	}
	if email != nil {
		q = q.SetEmail(*email)
	} else {
		q = q.ClearEmail()
	}
	if direccion != nil {
		q = q.SetDireccion(*direccion)
	} else {
		q = q.ClearDireccion()
	}
	return q.Save(ctx)
}

func (r *repository) Eliminar(ctx context.Context, id int) error {
	return r.client.Clientes.DeleteOneID(id).Exec(ctx)
}
