package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type Clientes struct {
	ent.Schema
}

func (Clientes) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "clientes"},
	}
}

func (Clientes) Fields() []ent.Field {
	return []ent.Field{
		field.String("nombre_completo").NotEmpty(),
		field.String("telefono").Optional().Nillable(),
		field.String("email").Optional().Nillable(),
		field.String("direccion").Optional().Nillable(),
	}
}

func (Clientes) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("pedidos", Pedidos.Type),
	}
}
