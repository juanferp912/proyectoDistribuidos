CREATE TABLE materia_prima (
    id SERIAL PRIMARY KEY,
    codigo_sku VARCHAR(20) UNIQUE NOT NULL,
    nombre_insumo VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    unidad_medida VARCHAR(20) NOT NULL,
    cantidad_stock DECIMAL(10,2) NOT NULL CHECK (cantidad_stock >= 0),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
    punto_reorden DECIMAL(10,2) NOT NULL,
    fecha_caducidad DATE,
    proveedor_ref VARCHAR(100)
);

INSERT INTO materia_prima (codigo_sku, nombre_insumo, categoria, unidad_medida, cantidad_stock, precio_unitario, punto_reorden, fecha_caducidad, proveedor_ref) VALUES
('M-VER-01', 'Plátano Verde Barraganete', 'Masas', 'kg', 45.00, 1.20, 10.00, '2026-06-20', 'Hacienda El Oro'),
('L-QUE-01', 'Queso Manaba Artesanal', 'Lácteos', 'kg', 4.50, 4.50, 5.00, '2026-06-25', 'Lácteos Chone'),
('P-CHI-01', 'Chicharrón Especial (80/20)', 'Proteínas', 'kg', 3.00, 6.00, 5.00, '2026-06-18', 'Cárnicos del Puerto'),
('S-AJI-01', 'Ají Casero de la Casa', 'Salsas', 'litros', 2.00, 3.00, 2.50, '2026-06-30', 'Producción Interna');