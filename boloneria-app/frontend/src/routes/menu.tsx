import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { menuApi, type ProductoMenu } from '../lib/api'
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/menu')({ component: Menu })

const CATS = ['Bolones', 'Bebidas', 'Extras', 'Postres', 'Combos']
const empty = { nombre_producto: '', categoria_menu: '', precio_venta: 0 }

const CAT_COLORS: Record<string, string> = {
  Bolones: 'badge-primary',
  Bebidas: 'badge-info',
  Extras: 'badge-accent',
  Postres: 'badge-secondary',
  Combos: 'badge-warning',
}

export default function Menu() {
  const [items, setItems] = useState<ProductoMenu[]>([])
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState<number | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const modalRef = useRef<HTMLDialogElement>(null)

  const load = async () => { try { setItems(await menuApi.listar()) } catch {} }
  useEffect(() => { load() }, [])

  const show = (msg: string, ok: boolean) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }

  const openModal = (item?: ProductoMenu) => {
    item ? (setEditId(item.id), setForm({ nombre_producto: item.nombre_producto, categoria_menu: item.categoria_menu, precio_venta: item.precio_venta }))
         : (setEditId(null), setForm(empty))
    modalRef.current?.showModal()
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      editId ? await menuApi.actualizar(editId, form) : await menuApi.crear(form)
      show(editId ? 'Producto actualizado' : 'Producto creado', true)
      modalRef.current?.close(); load()
    } catch (e: any) { show(e.message, false) }
  }

  const del = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return
    try { await menuApi.eliminar(id); show('Eliminado', true); load() }
    catch (e: any) { show(e.message, false) }
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">Menú</h1>
          <p className="text-sm text-base-content/50">Productos que ofrece la bolonería</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm" onClick={load}><RefreshCw size={14} /></button>
          <button className="btn btn-primary btn-sm" onClick={() => openModal()}><Plus size={14} /> Nuevo</button>
        </div>
      </div>

      {items.length === 0
        ? <div className="text-center py-20 text-base-content/30">Sin productos en el menú — agrega el primero</div>
        : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map(i => (
              <div key={i.id} className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="card-body p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">{i.nombre_producto}</h3>
                      <span className={`badge badge-sm mt-1 ${CAT_COLORS[i.categoria_menu] ?? 'badge-ghost'}`}>{i.categoria_menu}</span>
                    </div>
                    <span className="text-2xl font-extrabold text-primary shrink-0">${i.precio_venta.toFixed(2)}</span>
                  </div>
                  <div className="card-actions justify-end mt-3 pt-3 border-t border-base-200">
                    <button className="btn btn-ghost btn-xs gap-1" onClick={() => openModal(i)}><Pencil size={12} /> Editar</button>
                    <button className="btn btn-ghost btn-xs text-error gap-1" onClick={() => del(i.id, i.nombre_producto)}><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
      }

      <dialog ref={modalRef} className="modal">
        <div className="modal-box max-w-sm">
          <h3 className="font-bold text-lg mb-5">{editId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <form onSubmit={save} className="space-y-3">
            <label className="form-control">
              <div className="label pb-1"><span className="label-text text-xs font-semibold uppercase">Nombre *</span></div>
              <input className="input input-bordered input-sm" required value={form.nombre_producto} onChange={e => setForm(p => ({ ...p, nombre_producto: e.target.value }))} placeholder="Ej: Bolón de verde con queso" />
            </label>
            <label className="form-control">
              <div className="label pb-1"><span className="label-text text-xs font-semibold uppercase">Categoría *</span></div>
              <select className="select select-bordered select-sm" required value={form.categoria_menu} onChange={e => setForm(p => ({ ...p, categoria_menu: e.target.value }))}>
                <option value="">Seleccionar...</option>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="form-control">
              <div className="label pb-1"><span className="label-text text-xs font-semibold uppercase">Precio de Venta ($) *</span></div>
              <input className="input input-bordered input-sm" type="number" min={0} step="0.01" required value={form.precio_venta} onChange={e => setForm(p => ({ ...p, precio_venta: +e.target.value }))} />
            </label>
            <div className="modal-action mt-4">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => modalRef.current?.close()}>Cancelar</button>
              <button type="submit" className="btn btn-primary btn-sm">{editId ? 'Actualizar' : 'Guardar'}</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button /></form>
      </dialog>

      {toast && <div className="toast toast-end z-50"><div className={`alert ${toast.ok ? 'alert-success' : 'alert-error'} text-sm py-2 px-4`}>{toast.msg}</div></div>}
    </div>
  )
}
