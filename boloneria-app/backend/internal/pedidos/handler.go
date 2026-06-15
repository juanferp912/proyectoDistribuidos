package pedidos

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type Handler struct{ svc Service }

func NewHandler(app *fiber.App, svc Service) *Handler {
	h := &Handler{svc: svc}
	api := app.Group("/api/pedidos")
	api.Get("/", h.Listar)
	api.Get("/:id", h.BuscarPorID)
	api.Post("/", h.Crear)
	api.Patch("/:id/estado", h.ActualizarEstado)
	api.Delete("/:id", h.Eliminar)
	return h
}

type detalleReq struct {
	ProductoID     int     `json:"producto_id"`
	Cantidad       int     `json:"cantidad"`
	PrecioUnitario float64 `json:"precio_unitario"`
}

type crearPedidoReq struct {
	ClienteID *int         `json:"cliente_id"`
	Estado    string       `json:"estado"`
	Detalles  []detalleReq `json:"detalles"`
}

func (h *Handler) Listar(c *fiber.Ctx) error {
	items, err := h.svc.Listar(c.Context())
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(items)
}

func (h *Handler) BuscarPorID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ID inválido"})
	}
	item, err := h.svc.BuscarPorID(c.Context(), id)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Pedido no encontrado"})
	}
	return c.JSON(item)
}

func (h *Handler) Crear(c *fiber.Ctx) error {
	var req crearPedidoReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "JSON inválido"})
	}
	lines := make([]DetalleLine, len(req.Detalles))
	for i, d := range req.Detalles {
		lines[i] = DetalleLine{
			ProductoID:     d.ProductoID,
			Cantidad:       d.Cantidad,
			PrecioUnitario: d.PrecioUnitario,
		}
	}
	p, err := h.svc.Crear(c.Context(), req.ClienteID, req.Estado, lines)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(201).JSON(p)
}

func (h *Handler) ActualizarEstado(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ID inválido"})
	}
	var body struct {
		Estado string `json:"estado"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "JSON inválido"})
	}
	p, err := h.svc.ActualizarEstado(c.Context(), id, body.Estado)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(p)
}

func (h *Handler) Eliminar(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ID inválido"})
	}
	if err := h.svc.Eliminar(c.Context(), id); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.SendStatus(204)
}
