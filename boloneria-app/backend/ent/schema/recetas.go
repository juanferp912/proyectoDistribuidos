package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type Recetas struct {
	ent.Schema
}

func (Recetas) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "recetas"},
	}
}

func (Recetas) Fields() []ent.Field {
	return []ent.Field{
		field.Float("cantidad_necesaria"),
	}
}

func (Recetas) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("producto", ProductosMenu.Type).
			Ref("recetas").
			Unique().
			Required(),
		edge.From("materia_prima", MateriaPrima.Type).
			Ref("recetas").
			Unique().
			Required(),
	}
}
