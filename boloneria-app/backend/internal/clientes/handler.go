package clientes

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type Handler struct{ svc Service }

func NewHandler(app *fiber.App, svc Service) *Handler {
	h := &Handler{svc: svc}
	api := app.Group("/api/clientes")
	api.Get("/", h.Listar)
	api.Get("/buscar", h.BuscarPorNombre)
	api.Get("/:id", h.BuscarPorID)
	api.Post("/", h.Crear)
	api.Put("/:id", h.Actualizar)
	api.Delete("/:id", h.Eliminar)
	return h
}

type clienteRequest struct {
	NombreCompleto string  `json:"nombre_completo"`
	Telefono       *string `json:"telefono"`
	Email          *string `json:"email"`
	Direccion      *string `json:"direccion"`
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
		return c.Status(404).JSON(fiber.Map{"error": "Cliente no encontrado"})
	}
	return c.JSON(item)
}

func (h *Handler) BuscarPorNombre(c *fiber.Ctx) error {
	items, err := h.svc.BuscarPorNombre(c.Context(), c.Query("nombre"))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(items)
}

func (h *Handler) Crear(c *fiber.Ctx) error {
	var req clienteRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "JSON inválido"})
	}
	if req.NombreCompleto == "" {
		return c.Status(400).JSON(fiber.Map{"error": "El nombre es obligatorio"})
	}
	item, err := h.svc.Crear(c.Context(), req.NombreCompleto, req.Telefono, req.Email, req.Direccion)
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
	var req clienteRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "JSON inválido"})
	}
	item, err := h.svc.Actualizar(c.Context(), id, req.NombreCompleto, req.Telefono, req.Email, req.Direccion)
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
