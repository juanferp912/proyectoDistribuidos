import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { pedidosApi, menuApi, clientesApi, type Pedido, type ProductoMenu, type Cliente, type NuevoPedidoDetalle } from '../lib/api'
import { Plus, Trash2, RefreshCw, Eye } from 'lucide-react'

export const Route = createFileRoute('/pedidos')({ component: Pedidos })

const ESTADOS = ['COMPLETADO', 'PENDIENTE', 'CANCELADO']

function EstadoBadge({ e }: { e: string }) {
  if (e === 'COMPLETADO') return <span className="badge badge-success badge-sm text-white">{e}</span>
  if (e === 'PENDIENTE') return <span className="badge badge-warning badge-sm text-white">{e}</span>
  return <span className="badge badge-error badge-sm text-white">{e}</span>
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [menuItems, setMenuItems] = useState<ProductoMenu[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [detalle, setDetalle] = useState<Pedido | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [clienteId, setClienteId] = useState<number | ''>('')
  const [lineas, setLineas] = useState<{ producto_id: number; cantidad: number; precio_unitario: number }[]>([])
  const [estadoNuevo, setEstadoNuevo] = useState('COMPLETADO')
  const modalRef = useRef<HTMLDialogElement>(null)
  const detalleRef = useRef<HTMLDialogElement>(null)

  const load = async () => {
    try {
      const [p, m, c] = await Promise.all([pedidosApi.listar(), menuApi.listar(), clientesApi.listar()])
      setPedidos(p); setMenuItems(m); setClientes(c)
    } catch {}
  }
  useEffect(() => { load() }, [])

  const show = (msg: string, ok: boolean) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }

  const addLinea = () => {
    if (!menuItems.length) return
    const prod = menuItems[0]
    setLineas(l => [...l, { producto_id: prod.id, cantidad: 1, precio_unitario: prod.precio_venta }])
  }

  const updateLinea = (idx: number, key: string, val: string | number) => {
    setLineas(l => l.map((x, i) => {
      if (i !== idx) return x
      if (key === 'producto_id') {
        const prod = menuItems.find(m => m.id === +val)
        return { ...x, producto_id: +val, precio_unitario: prod?.precio_venta ?? 0 }
      }
      return { ...x, [key]: +val }
    }))
  }

  const total = lineas.reduce((s, l) => s + l.cantidad * l.precio_unitario, 0)

  const crearPedido = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lineas.length) { show('Agrega al menos un producto', false); return }
    try {
      const detalles: NuevoPedidoDetalle[] = lineas.map(l => ({ producto_id: l.producto_id, cantidad: l.cantidad, precio_unitario: l.precio_unitario }))
      await pedidosApi.crear({ cliente_id: clienteId !== '' ? +clienteId : null, estado: estadoNuevo, detalles })
      show('Pedido registrado', true)
      modalRef.current?.close()
      setLineas([]); setClienteId(''); setEstadoNuevo('COMPLETADO')
      load()
    } catch (e: any) { show(e.message, false) }
  }

  const verDetalle = async (id: number) => {
    try { setDetalle(await pedidosApi.buscarPorID(id)); detalleRef.current?.showModal() }
    catch (e: any) { show(e.message, false) }
  }

  const del = async (id: number) => {
    if (!confirm('¿Eliminar este pedido?')) return
    try { await pedidosApi.eliminar(id); show('Eliminado', true); load() }
    catch (e: any) { show(e.message, false) }
  }

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">Pedidos</h1>
          <p className="text-sm text-base-content/50">Historial de ventas</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm" onClick={load}><RefreshCw size={14} /></button>
          <button className="btn btn-primary btn-sm" onClick={() => { setLineas([]); setClienteId(''); modalRef.current?.showModal() }}><Plus size={14} /> Nuevo Pedido</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
        <table className="table table-sm">
          <thead className="bg-base-200">
            <tr><th>ID</th><th>Fecha</th><th>Cliente</th><th>Estado</th><th>Total</th><th></th></tr>
          </thead>
          <tbody>
            {pedidos.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-base-content/30">No hay pedidos registrados</td></tr>}
            {pedidos.map(p => (
              <tr key={p.id} className="hover">
                <td className="text-base-content/30 text-xs">#{p.id}</td>
                <td className="text-sm">{new Date(p.fecha_pedido).toLocaleString('es-EC')}</td>
                <td className="text-sm">{p.edges?.cliente?.nombre_completo ?? <span className="text-base-content/30">Consumidor final</span>}</td>
                <td><EstadoBadge e={p.estado} /></td>
                <td className="font-bold text-primary">${p.total_pedido.toFixed(2)}</td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn btn-ghost btn-xs" onClick={() => verDetalle(p.id)}><Eye size={12} /></button>
                    <button className="btn btn-ghost btn-xs text-error" onClick={() => del(p.id)}><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal nuevo pedido */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-5">Nuevo Pedido</h3>
          <form onSubmit={crearPedido} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="form-control">
                <div className="label pb-1"><span className="label-text text-xs font-semibold uppercase">Cliente</span></div>
                <select className="select select-bordered select-sm" value={clienteId} onChange={e => setClienteId(e.target.value === '' ? '' : +e.target.value)}>
                  <option value="">Consumidor final</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre_completo}</option>)}
                </select>
              </label>
              <label className="form-control">
                <div className="label pb-1"><span className="label-text text-xs font-semibold uppercase">Estado</span></div>
                <select className="select select-bordered select-sm" value={estadoNuevo} onChange={e => setEstadoNuevo(e.target.value)}>
                  {ESTADOS.map(s => <option key={s}>{s}</option>)}
                </select>
              </label>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold uppercase text-base-content/50 tracking-wide">Productos del pedido</span>
                <button type="button" className="btn btn-ghost btn-xs gap-1" onClick={addLinea}><Plus size={12} /> Agregar línea</button>
              </div>
              {lineas.length === 0
                ? <div className="border-2 border-dashed border-base-300 rounded-lg text-center py-8 text-sm text-base-content/30">Sin productos — usa "Agregar línea"</div>
                : <div className="space-y-2">
                    {lineas.map((l, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-base-200 rounded-lg p-2">
                        <select className="select select-bordered select-sm flex-1 min-w-0" value={l.producto_id} onChange={e => updateLinea(idx, 'producto_id', e.target.value)}>
                          {menuItems.map(m => <option key={m.id} value={m.id}>{m.nombre_producto}</option>)}
                        </select>
                        <input className="input input-bordered input-sm w-20 text-center" type="number" min={1} value={l.cantidad} onChange={e => updateLinea(idx, 'cantidad', e.target.value)} />
                        <input className="input input-bordered input-sm w-24" type="number" min={0} step="0.01" value={l.precio_unitario} onChange={e => updateLinea(idx, 'precio_unitario', e.target.value)} />
                        <span className="text-sm font-bold w-20 text-right text-primary">${(l.cantidad * l.precio_unitario).toFixed(2)}</span>
                        <button type="button" className="btn btn-ghost btn-xs text-error" onClick={() => setLineas(ls => ls.filter((_, i) => i !== idx))}><Trash2 size={12} /></button>
                      </div>
                    ))}
                    <div className="flex justify-end pt-2 border-t border-base-300">
                      <span className="font-bold text-lg text-primary">Total: ${total.toFixed(2)}</span>
                    </div>
                  </div>
              }
            </div>

            <div className="modal-action">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => modalRef.current?.close()}>Cancelar</button>
              <button type="submit" className="btn btn-primary btn-sm">Registrar Pedido</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button /></form>
      </dialog>

      {/* Modal detalle */}
      <dialog ref={detalleRef} className="modal">
        <div className="modal-box max-w-lg">
          {detalle && (
            <>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">Pedido #{detalle.id}</h3>
                  <p className="text-xs text-base-content/50">{new Date(detalle.fecha_pedido).toLocaleString('es-EC')}</p>
                </div>
                <EstadoBadge e={detalle.estado} />
              </div>
              <div className="bg-base-200 rounded-lg p-3 text-sm mb-4">
                <span className="text-base-content/50">Cliente: </span>
                <span className="font-medium">{detalle.edges?.cliente?.nombre_completo ?? 'Consumidor final'}</span>
              </div>
              <table className="table table-sm w-full">
                <thead><tr><th>Producto</th><th className="text-center">Cant.</th><th className="text-right">P. Unit.</th><th className="text-right">Subtotal</th></tr></thead>
                <tbody>
                  {detalle.edges?.detalles?.map(d => (
                    <tr key={d.id}>
                      <td className="font-medium">{d.edges?.producto?.nombre_producto ?? `#${d.id}`}</td>
                      <td className="text-center">{d.cantidad}</td>
                      <td className="text-right">${d.precio_unitario.toFixed(2)}</td>
                      <td className="text-right font-semibold">${d.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr><td colSpan={3} className="text-right font-bold text-base-content/60">TOTAL</td><td className="text-right font-extrabold text-primary text-base">${detalle.total_pedido.toFixed(2)}</td></tr>
                </tfoot>
              </table>
            </>
          )}
          <div className="modal-action"><form method="dialog"><button className="btn btn-ghost btn-sm">Cerrar</button></form></div>
        </div>
        <form method="dialog" className="modal-backdrop"><button /></form>
      </dialog>

      {toast && <div className="toast toast-end z-50"><div className={`alert ${toast.ok ? 'alert-success' : 'alert-error'} text-sm py-2 px-4`}>{toast.msg}</div></div>}
    </div>
  )
}
