import { Link } from '@tanstack/react-router'
import { Package, UtensilsCrossed, Users, ShoppingCart, LayoutDashboard, BarChart2 } from 'lucide-react'

const LOGO = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMcN0bgP8ZJvzt_c52U-iFlfgyIoCwYUDwnw&s'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inventario', label: 'Inventario', icon: Package },
  { to: '/menu', label: 'Menú', icon: UtensilsCrossed },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { to: '/reportes', label: 'Reportes', icon: BarChart2 },
]

export function Sidebar() {
  return (
    <div className="drawer-side z-40">
      <label htmlFor="drawer" aria-label="close sidebar" className="drawer-overlay" />
      <aside className="bg-base-200 min-h-screen w-64 flex flex-col border-r border-base-300">

        <div className="px-5 py-4 flex items-center gap-3 border-b border-base-300">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden shrink-0">
            <img src={LOGO} alt="Logo" className="w-10 h-10 object-cover" />
          </div>
          <div>
            <p className="font-bold text-base-content leading-tight">Bolonería</p>
            <p className="text-xs text-base-content/50">Inventario · Gestión</p>
          </div>
        </div>

        <ul className="menu flex-1 px-3 py-4 gap-0.5">
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                activeProps={{ className: 'active font-semibold' }}
                activeOptions={{ exact: to === '/' }}
                className="flex items-center gap-3 rounded-lg py-2.5"
              >
                <Icon size={17} />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="px-5 py-4 border-t border-base-300">
          <p className="text-xs text-base-content/40">Sistemas Distribuidos · UEES 2026</p>
        </div>
      </aside>
    </div>
  )
}
