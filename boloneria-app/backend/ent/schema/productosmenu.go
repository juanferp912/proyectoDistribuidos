package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type ProductosMenu struct {
	ent.Schema
}

func (ProductosMenu) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "productos_menu"},
	}
}

func (ProductosMenu) Fields() []ent.Field {
	return []ent.Field{
		field.String("nombre_producto").NotEmpty(),
		field.String("categoria_menu").NotEmpty(),
		field.Float("precio_venta"),
	}
}

func (ProductosMenu) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("recetas", Recetas.Type),
		edge.To("detalles_pedido", DetallesPedido.Type),
	}
}
