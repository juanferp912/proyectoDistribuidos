package menu

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type Handler struct{ svc Service }

func NewHandler(app *fiber.App, svc Service) *Handler {
	h := &Handler{svc: svc}
	api := app.Group("/api/menu")
	api.Get("/", h.Listar)
	api.Get("/buscar", h.BuscarPorNombre)
	api.Get("/:id", h.BuscarPorID)
	api.Post("/", h.Crear)
	api.Put("/:id", h.Actualizar)
	api.Delete("/:id", h.Eliminar)
	return h
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
		return c.Status(404).JSON(fiber.Map{"error": "Producto no encontrado"})
	}
	return c.JSON(item)
}

func (h *Handler) BuscarPorNombre(c *fiber.Ctx) error {
	nombre := c.Query("nombre")
	items, err := h.svc.BuscarPorNombre(c.Context(), nombre)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(items)
}

type menuRequest struct {
	NombreProducto string  `json:"nombre_producto"`
	CategoriaMenu  string  `json:"categoria_menu"`
	PrecioVenta    float64 `json:"precio_venta"`
}

func (h *Handler) Crear(c *fiber.Ctx) error {
	var req menuRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "JSON inválido"})
	}
	item, err := h.svc.Crear(c.Context(), req.NombreProducto, req.CategoriaMenu, req.PrecioVenta)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(201).JSON(item)
}

func (h *Handler) Actualizar(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ID inválido"})
	}
	var req menuRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "JSON inválido"})
	}
	item, err := h.svc.Actualizar(c.Context(), id, req.NombreProducto, req.CategoriaMenu, req.PrecioVenta)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(item)
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
