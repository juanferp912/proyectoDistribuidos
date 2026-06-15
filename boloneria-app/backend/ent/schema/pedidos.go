package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type Pedidos struct {
	ent.Schema
}

func (Pedidos) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "pedidos"},
	}
}

func (Pedidos) Fields() []ent.Field {
	return []ent.Field{
		field.Time("fecha_pedido").Default(time.Now),
		field.String("estado").Default("COMPLETADO"),
		field.Float("total_pedido"),
		field.Int("cliente_id").Optional().Nillable(),
	}
}

func (Pedidos) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("cliente", Clientes.Type).
			Ref("pedidos").
			Unique().
			Field("cliente_id"),
		edge.To("detalles", DetallesPedido.Type),
	}
}
