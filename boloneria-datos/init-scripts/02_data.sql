-- ==========================================
-- 1. INSERTS DE MATERIA PRIMA (31 Registros)
-- ==========================================
INSERT INTO materia_prima (nombre_insumo, categoria, proveedor, unidad_medida, costo_unitario, stock_actual, punto_reorden) VALUES
('Plátano Verde Barraganete', 'Masas', 'Hacienda El Oro', 'kg', 1.50, 45.0, 10.0),
('Plátano Pintón', 'Masas', 'Hacienda El Oro', 'kg', 1.55, 20.0, 8.0),
('Plátano Maduro', 'Masas', 'Hacienda El Oro', 'kg', 1.60, 25.0, 8.0),
('Yuca de exportación', 'Masas', 'Mercado Mayorista', 'kg', 1.20, 15.0, 5.0),
('Queso Manaba Artesanal', 'Lácteos', 'Lácteos Chone', 'kg', 3.00, 12.0, 4.0),
('Queso Mozzarella', 'Lácteos', 'Rey Queso', 'kg', 4.50, 8.0, 3.0),
('Queso Cheddar', 'Lácteos', 'Rey Queso', 'kg', 5.00, 5.0, 2.0),
('Chicharrón Especial', 'Cárnicos', 'Cárnicos del Puerto', 'kg', 6.00, 10.0, 4.0),
('Carne de Res (Bistec)', 'Cárnicos', 'Cárnicos del Puerto', 'kg', 4.50, 8.0, 3.0),
('Pollo Desmechado', 'Cárnicos', 'Avícola San Juan', 'kg', 3.50, 7.0, 3.0),
('Tocino Ahumado', 'Cárnicos', 'La Ibérica', 'kg', 7.50, 4.0, 2.0),
('Longaniza Artesanal', 'Cárnicos', 'Cárnicos del Puerto', 'kg', 5.50, 6.0, 2.0),
('Huevos Cubeta', 'Abarrotes', 'Avícola San Juan', 'unidades', 0.15, 120.0, 30.0),
('Aceite Vegetal', 'Abarrotes', 'La Fabril', 'litros', 2.50, 20.0, 5.0),
('Mantequilla con sal', 'Lácteos', 'Lácteos Chone', 'kg', 4.00, 5.0, 1.5),
('Sal Yodada', 'Abarrotes', 'Ecuasal', 'kg', 0.50, 10.0, 2.0),
('Pimienta Negra', 'Abarrotes', 'Mercado Mayorista', 'kg', 8.00, 1.0, 0.2),
('Comino Molido', 'Abarrotes', 'Mercado Mayorista', 'kg', 6.00, 1.0, 0.2),
('Achiote en pasta', 'Abarrotes', 'Mercado Mayorista', 'kg', 3.50, 2.0, 0.5),
('Cebolla Colorada', 'Vegetales', 'Mercado Mayorista', 'kg', 1.20, 8.0, 2.0),
('Cebolla Blanca', 'Vegetales', 'Mercado Mayorista', 'kg', 1.30, 5.0, 1.5),
('Tomate Riñón', 'Vegetales', 'Mercado Mayorista', 'kg', 1.00, 6.0, 2.0),
('Pimiento Verde', 'Vegetales', 'Mercado Mayorista', 'kg', 1.10, 4.0, 1.0),
('Ajo Pelado', 'Vegetales', 'Mercado Mayorista', 'kg', 3.00, 2.0, 0.5),
('Cilantro Fresco', 'Vegetales', 'Mercado Mayorista', 'paquete', 1.00, 10.0, 3.0),
('Café Pasado de Loja', 'Bebidas', 'Cafetal Loja', 'kg', 8.50, 5.0, 1.0),
('Leche Entera', 'Lácteos', 'Rey Queso', 'litros', 0.90, 15.0, 5.0),
('Azúcar Blanca', 'Abarrotes', 'San Carlos', 'kg', 1.10, 10.0, 3.0),
('Mora Congelada', 'Frutas', 'Mercado Mayorista', 'kg', 2.50, 8.0, 2.0),
('Maracuyá', 'Frutas', 'Mercado Mayorista', 'kg', 1.80, 5.0, 2.0),
('Ají Casero (Producción)', 'Salsas', 'Interno', 'litros', 2.00, 3.0, 1.0);

-- ==========================================
-- 2. INSERTS DE PRODUCTOS DEL MENÚ (30 Registros)
-- ==========================================
INSERT INTO productos_menu (nombre_producto, categoria_menu, precio_venta) VALUES
('Bolón de Queso Manaba', 'Bolones', 2.50),
('Bolón de Chicharrón', 'Bolones', 2.50),
('Bolón Mixto (Queso y Chicharrón)', 'Bolones', 3.00),
('Bolón Pintón de Queso', 'Bolones', 2.50),
('Bolón Pintón Mixto', 'Bolones', 3.00),
('Bolón Maduro de Queso', 'Bolones', 2.50),
('Bolón Maduro Mixto', 'Bolones', 3.00),
('Bolón de Longaniza', 'Bolones', 3.50),
('Bolón Completo (Huevo y Bistec)', 'Bolones', 5.00),
('Bolón de Pollo', 'Bolones', 3.50),
('Tigrillo Sencillo', 'Tigrillos', 3.50),
('Tigrillo Mixto', 'Tigrillos', 4.50),
('Tigrillo Completo', 'Tigrillos', 5.50),
('Tigrillo de Longaniza', 'Tigrillos', 5.00),
('Empanada de Verde con Queso', 'Empanadas', 1.50),
('Empanada de Verde con Carne', 'Empanadas', 1.75),
('Empanada de Verde Mixta', 'Empanadas', 2.00),
('Corviche Sencillo', 'Mariscos/Verde', 1.50),
('Muchín de Yuca', 'Yuca', 1.00),
('Pan de Yuca', 'Yuca', 0.50),
('Tortilla de Verde', 'Masas Extras', 1.50),
('Porción de Bistec', 'Extras', 2.00),
('Porción de Huevo Frito', 'Extras', 0.50),
('Porción de Queso Extra', 'Extras', 1.00),
('Jugo de Mora', 'Bebidas', 1.50),
('Jugo de Maracuyá', 'Bebidas', 1.50),
('Batido de Mora', 'Bebidas', 2.00),
('Café Pasado Americano', 'Bebidas Térmicas', 1.00),
('Café con Leche', 'Bebidas Térmicas', 1.50),
('Gaseosa Personal', 'Bebidas', 1.00);

-- ==========================================
-- 3. INSERTS DE RECETAS (30 Registros base)
-- ==========================================
INSERT INTO recetas (producto_id, materia_prima_id, cantidad_necesaria) VALUES
(1, 1, 0.700), (1, 5, 0.100), (1, 14, 0.050),  -- Bolón de Queso
(2, 1, 0.700), (2, 8, 0.150), (2, 14, 0.050),  -- Bolón de Chicharrón
(3, 1, 0.700), (3, 5, 0.080), (3, 8, 0.100),   -- Bolón Mixto
(4, 2, 0.700), (4, 5, 0.100), (4, 14, 0.050),  -- Bolón Pintón de Queso
(5, 2, 0.700), (5, 5, 0.080), (5, 8, 0.100),   -- Bolón Pintón Mixto
(6, 3, 0.700), (6, 5, 0.100), (6, 14, 0.050),  -- Bolón Maduro de Queso
(7, 3, 0.700), (7, 5, 0.080), (7, 8, 0.100),   -- Bolón Maduro Mixto
(8, 1, 0.700), (8, 12, 0.150),                 -- Bolón Longaniza
(11, 1, 0.600), (11, 5, 0.100), (11, 13, 1.0), -- Tigrillo Sencillo
(12, 1, 0.600), (12, 5, 0.080), (12, 8, 0.100),(12, 13, 1.0), -- Tigrillo Mixto
(15, 1, 0.200), (15, 5, 0.050),                -- Empanada Queso
(16, 1, 0.200), (16, 9, 0.050),                -- Empanada Carne
(25, 29, 0.250), (25, 28, 0.050),              -- Jugo Mora
(26, 30, 0.200), (26, 28, 0.050),              -- Jugo Maracuyá
(28, 26, 0.020), (28, 28, 0.010);              -- Café Pasado

-- ==========================================
-- 4. INSERTS DE CLIENTES (30 Registros)
-- ==========================================
INSERT INTO clientes (nombre_completo, telefono, email, direccion) VALUES
('Juan Pérez', '0991112233', 'juan.perez@email.com', 'Sauces 8, Guayaquil'),
('María Gómez', '0982223344', 'maria.gomez@email.com', 'Alborada 10, Guayaquil'),
('Carlos Ruiz', '0973334455', 'carlos.ruiz@email.com', 'Urdesa Central, Guayaquil'),
('Ana López', '0994445566', 'ana.lopez@email.com', 'Samborondón, Km 2'),
('Luis Fernández', '0985556677', 'luis.fernandez@email.com', 'Ceibos, Guayaquil'),
('Marta Sánchez', '0976667788', 'marta.sanchez@email.com', 'Kennedy Norte, Guayaquil'),
('José Torres', '0997778899', 'jose.torres@email.com', 'Garzota 2, Guayaquil'),
('Elena Ramírez', '0988889900', 'elena.ramirez@email.com', 'Puerto Santa Ana, Guayaquil'),
('Jorge Díaz', '0979990011', 'jorge.diaz@email.com', 'Mucho Lote, Guayaquil'),
('Laura Vargas', '0990001122', 'laura.vargas@email.com', 'Centro, Guayaquil'),
('Diego Castro', '0981122334', 'diego.castro@email.com', 'La Joya, Daule'),
('Sofía Morales', '0972233445', 'sofia.morales@email.com', 'Villa Club, Daule'),
('Andrés Herrera', '0993344556', 'andres.herrera@email.com', 'Samanes 4, Guayaquil'),
('Isabel Medina', '0984455667', 'isabel.medina@email.com', 'Guayacanes, Guayaquil'),
('Fernando Ríos', '0975566778', 'fernando.rios@email.com', 'Vía a la Costa, Km 11'),
('Carmen Silva', '0996677889', 'carmen.silva@email.com', 'Puerto Azul, Guayaquil'),
('Roberto Vega', '0987788990', 'roberto.vega@email.com', 'Las Orquídeas, Guayaquil'),
('Paula Ortiz', '0978899001', 'paula.ortiz@email.com', 'Miraflores, Guayaquil'),
('Ricardo Núñez', '0999900112', 'ricardo.nunez@email.com', 'Ciudad Celeste, Samborondón'),
('Patricia Rojas', '0980011223', 'patricia.rojas@email.com', 'Entre Ríos, Samborondón'),
('Gabriel Paredes', '0971122334', 'gabriel.paredes@email.com', 'Acuarela del Río, Guayaquil'),
('Lucía Mendoza', '0992233445', 'lucia.mendoza@email.com', 'Sauces 4, Guayaquil'),
('Javier Cruz', '0983344556', 'javier.cruz@email.com', 'Alborada 12, Guayaquil'),
('Valeria Reyes', '0974455667', 'valeria.reyes@email.com', 'Urdesa Norte, Guayaquil'),
('Héctor Aguilar', '0995566778', 'hector.aguilar@email.com', 'Los Esteros, Guayaquil'),
('Teresa Campos', '0986677889', 'teresa.campos@email.com', 'Floresta, Guayaquil'),
('Simón Delgado', '0977788990', 'simon.delgado@email.com', 'Centenario, Guayaquil'),
('Diana León', '0998899001', 'diana.leon@email.com', 'Barrio Orellana, Guayaquil'),
('Mario Cordero', '0989900112', 'mario.cordero@email.com', 'Bellavista, Guayaquil'),
('Silvia Pineda', '0970011223', 'silvia.pineda@email.com', 'Urdenor, Guayaquil');

-- ==========================================
-- 5. INSERTS DE PEDIDOS CABECERA (30 Registros)
-- ==========================================
INSERT INTO pedidos (cliente_id, fecha_pedido, estado, total_pedido) VALUES
(1, '2026-06-10 08:30:00', 'COMPLETADO', 5.50), (2, '2026-06-10 08:45:00', 'COMPLETADO', 3.00),
(3, '2026-06-10 09:15:00', 'COMPLETADO', 7.50), (4, '2026-06-10 09:30:00', 'COMPLETADO', 2.50),
(5, '2026-06-10 10:00:00', 'COMPLETADO', 4.00), (6, '2026-06-11 08:10:00', 'COMPLETADO', 8.50),
(7, '2026-06-11 08:25:00', 'COMPLETADO', 6.00), (8, '2026-06-11 09:05:00', 'COMPLETADO', 3.50),
(9, '2026-06-11 09:40:00', 'COMPLETADO', 5.00), (10, '2026-06-11 10:20:00', 'COMPLETADO', 9.00),
(11, '2026-06-12 07:50:00', 'COMPLETADO', 4.50), (12, '2026-06-12 08:15:00', 'COMPLETADO', 2.50),
(13, '2026-06-12 08:50:00', 'COMPLETADO', 10.50), (14, '2026-06-12 09:35:00', 'COMPLETADO', 6.50),
(15, '2026-06-12 10:15:00', 'COMPLETADO', 3.00), (16, '2026-06-13 08:00:00', 'COMPLETADO', 5.00),
(17, '2026-06-13 08:30:00', 'COMPLETADO', 7.00), (18, '2026-06-13 09:10:00', 'COMPLETADO', 4.00),
(19, '2026-06-13 09:45:00', 'COMPLETADO', 8.00), (20, '2026-06-13 10:30:00', 'COMPLETADO', 3.50),
(21, '2026-06-14 07:45:00', 'COMPLETADO', 6.00), (22, '2026-06-14 08:20:00', 'COMPLETADO', 9.50),
(23, '2026-06-14 08:55:00', 'COMPLETADO', 5.50), (24, '2026-06-14 09:25:00', 'COMPLETADO', 4.50),
(25, '2026-06-14 10:00:00', 'COMPLETADO', 7.50), (26, '2026-06-14 10:40:00', 'COMPLETADO', 3.00),
(27, '2026-06-14 11:15:00', 'COMPLETADO', 8.50), (28, '2026-06-14 11:50:00', 'COMPLETADO', 5.00),
(29, '2026-06-14 12:20:00', 'COMPLETADO', 6.50), (30, '2026-06-14 12:45:00', 'COMPLETADO', 10.00);

-- ==========================================
-- 6. INSERTS DE DETALLES DEL PEDIDO (30 Registros)
-- ==========================================
INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 3, 1, 3.00, 3.00), (1, 1, 1, 2.50, 2.50),
(2, 5, 1, 3.00, 3.00),
(3, 12, 1, 4.50, 4.50), (3, 25, 2, 1.50, 3.00),
(4, 2, 1, 2.50, 2.50),
(5, 15, 2, 1.50, 3.00), (5, 28, 1, 1.00, 1.00),
(6, 9, 1, 5.00, 5.00), (6, 11, 1, 3.50, 3.50),
(7, 3, 2, 3.00, 6.00),
(8, 8, 1, 3.50, 3.50),
(9, 10, 1, 3.50, 3.50), (9, 26, 1, 1.50, 1.50),
(10, 13, 1, 5.50, 5.50), (10, 8, 1, 3.50, 3.50),
(11, 1, 1, 2.50, 2.50), (11, 27, 1, 2.00, 2.00),
(12, 4, 1, 2.50, 2.50),
(13, 12, 2, 4.50, 9.00), (13, 29, 1, 1.50, 1.50),
(14, 5, 2, 3.00, 6.00), (14, 20, 1, 0.50, 0.50),
(15, 7, 1, 3.00, 3.00),
(16, 2, 2, 2.50, 5.00),
(17, 11, 2, 3.50, 7.00),
(18, 15, 2, 1.50, 3.00), (18, 30, 1, 1.00, 1.00),
(19, 9, 1, 5.00, 5.00), (19, 3, 1, 3.00, 3.00),
(20, 8, 1, 3.50, 3.50),
(21, 13, 1, 5.50, 5.50), (21, 20, 1, 0.50, 0.50),
(22, 12, 2, 4.50, 9.00), (22, 23, 1, 0.50, 0.50);