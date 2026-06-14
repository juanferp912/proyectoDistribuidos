-- 1. Tabla de Categorías
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT
);

-- 2. Tabla de Proveedores
CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nombre_empresa VARCHAR(100) UNIQUE NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100)
);

-- 3. Tabla Principal de Materia Prima (El Catálogo)
CREATE TABLE materia_prima (
    id SERIAL PRIMARY KEY,
    codigo_sku VARCHAR(20) UNIQUE NOT NULL,
    nombre_insumo VARCHAR(100) NOT NULL,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE RESTRICT,
    proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE SET NULL,
    unidad_medida VARCHAR(20) NOT NULL,
    cantidad_stock DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (cantidad_stock >= 0),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
    punto_reorden DECIMAL(10,2) NOT NULL,
    fecha_caducidad DATE
);

-- 4. Tabla de Movimientos (Kardex para trazabilidad total)
CREATE TABLE movimientos_inventario (
    id SERIAL PRIMARY KEY,
    materia_prima_id INTEGER REFERENCES materia_prima(id) ON DELETE CASCADE,
    tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('ENTRADA', 'SALIDA', 'AJUSTE')),
    cantidad DECIMAL(10,2) NOT NULL,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo VARCHAR(150) NOT NULL,
    usuario_responsable VARCHAR(50) DEFAULT 'Sistema'
);

-- ==========================================
-- INSERCIÓN DE DATOS SEMILLA (SEED DATA)
-- ==========================================

INSERT INTO categorias (nombre, descripcion) VALUES
('Masas y Tubérculos', 'Bases para los bolones'),
('Lácteos', 'Quesos y derivados'),
('Proteínas', 'Carnes y chicharrones'),
('Salsas y Aderezos', 'Acompañantes');

INSERT INTO proveedores (nombre_empresa, contacto, telefono, email) VALUES
('Hacienda El Oro', 'Don Carlos', '0991234567', 'ventas@eloro.com'),
('Lácteos Chone', 'María Mendoza', '0987654321', 'pedidos@lacteoschone.ec'),
('Cárnicos del Puerto', 'Julio Jaramillo', '0971122334', 'despacho@carnicos.com');

INSERT INTO materia_prima (codigo_sku, nombre_insumo, categoria_id, proveedor_id, unidad_medida, cantidad_stock, precio_unitario, punto_reorden, fecha_caducidad) VALUES
('M-VER-01', 'Plátano Verde Barraganete', 1, 1, 'kg', 45.00, 1.20, 10.00, '2026-06-20'),
('L-QUE-01', 'Queso Manaba Artesanal', 2, 2, 'kg', 4.50, 4.50, 5.00, '2026-06-25'),
('P-CHI-01', 'Chicharrón Especial (80/20)', 3, 3, 'kg', 3.00, 6.00, 5.00, '2026-06-18'),
('S-AJI-01', 'Ají Casero de la Casa', 4, NULL, 'litros', 2.00, 3.00, 2.50, '2026-06-30');

-- Insertar movimientos iniciales para que Gustavo tenga historial
INSERT INTO movimientos_inventario (materia_prima_id, tipo_movimiento, cantidad, motivo, usuario_responsable) VALUES
(1, 'ENTRADA', 50.00, 'Compra inicial de semana', 'Admin_Bodega'),
(1, 'SALIDA', 5.00, 'Producción turno mañana', 'Chef_Luis'),
(2, 'ENTRADA', 10.00, 'Recepción proveedor', 'Admin_Bodega'),
(2, 'SALIDA', 5.50, 'Producción turno mañana', 'Chef_Luis');