package pedidos

import (
	"boloneria-app/ent"
	"boloneria-app/ent/pedidos"
	"context"
)

type DetalleLine struct {
	ProductoID    int
	Cantidad      int
	PrecioUnitario float64
}

type Repository interface {
	Listar(ctx context.Context) ([]*ent.Pedidos, error)
	BuscarPorID(ctx context.Context, id int) (*ent.Pedidos, error)
	Crear(ctx context.Context, clienteID *int, estado string, total float64, detalles []DetalleLine) (*ent.Pedidos, error)
	ActualizarEstado(ctx context.Context, id int, estado string) (*ent.Pedidos, error)
	Eliminar(ctx context.Context, id int) error
}

type repository struct{ client *ent.Client }

func NewRepository(client *ent.Client) Repository { return &repository{client: client} }

func (r *repository) Listar(ctx context.Context) ([]*ent.Pedidos, error) {
	return r.client.Pedidos.Query().
		WithCliente().
		WithDetalles(func(q *ent.DetallesPedidoQuery) {
			q.WithProducto()
		}).
		Order(ent.Desc(pedidos.FieldFechaPedido)).
		All(ctx)
}

func (r *repository) BuscarPorID(ctx context.Context, id int) (*ent.Pedidos, error) {
	return r.client.Pedidos.Query().
		Where(pedidos.ID(id)).
		WithCliente().
		WithDetalles(func(q *ent.DetallesPedidoQuery) {
			q.WithProducto()
		}).
		Only(ctx)
}

func (r *repository) Crear(ctx context.Context, clienteID *int, estado string, total float64, detalles []DetalleLine) (*ent.Pedidos, error) {
	tx, err := r.client.Tx(ctx)
	if err != nil {
		return nil, err
	}

	pedidoQ := tx.Pedidos.Create().SetEstado(estado).SetTotalPedido(total)
	if clienteID != nil {
		pedidoQ = pedidoQ.SetClienteID(*clienteID)
	}
	p, err := pedidoQ.Save(ctx)
	if err != nil {
		_ = tx.Rollback()
		return nil, err
	}

	for _, d := range detalles {
		subtotal := float64(d.Cantidad) * d.PrecioUnitario
		_, err := tx.DetallesPedido.Create().
			SetPedidoID(p.ID).
			SetProductoID(d.ProductoID).
			SetCantidad(d.Cantidad).
			SetPrecioUnitario(d.PrecioUnitario).
			SetSubtotal(subtotal).
			Save(ctx)
		if err != nil {
			_ = tx.Rollback()
			return nil, err
		}
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return r.BuscarPorID(ctx, p.ID)
}

func (r *repository) ActualizarEstado(ctx context.Context, id int, estado string) (*ent.Pedidos, error) {
	p, err := r.client.Pedidos.UpdateOneID(id).SetEstado(estado).Save(ctx)
	if err != nil {
		return nil, err
	}
	return r.BuscarPorID(ctx, p.ID)
}

func (r *repository) Eliminar(ctx context.Context, id int) error {
	return r.client.Pedidos.DeleteOneID(id).Exec(ctx)
}
