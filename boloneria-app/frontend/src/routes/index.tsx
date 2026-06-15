import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { inventarioApi, menuApi, clientesApi, pedidosApi, type MateriaPrima } from '../lib/api'
import { Package, UtensilsCrossed, Users, ShoppingCart, AlertTriangle, TrendingUp } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

const BANNER = 'https://i.ytimg.com/vi/9keH9Iv1AiA/maxresdefault.jpg'

function Dashboard() {
  const [stats, setStats] = useState({ insumos: 0, menu: 0, clientes: 0, pedidos: 0, bajoStock: 0, valor: 0 })
  const [alertas, setAlertas] = useState<MateriaPrima[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([inventarioApi.listar(), menuApi.listar(), clientesApi.listar(), pedidosApi.listar()])
      .then(([invR, menR, cliR, pedR]) => {
        const inv = invR.status === 'fulfilled' ? invR.value : []
        const men = menR.status === 'fulfilled' ? menR.value : []
        const cli = cliR.status === 'fulfilled' ? cliR.value : []
        const ped = pedR.status === 'fulfilled' ? pedR.value : []
        const bajo = inv.filter(i => i.stock_actual > 0 && i.stock_actual <= i.punto_reorden)
        const valor = inv.reduce((s, i) => s + i.costo_unitario * i.stock_actual, 0)
        setStats({ insumos: inv.length, menu: men.length, clientes: cli.length, pedidos: ped.length, bajoStock: bajo.length, valor })
        setAlertas(bajo.slice(0, 6))
      })
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Insumos', value: stats.insumos, icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Productos Menú', value: stats.menu, icon: UtensilsCrossed, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Clientes', value: stats.clientes, icon: Users, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Pedidos', value: stats.pedidos, icon: ShoppingCart, color: 'text-success', bg: 'bg-success/10' },
  ]

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Banner */}
      <div className="rounded-2xl overflow-hidden shadow-md relative h-44 md:h-56">
        <img src={BANNER} alt="Bolonería ecuatoriana" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-end p-6">
          <div>
            <h1 className="text-white text-2xl md:text-3xl font-bold drop-shadow">Sistema de Inventario</h1>
            <p className="text-white/80 text-sm mt-1">Bolonería Ecuatoriana · Gestión integral de tu negocio</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-4">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-2`}>
                <Icon size={18} className={color} />
              </div>
              <p className="text-2xl font-bold">{loading ? '—' : value}</p>
              <p className="text-xs text-base-content/50 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom panels */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-primary" />
              <h2 className="font-semibold">Valor del Inventario</h2>
            </div>
            <p className="text-4xl font-bold text-primary mt-2">
              ${loading ? '—' : stats.valor.toFixed(2)}
            </p>
            <p className="text-xs text-base-content/40 mt-1">Suma de costo × stock de todos los insumos</p>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-warning" />
              <h2 className="font-semibold">
                Alertas de Bajo Stock
                {stats.bajoStock > 0 && (
                  <span className="badge badge-warning badge-sm ml-2">{stats.bajoStock}</span>
                )}
              </h2>
            </div>
            {loading ? (
              <div className="skeleton h-20 w-full rounded-lg" />
            ) : alertas.length === 0 ? (
              <div className="flex items-center gap-2 text-success text-sm">
                <span>✓</span> Todo el inventario está en niveles normales
              </div>
            ) : (
              <ul className="space-y-2">
                {alertas.map(a => (
                  <li key={a.id} className="flex justify-between items-center text-sm">
                    <span className="font-medium truncate mr-2">{a.nombre_insumo}</span>
                    <span className={`badge badge-sm shrink-0 ${a.stock_actual === 0 ? 'badge-error' : 'badge-warning'}`}>
                      {a.stock_actual} {a.unidad_medida}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
