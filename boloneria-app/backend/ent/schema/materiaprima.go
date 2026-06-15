package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type MateriaPrima struct {
	ent.Schema
}

func (MateriaPrima) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "materia_prima"},
	}
}

func (MateriaPrima) Fields() []ent.Field {
	return []ent.Field{
		field.String("nombre_insumo").NotEmpty(),
		field.String("categoria").NotEmpty(),
		field.String("proveedor").NotEmpty(),
		field.String("unidad_medida").NotEmpty(),
		field.Float("costo_unitario"),
		field.Float("stock_actual"),
		field.Float("punto_reorden"),
	}
}

func (MateriaPrima) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("recetas", Recetas.Type),
	}
}
