import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts'
import { reportesApi, type TipoReporte, type RespuestaReporte, type IAInsightData } from '../lib/api'
import { descargarCSV } from '../lib/exportCsv'
import { descargarPDF } from '../lib/exportPdf'
import {
  AlertTriangle, TrendingUp, LayoutList, ShoppingCart,
  Sparkles, Download, FileText, WifiOff,
  CalendarClock, DollarSign,
} from 'lucide-react'

export const Route = createFileRoute('/reportes')({ component: Reportes })

// ── Paleta verde plátano ───────────────────────────────────────────────────────
const P = ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7']

// ── Configuración de cada reporte ─────────────────────────────────────────────
const CONFIGS: {
  tipo: TipoReporte
  titulo: string
  subtitulo: string
  icon: React.ReactNode
  accent: string
  bg: string
}[] = [
  {
    tipo: 'bajo-stock',
    titulo: 'Alerta de Bajo Stock',
    subtitulo: 'Insumos en o bajo el punto de reorden',
    icon: <AlertTriangle size={20} />,
    accent: 'text-warning',
    bg: 'bg-warning/10 border-warning/30',
  },
  {
    tipo: 'top-valor',
    titulo: 'Top 5 por Valor',
    subtitulo: 'Mayor valor total en inventario (cant. × costo)',
    icon: <TrendingUp size={20} />,
    accent: 'text-primary',
    bg: 'bg-primary/10 border-primary/30',
  },
  {
    tipo: 'resumen',
    titulo: 'Resumen General',
    subtitulo: 'KPIs globales del inventario y operaciones',
    icon: <LayoutList size={20} />,
    accent: 'text-success',
    bg: 'bg-success/10 border-success/30',
  },
  {
    tipo: 'ventas',
    titulo: 'Ventas Recientes',
    subtitulo: 'Últimos 10 pedidos registrados',
    icon: <ShoppingCart size={20} />,
    accent: 'text-info',
    bg: 'bg-info/10 border-info/30',
  },
  {
    tipo: 'ia-insight',
    titulo: 'Análisis con IA',
    subtitulo: 'Insights generados por Mistral AI',
    icon: <Sparkles size={20} />,
    accent: 'text-secondary',
    bg: 'bg-secondary/10 border-secondary/30',
  },
  {
    tipo: 'prediccion',
    titulo: 'Predicciones de Stock',
    subtitulo: 'Días estimados hasta agotarse por consumo histórico',
    icon: <CalendarClock size={20} />,
    accent: 'text-error',
    bg: 'bg-error/10 border-error/30',
  },
  {
    tipo: 'rentabilidad',
    titulo: 'Rentabilidad del Menú',
    subtitulo: 'Margen bruto por producto según costo de receta',
    icon: <DollarSign size={20} />,
    accent: 'text-success',
    bg: 'bg-success/10 border-success/30',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const N8N_HOST = import.meta.env.VITE_N8N_URL ?? 'http://100.112.215.44:5678'

function colorAlerta(v: string) {
  if (v === 'CRÍTICO') return 'text-error font-bold'
  if (v === 'MUY BAJO') return 'text-warning font-semibold'
  if (v === 'BAJO') return 'text-warning'
  return ''
}

function fmt(v: unknown): string {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'number') return v.toLocaleString('es-EC')
  return String(v)
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Reportes() {
  const [activo, setActivo]       = useState<TipoReporte | null>(null)
  const [resultado, setResultado] = useState<RespuestaReporte | null>(null)
  const [cargando, setCargando]   = useState(false)
  const [error, setError]         = useState('')
  const panelRef = useRef<HTMLDivElement>(null)

  const ejecutar = async (tipo: TipoReporte) => {
    if (cargando) return
    setActivo(tipo)
    setCargando(true)
    setResultado(null)
    setError('')
    try {
      const res = await reportesApi.obtener(tipo)
      setResultado(res)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setCargando(false)
    }
  }

  const cfg = CONFIGS.find(c => c.tipo === activo)

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Encabezado */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">Reportes</h1>
          <p className="text-sm text-base-content/50 flex items-center gap-2 mt-0.5">
            <span>Motor: n8n</span>
            <span className="badge badge-ghost badge-xs font-mono">{N8N_HOST}</span>
          </p>
        </div>
      </div>

      {/* Tarjetas de selección */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CONFIGS.map(c => (
          <button
            key={c.tipo}
            onClick={() => ejecutar(c.tipo)}
            disabled={cargando}
            className={`
              card text-left p-4 border transition-all
              hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]
              ${activo === c.tipo
                ? `${c.bg} shadow-md`
                : 'bg-base-100 border-base-300 hover:border-base-400'}
              ${cargando && activo !== c.tipo ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className={`${c.accent} mb-2 block`}>{c.icon}</span>
            <p className="font-bold text-sm leading-tight">{c.titulo}</p>
            <p className="text-xs text-base-content/45 mt-1 leading-snug">{c.subtitulo}</p>
            {activo === c.tipo && cargando && (
              <span className="loading loading-dots loading-xs mt-2 text-base-content/30" />
            )}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error gap-2 text-sm">
          <WifiOff size={16} />
          <div>
            <p className="font-semibold">{error}</p>
            <p className="text-xs opacity-70 mt-0.5">
              Verifica que Juanfer tenga sus contenedores activos y el workflow de n8n activado.
            </p>
          </div>
        </div>
      )}

      {/* Panel de resultado */}
      {resultado && !cargando && cfg && (
        <div className="space-y-4">

          {/* Cabecera del resultado + acciones */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className={cfg.accent}>{cfg.icon}</span>
              <div>
                <h2 className="font-bold text-base leading-tight">{cfg.titulo}</h2>
                {resultado.total !== undefined && (
                  <p className="text-xs text-base-content/40">{resultado.total} registros</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {resultado.data && resultado.data.length > 0 && (
                <button
                  className="btn btn-ghost btn-sm gap-1.5 border border-base-300"
                  onClick={() => descargarCSV(resultado.data!, resultado.tipo)}
                >
                  <Download size={13} /> CSV
                </button>
              )}
              <button
                className="btn btn-ghost btn-sm gap-1.5 border border-base-300"
                onClick={() => descargarPDF('reporte-panel', resultado.tipo)}
              >
                <FileText size={13} /> PDF
              </button>
            </div>
          </div>

          {/* Contenido capturable para PDF */}
          <div id="reporte-panel" ref={panelRef} className="space-y-4 bg-base-100 rounded-2xl p-1">

            {/* ── Tabla de datos (bajo-stock, top-valor, ventas) ── */}
            {resultado.data && Array.isArray(resultado.data) && resultado.data.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-base-300">
                <table className="table table-sm">
                  <thead className="bg-base-200">
                    <tr>
                      {Object.keys(resultado.data[0]).map(k => (
                        <th key={k} className="text-xs uppercase tracking-wide text-base-content/50 font-semibold">
                          {k.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.data.map((row, i) => (
                      <tr key={i} className="hover">
                        {Object.values(row).map((v, j) => (
                          <td key={j} className={colorAlerta(String(v))}>
                            {fmt(v)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Gráficos según el tipo ── */}
            {resultado.tipo === 'top-valor' && resultado.data && resultado.data.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                <GraficoBarras data={resultado.data} />
                <GraficoPie data={resultado.data} />
              </div>
            )}

            {resultado.tipo === 'bajo-stock' && resultado.data && resultado.data.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                <GraficoStockActual data={resultado.data} />
                <GraficoRadar data={resultado.data} />
              </div>
            )}

            {resultado.tipo === 'ventas' && resultado.data && resultado.data.length > 0 && (
              <GraficoVentas data={resultado.data} />
            )}

            {/* ── Resumen: KPI cards ── */}
            {resultado.tipo === 'resumen' && resultado.data && (
              <KpiCards data={
                Array.isArray(resultado.data) ? resultado.data[0] : resultado.data
              } />
            )}

            {/* ── IA Insight ── */}
            {resultado.tipo === 'ia-insight' && resultado.insight && (
              <IAInsight
                insight={resultado.insight}
                parsed={resultado.insightParsed}
                modelo={resultado.modelo}
                tokens={resultado.tokens_usados}
              />
            )}

            {/* ── Predicción ── */}
            {resultado.tipo === 'prediccion' && resultado.data && resultado.data.length > 0 && (
              <GraficoPrediccion data={resultado.data} />
            )}

            {/* ── Rentabilidad ── */}
            {resultado.tipo === 'rentabilidad' && resultado.data && resultado.data.length > 0 && (
              <GraficoRentabilidad data={resultado.data} />
            )}

          </div>
        </div>
      )}

      {/* Sin datos */}
      {resultado && !cargando && resultado.data?.length === 0 && resultado.tipo !== 'ia-insight' && (
        <div className="text-center py-14 text-base-content/30">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm">Sin datos para este reporte</p>
        </div>
      )}
    </div>
  )
}

// ── Gráfico barras — Top valor ─────────────────────────────────────────────────
function GraficoBarras({ data }: { data: Record<string, unknown>[] }) {
  const d = data.map(r => ({
    name: String(r.nombre_insumo ?? '').split(' ').slice(0, 2).join(' '),
    valor: Number(r.valor_total ?? 0),
  }))
  return (
    <div className="card bg-base-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50 mb-3">Valor total ($)</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={d} margin={{ left: -10 }}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip formatter={(v: unknown) => [`$${Number(v).toLocaleString('es-EC')}`, 'Valor']} />
          <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
            {d.map((_, i) => <Cell key={i} fill={P[i % P.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Gráfico pie — Top valor ────────────────────────────────────────────────────
function GraficoPie({ data }: { data: Record<string, unknown>[] }) {
  const d = data.map(r => ({
    name: String(r.nombre_insumo ?? '').split(' ').slice(0, 2).join(' '),
    value: Number(r.valor_total ?? 0),
  }))
  return (
    <div className="card bg-base-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50 mb-3">Distribución</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={d} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={72} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
            {d.map((_, i) => <Cell key={i} fill={P[i % P.length]} />)}
          </Pie>
          <Tooltip formatter={(v: unknown) => `$${Number(v).toLocaleString('es-EC')}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Gráfico barras — Stock actual (bajo-stock) ─────────────────────────────────
function GraficoStockActual({ data }: { data: Record<string, unknown>[] }) {
  const d = data.map(r => ({
    name: String(r.nombre_insumo ?? '').split(' ')[0],
    stock: Number(r.stock_actual ?? 0),
    reorden: Number(r.punto_reorden ?? 0),
  }))
  return (
    <div className="card bg-base-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50 mb-3">Stock vs Punto de Reorden</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={d} margin={{ left: -10 }}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="reorden" fill="#fde68a" radius={[4, 4, 0, 0]} name="Reorden" />
          <Bar dataKey="stock" fill="#ef4444" radius={[4, 4, 0, 0]} name="Stock actual" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Gráfico radar — déficit (bajo-stock) ──────────────────────────────────────
function GraficoRadar({ data }: { data: Record<string, unknown>[] }) {
  const d = data.map(r => ({
    insumo: String(r.nombre_insumo ?? '').split(' ')[0],
    deficit: Math.max(0, Number(r.punto_reorden ?? 0) - Number(r.stock_actual ?? 0)),
  }))
  return (
    <div className="card bg-base-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50 mb-3">Déficit por insumo</p>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={d}>
          <PolarGrid />
          <PolarAngleAxis dataKey="insumo" tick={{ fontSize: 10 }} />
          <Radar dataKey="deficit" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.35} name="Déficit" />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Gráfico ventas ─────────────────────────────────────────────────────────────
function GraficoVentas({ data }: { data: Record<string, unknown>[] }) {
  const d = data.map(r => ({
    fecha: String(r.fecha_pedido ?? '').slice(5, 10),
    total: Number(r.total_pedido ?? 0),
  })).reverse()
  return (
    <div className="card bg-base-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50 mb-3">Total por pedido ($)</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={d} margin={{ left: -10 }}>
          <XAxis dataKey="fecha" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip formatter={(v: unknown) => [`$${Number(v).toLocaleString('es-EC')}`, 'Total']} />
          <Bar dataKey="total" fill={P[0]} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── KPI Cards — Resumen general ───────────────────────────────────────────────
const KPI_ICONS: Record<string, string> = {
  total_insumos: '📦',
  valor_total_inventario: '💰',
  sin_stock: '🚫',
  bajo_stock: '⚠️',
  stock_normal: '✅',
  costo_promedio: '📊',
  total_productos_menu: '🍽️',
  total_clientes: '👥',
  total_pedidos: '🧾',
  ventas_totales: '💵',
}

function KpiCards({ data }: { data: Record<string, unknown> | undefined }) {
  if (!data) return null
  const entries = Object.entries(data)
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {entries.map(([k, v]) => {
        const isMonetary = k.includes('valor') || k.includes('costo') || k.includes('ventas')
        const display = isMonetary ? `$${Number(v).toLocaleString('es-EC')}` : fmt(v)
        const isAlerta = k === 'sin_stock' || k === 'bajo_stock'
        return (
          <div key={k} className={`card border p-4 ${isAlerta && Number(v) > 0 ? 'bg-warning/10 border-warning/30' : 'bg-base-200 border-base-300'}`}>
            <p className="text-xl mb-1">{KPI_ICONS[k] ?? '📌'}</p>
            <p className={`text-xl font-extrabold leading-tight ${isAlerta && Number(v) > 0 ? 'text-warning' : 'text-base-content'}`}>
              {display}
            </p>
            <p className="text-xs text-base-content/45 mt-1 capitalize leading-snug">
              {k.replace(/_/g, ' ')}
            </p>
          </div>
        )
      })}
    </div>
  )
}

// ── IA Insight ────────────────────────────────────────────────────────────────
const SEMAFORO_COLOR = { ROJO: 'text-error', AMARILLO: 'text-warning', VERDE: 'text-success' }
const SEMAFORO_BG    = { ROJO: 'bg-error/10 border-error/30', AMARILLO: 'bg-warning/10 border-warning/30', VERDE: 'bg-success/10 border-success/30' }
const SEMAFORO_EMOJI = { ROJO: '🔴', AMARILLO: '🟡', VERDE: '🟢' }

function IAInsight({ insight, parsed, modelo, tokens }: {
  insight: string
  parsed?: IAInsightData
  modelo?: string
  tokens?: number
}) {
  return (
    <div className="card border border-secondary/20 bg-gradient-to-br from-base-100 to-secondary/5">
      <div className="card-body p-5 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Sparkles size={15} className="text-secondary" />
            </div>
            <div>
              <p className="font-bold text-sm">Análisis de Mistral AI</p>
              {modelo && <p className="text-xs text-base-content/40">{modelo}</p>}
            </div>
          </div>
          {tokens && <span className="badge badge-ghost badge-xs">{tokens} tokens</span>}
        </div>

        {/* Modo estructurado — cuando Mistral respondió JSON válido */}
        {parsed ? (
          <div className="space-y-3">
            {/* Semáforo */}
            {parsed.semaforo && (
              <div className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${SEMAFORO_BG[parsed.semaforo]}`}>
                <span className="text-2xl">{SEMAFORO_EMOJI[parsed.semaforo]}</span>
                <div>
                  <p className={`font-bold text-sm ${SEMAFORO_COLOR[parsed.semaforo]}`}>Estado: {parsed.semaforo}</p>
                  {parsed.resumen_ejecutivo && <p className="text-xs text-base-content/70 mt-0.5">{parsed.resumen_ejecutivo}</p>}
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              {/* Riesgos */}
              {parsed.riesgos && parsed.riesgos.length > 0 && (
                <div className="rounded-xl bg-base-200 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-error mb-2">⚠ Riesgos</p>
                  <ul className="space-y-1">
                    {parsed.riesgos.map((r, i) => (
                      <li key={i} className="text-xs text-base-content/70 pl-2 border-l-2 border-error/40">{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Acciones */}
              {parsed.acciones_inmediatas && parsed.acciones_inmediatas.length > 0 && (
                <div className="rounded-xl bg-base-200 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary mb-2">✅ Acciones inmediatas</p>
                  <ul className="space-y-1">
                    {parsed.acciones_inmediatas.map((a, i) => (
                      <li key={i} className="text-xs text-base-content/70 pl-2 border-l-2 border-primary/40">{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Oportunidad */}
            {parsed.oportunidad && (
              <div className="rounded-xl bg-success/5 border border-success/20 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-success mb-1">💡 Oportunidad</p>
                <p className="text-xs text-base-content/70">{parsed.oportunidad}</p>
              </div>
            )}

            {/* Predicción */}
            {parsed.prediccion && (
              <div className="rounded-xl bg-info/5 border border-info/20 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-info mb-1">📅 Proyección 7 días</p>
                <p className="text-xs text-base-content/70">{parsed.prediccion}</p>
              </div>
            )}
          </div>
        ) : (
          /* Modo texto plano — fallback si Mistral no respondió JSON */
          <div className="space-y-2">
            {insight.split('\n').filter(Boolean).map((linea, i) => {
              const esPunto = /^[•\-*]|\d+\./.test(linea.trim())
              return (
                <p key={i} className={`text-sm leading-relaxed ${esPunto ? 'pl-3 border-l-2 border-secondary/30 text-base-content/80' : 'text-base-content/70'}`}>
                  {linea}
                </p>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Gráfico predicción ────────────────────────────────────────────────────────
function GraficoPrediccion({ data }: { data: Record<string, unknown>[] }) {
  const URGENTE = '#ef4444'
  const PRONTO  = '#f59e0b'
  const OK      = '#52b788'

  const d = data.map(r => ({
    name:   String(r.nombre_insumo ?? '').split(' ').slice(0, 2).join(' '),
    dias:   Number(r.dias_hasta_agotarse ?? 0),
    consumo: Number(r.consumo_diario_estimado ?? 0),
    estado: String(r.estado_proyeccion ?? 'OK'),
  }))

  const getColor = (estado: string) =>
    estado === 'URGENTE' ? URGENTE : estado === 'PRONTO' ? PRONTO : OK

  return (
    <div className="space-y-4">
      {/* Barras de días */}
      <div className="card bg-base-200 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50 mb-3">
          Días estimados hasta agotarse
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={d} margin={{ left: -10 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} label={{ value: 'días', angle: -90, position: 'insideLeft', fontSize: 9 }} />
            <Tooltip formatter={(v: unknown) => [`${v} días`, 'Tiempo restante']} />
            <Bar dataKey="dias" radius={[6, 6, 0, 0]} name="Días restantes">
              {d.map((row, i) => <Cell key={i} fill={getColor(row.estado)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 text-xs text-base-content/50 justify-center">
          <span><span style={{ color: URGENTE }}>■</span> Urgente (&lt;7 días)</span>
          <span><span style={{ color: PRONTO }}>■</span> Pronto (&lt;14 días)</span>
          <span><span style={{ color: OK }}>■</span> OK</span>
        </div>
      </div>

      {/* Cards de urgentes */}
      {d.filter(r => r.estado === 'URGENTE').length > 0 && (
        <div className="rounded-xl border border-error/30 bg-error/5 p-4">
          <p className="text-xs font-bold text-error uppercase tracking-wide mb-2">
            ⚠ Requieren reposición inmediata
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {d.filter(r => r.estado === 'URGENTE').map((r, i) => (
              <div key={i} className="bg-white rounded-lg px-3 py-2 border border-error/20 flex justify-between items-center">
                <span className="text-sm font-medium">{r.name}</span>
                <span className="badge badge-error badge-sm">{r.dias}d</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Gráfico rentabilidad ──────────────────────────────────────────────────────
function GraficoRentabilidad({ data }: { data: Record<string, unknown>[] }) {
  const d = data.map(r => ({
    name:    String(r.nombre_producto ?? '').split(' ').slice(0, 3).join(' '),
    precio:  Number(r.precio_venta ?? 0),
    costo:   Number(r.costo_produccion ?? 0),
    margen:  Number(r.margen_bruto ?? 0),
    pct:     Number(r.margen_pct ?? 0),
  }))

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Barras apiladas precio vs costo */}
        <div className="card bg-base-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50 mb-3">
            Precio de venta vs Costo de producción
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={d} margin={{ left: -10 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: unknown) => `$${Number(v).toFixed(2)}`} />
              <Bar dataKey="costo"  stackId="a" fill="#ef4444" name="Costo" radius={[0,0,4,4]} />
              <Bar dataKey="margen" stackId="a" fill="#52b788" name="Margen" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-xs text-base-content/50 justify-center">
            <span><span style={{ color: '#ef4444' }}>■</span> Costo</span>
            <span><span style={{ color: '#52b788' }}>■</span> Margen</span>
          </div>
        </div>

        {/* % de margen */}
        <div className="card bg-base-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50 mb-3">
            % de margen bruto por producto
          </p>
          <div className="space-y-2.5 mt-1">
            {[...d].sort((a, b) => b.pct - a.pct).map((r, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium truncate">{r.name}</span>
                  <span className={`font-bold ${r.pct >= 50 ? 'text-success' : r.pct >= 30 ? 'text-warning' : 'text-error'}`}>
                    {r.pct.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${r.pct >= 50 ? 'bg-success' : r.pct >= 30 ? 'bg-warning' : 'bg-error'}`}
                    style={{ width: `${Math.min(r.pct, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Producto más rentable */}
      {d.length > 0 && (() => {
        const top = [...d].sort((a, b) => b.pct - a.pct)[0]
        return (
          <div className="rounded-xl border border-success/30 bg-success/5 p-4 flex items-center gap-4">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="text-xs text-base-content/50 uppercase tracking-wide">Producto más rentable</p>
              <p className="font-bold text-base">{top.name}</p>
              <p className="text-sm text-base-content/60">
                ${top.precio.toFixed(2)} precio · ${top.costo.toFixed(2)} costo · <span className="text-success font-semibold">{top.pct.toFixed(1)}% margen</span>
              </p>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
