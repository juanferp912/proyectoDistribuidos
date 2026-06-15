-- 1. TABLA DE INVENTARIO (La Despensa)
CREATE TABLE materia_prima (
    id SERIAL PRIMARY KEY,
    nombre_insumo VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    proveedor VARCHAR(100) NOT NULL,
    unidad_medida VARCHAR(20) NOT NULL,
    costo_unitario DECIMAL(10,2) NOT NULL,
    stock_actual DECIMAL(10,2) NOT NULL,
    punto_reorden DECIMAL(10,2) NOT NULL
);

-- 2. TABLA DEL MENÚ (Lo que se vende)
CREATE TABLE productos_menu (
    id SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    categoria_menu VARCHAR(50) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL
);

-- 3. TABLA DE RECETAS (El puente Despensa -> Menú)
CREATE TABLE recetas (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos_menu(id) ON DELETE CASCADE,
    materia_prima_id INTEGER REFERENCES materia_prima(id) ON DELETE CASCADE,
    cantidad_necesaria DECIMAL(10,3) NOT NULL
);

-- 4. TABLA DE CLIENTES (Para el módulo de ventas)
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT
);

-- 5. TABLA DE PEDIDOS (Cabecera de la venta)
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'COMPLETADO',
    total_pedido DECIMAL(10,2) NOT NULL
);

-- 6. DETALLES DEL PEDIDO (Los bolones específicos que compraron)
CREATE TABLE detalles_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos_menu(id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);