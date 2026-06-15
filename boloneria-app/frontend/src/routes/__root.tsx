import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Sidebar } from '../components/Sidebar'
import { Menu } from 'lucide-react'

export const Route = createRootRoute({
  component: () => (
    <div className="drawer lg:drawer-open min-h-screen bg-base-100">
      <input id="drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen">
        {/* Mobile navbar */}
        <div className="navbar bg-base-100 border-b border-base-300 lg:hidden px-4 sticky top-0 z-30">
          <label htmlFor="drawer" className="btn btn-ghost btn-sm">
            <Menu size={20} />
          </label>
          <span className="ml-2 font-bold text-primary text-lg">🫓 Bolonería</span>
        </div>

        <main className="flex-1 p-5 md:p-7">
          <Outlet />
        </main>
      </div>

      <Sidebar />
    </div>
  ),
})
