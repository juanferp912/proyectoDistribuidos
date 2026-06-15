package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type DetallesPedido struct {
	ent.Schema
}

func (DetallesPedido) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "detalles_pedido"},
	}
}

func (DetallesPedido) Fields() []ent.Field {
	return []ent.Field{
		field.Int("pedido_id"),
		field.Int("producto_id"),
		field.Int("cantidad"),
		field.Float("precio_unitario"),
		field.Float("subtotal"),
	}
}

func (DetallesPedido) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("pedido", Pedidos.Type).
			Ref("detalles").
			Unique().
			Required().
			Field("pedido_id"),
		edge.From("producto", ProductosMenu.Type).
			Ref("detalles_pedido").
			Unique().
			Required().
			Field("producto_id"),
	}
}
