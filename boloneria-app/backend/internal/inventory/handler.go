package inventory

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	svc Service
}

func NewHandler(app *fiber.App, svc Service) *Handler {
	h := &Handler{svc: svc}

	api := app.Group("/api/inventario")
	api.Get("/", h.Listar)
	api.Get("/:id", h.BuscarPorID)
	api.Post("/", h.Crear)
	api.Patch("/:id/stock", h.ActualizarStock)
	api.Delete("/:id", h.Eliminar)

	return h
}

func (h *Handler) Listar(c *fiber.Ctx) error {
	items, err := h.svc.Listar(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(items)
}

func (h *Handler) BuscarPorID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID inválido"})
	}
	item, err := h.svc.BuscarPorID(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Insumo no encontrado"})
	}
	return c.JSON(item)
}

type crearRequest struct {
	NombreInsumo  string  `json:"nombre_insumo"`
	Categoria     string  `json:"categoria"`
	Proveedor     string  `json:"proveedor"`
	UnidadMedida  string  `json:"unidad_medida"`
	CostoUnitario float64 `json:"costo_unitario"`
	StockActual   float64 `json:"stock_actual"`
	PuntoReorden  float64 `json:"punto_reorden"`
}

func (h *Handler) Crear(c *fiber.Ctx) error {
	var req crearRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "JSON inválido"})
	}
	if req.NombreInsumo == "" || req.Categoria == "" || req.Proveedor == "" || req.UnidadMedida == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Todos los campos de texto son obligatorios"})
	}
	item, err := h.svc.Crear(c.Context(),
		req.NombreInsumo, req.Categoria, req.Proveedor, req.UnidadMedida,
		req.CostoUnitario, req.StockActual, req.PuntoReorden,
	)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(item)
}

type actualizarStockRequest struct {
	StockActual float64 `json:"stock_actual"`
}

func (h *Handler) ActualizarStock(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID inválido"})
	}
	var req actualizarStockRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "JSON inválido"})
	}
	item, err := h.svc.ActualizarStock(c.Context(), id, req.StockActual)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(item)
}

func (h *Handler) Eliminar(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID inválido"})
	}
	if err := h.svc.Eliminar(c.Context(), id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
