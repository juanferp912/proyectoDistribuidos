// En dev: vacío → el proxy de Vite lo maneja (vite.config.ts)
// En Docker: VITE_API_URL=http://100.X.Y.Z:8080
const BASE = (import.meta.env.VITE_API_URL ?? '') + '/api'

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Error desconocido')
  }
  if (res.status === 204) return null as T
  return res.json()
}

export interface MateriaPrima {
  id: number
  nombre_insumo: string
  categoria: string
  proveedor: string
  unidad_medida: string
  costo_unitario: number
  stock_actual: number
  punto_reorden: number
}

export const inventarioApi = {
  listar: () => req<MateriaPrima[]>('/inventario/'),
  crear: (data: Omit<MateriaPrima, 'id'>) =>
    req<MateriaPrima>('/inventario/', { method: 'POST', body: JSON.stringify(data) }),
  actualizarStock: (id: number, stock_actual: number) =>
    req<MateriaPrima>(`/inventario/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ stock_actual }) }),
  eliminar: (id: number) => req<null>(`/inventario/${id}`, { method: 'DELETE' }),
}

export interface ProductoMenu {
  id: number
  nombre_producto: string
  categoria_menu: string
  precio_venta: number
}

export const menuApi = {
  listar: () => req<ProductoMenu[]>('/menu/'),
  crear: (data: Omit<ProductoMenu, 'id'>) =>
    req<ProductoMenu>('/menu/', { method: 'POST', body: JSON.stringify(data) }),
  actualizar: (id: number, data: Omit<ProductoMenu, 'id'>) =>
    req<ProductoMenu>(`/menu/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  eliminar: (id: number) => req<null>(`/menu/${id}`, { method: 'DELETE' }),
}

export interface Cliente {
  id: number
  nombre_completo: string
  telefono?: string | null
  email?: string | null
  direccion?: string | null
}

export const clientesApi = {
  listar: () => req<Cliente[]>('/clientes/'),
  crear: (data: Omit<Cliente, 'id'>) =>
    req<Cliente>('/clientes/', { method: 'POST', body: JSON.stringify(data) }),
  actualizar: (id: number, data: Omit<Cliente, 'id'>) =>
    req<Cliente>(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  eliminar: (id: number) => req<null>(`/clientes/${id}`, { method: 'DELETE' }),
}

export interface DetallePedido {
  id: number
  cantidad: number
  precio_unitario: number
  subtotal: number
  edges?: { producto?: ProductoMenu }
}

export interface Pedido {
  id: number
  fecha_pedido: string
  estado: string
  total_pedido: number
  edges?: { cliente?: Cliente; detalles?: DetallePedido[] }
}

export interface NuevoPedidoDetalle {
  producto_id: number
  cantidad: number
  precio_unitario: number
}

export const pedidosApi = {
  listar: () => req<Pedido[]>('/pedidos/'),
  buscarPorID: (id: number) => req<Pedido>(`/pedidos/${id}`),
  crear: (data: { cliente_id?: number | null; estado?: string; detalles: NuevoPedidoDetalle[] }) =>
    req<Pedido>('/pedidos/', { method: 'POST', body: JSON.stringify(data) }),
  actualizarEstado: (id: number, estado: string) =>
    req<Pedido>(`/pedidos/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
  eliminar: (id: number) => req<null>(`/pedidos/${id}`, { method: 'DELETE' }),
}

// ── Reportes n8n ──────────────────────────────────────────────────────────────
const N8N_BASE = import.meta.env.VITE_N8N_URL     ?? 'http://100.112.215.44:5678'
const N8N_WH   = import.meta.env.VITE_N8N_WEBHOOK ?? '/webhook/reportes'

export type TipoReporte = 'bajo-stock' | 'top-valor' | 'resumen' | 'ventas' | 'ia-insight' | 'prediccion' | 'rentabilidad'

export interface IAInsightData {
  semaforo?: 'ROJO' | 'AMARILLO' | 'VERDE'
  resumen_ejecutivo?: string
  riesgos?: string[]
  acciones_inmediatas?: string[]
  oportunidad?: string
  prediccion?: string
}

export interface RespuestaReporte {
  tipo: TipoReporte
  data?: Record<string, unknown>[]
  total?: number
  insight?: string          // texto plano o JSON string que viene de Mistral
  insightParsed?: IAInsightData // parseado si Mistral responde JSON estructurado
  modelo?: string
  tokens_usados?: number
}

export const reportesApi = {
  obtener: (tipo: TipoReporte): Promise<RespuestaReporte> =>
    fetch(N8N_BASE + N8N_WH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo }),
    }).then(async r => {
      if (!r.ok) throw new Error(`n8n respondió ${r.status} — verifica que el webhook esté activo`)
      const raw = await r.json()
      // n8n con allIncomingItems envuelve en array — lo desenvolvemos
      const resp: RespuestaReporte = Array.isArray(raw) ? raw[0] : raw
      // Si Mistral devolvió JSON estructurado como string, lo parseamos
      if (resp.insight) {
        try {
          const cleaned = resp.insight.replace(/```json|```/g, '').trim()
          resp.insightParsed = JSON.parse(cleaned)
        } catch {
          // Si no es JSON válido, se muestra como texto plano — no es error
        }
      }
      return resp
    }),
}
