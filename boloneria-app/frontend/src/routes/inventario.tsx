import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { inventarioApi, type MateriaPrima } from '../lib/api'
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/inventario')({ component: Inventario })

const CATEGORIAS = ['Vegetales', 'Lácteos', 'Carnes', 'Granos', 'Condimentos', 'Bebidas', 'Otros']
const UNIDADES = ['kg', 'g', 'L', 'mL', 'unidad', 'docena', 'libra']
const empty = { nombre_insumo: '', categoria: '', proveedor: '', unidad_medida: '', costo_unitario: 0, stock_actual: 0, punto_reorden: 0 }

function StockBadge({ item }: { item: MateriaPrima }) {
  if (item.stock_actual === 0) return <span className="badge badge-error badge-sm text-white">Sin stock</span>
  if (item.stock_actual <= item.punto_reorden) return <span className="badge badge-warning badge-sm text-white">Bajo stock</span>
  return <span className="badge badge-success badge-sm text-white">Normal</span>
}

export default function Inventario() {
  const [items, setItems] = useState<MateriaPrima[]>([])
  const [filtered, setFiltered] = useState<MateriaPrima[]>([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState<number | null>(null)
  const [stockId, setStockId] = useState<number | null>(null)
  const [nuevoStock, setNuevoStock] = useState(0)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const modalRef = useRef<HTMLDialogElement>(null)
  const stockRef = useRef<HTMLDialogElement>(null)

  const load = async () => {
    try { setItems(await inventarioApi.listar()) }
    catch { show('Error al cargar datos', false) }
  }
  useEffect(() => { load() }, [])
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(items.filter(i =>
      i.nombre_insumo.toLowerCase().includes(q) ||
      i.categoria.toLowerCase().includes(q) ||
      i.proveedor.toLowerCase().includes(q)
    ))
  }, [items, search])

  const show = (msg: string, ok: boolean) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }

  const openModal = (item?: MateriaPrima) => {
    if (item) { setEditId(item.id); setForm({ nombre_insumo: item.nombre_insumo, categoria: item.categoria, proveedor: item.proveedor, unidad_medida: item.unidad_medida, costo_unitario: item.costo_unitario, stock_actual: item.stock_actual, punto_reorden: item.punto_reorden }) }
    else { setEditId(null); setForm(empty) }
    modalRef.current?.showModal()
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await inventarioApi.crear(form)
      if (editId) await inventarioApi.eliminar(editId)
      show(editId ? 'Insumo actualizado' : 'Insumo creado', true)
      modalRef.current?.close(); load()
    } catch (e: any) { show(e.message, false) }
  }

  const del = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return
    try { await inventarioApi.eliminar(id); show('Insumo eliminado', true); load() }
    catch (e: any) { show(e.message, false) }
  }

  const openStock = (item: MateriaPrima) => { setStockId(item.id); setNuevoStock(item.stock_actual); stockRef.current?.showModal() }
  const saveStock = async () => {
    if (stockId == null) return
    try { await inventarioApi.actualizarStock(stockId, nuevoStock); show('Stock actualizado', true); stockRef.current?.close(); load() }
    catch (e: any) { show(e.message, false) }
  }

  const f = (k: keyof typeof form, v: string | number) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">Inventario de Materia Prima</h1>
          <p className="text-sm text-base-content/50">Gestión de insumos y stock</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input className="input input-bordered input-sm w-44" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn btn-ghost btn-sm" onClick={load}><RefreshCw size={14} /></button>
          <button className="btn btn-primary btn-sm" onClick={() => openModal()}><Plus size={14} /> Nuevo</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
        <table className="table table-sm">
          <thead className="bg-base-200">
            <tr><th>ID</th><th>Insumo</th><th>Categoría</th><th>Proveedor</th><th>Unidad</th><th>Costo</th><th>Stock</th><th>Reorden</th><th>Estado</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={10} className="text-center py-12 text-base-content/30">No hay insumos registrados</td></tr>
            )}
            {filtered.map(i => (
              <tr key={i.id} className="hover">
                <td className="text-base-content/30 text-xs">#{i.id}</td>
                <td className="font-semibold">{i.nombre_insumo}</td>
                <td><span className="badge badge-ghost badge-sm">{i.categoria}</span></td>
                <td className="text-sm">{i.proveedor}</td>
                <td className="text-sm">{i.unidad_medida}</td>
                <td className="text-sm">${i.costo_unitario.toFixed(2)}</td>
                <td className="font-bold text-base-content">{i.stock_actual}</td>
                <td className="text-base-content/50 text-sm">{i.punto_reorden}</td>
                <td><StockBadge item={i} /></td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn btn-ghost btn-xs text-warning font-bold" title="Ajustar stock" onClick={() => openStock(i)}>±</button>
                    <button className="btn btn-ghost btn-xs" onClick={() => openModal(i)}><Pencil size={12} /></button>
                    <button className="btn btn-ghost btn-xs text-error" onClick={() => del(i.id, i.nombre_insumo)}><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal principal */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box max-w-lg">
          <h3 className="font-bold text-lg mb-5">{editId ? 'Editar Insumo' : 'Nuevo Insumo'}</h3>
          <form onSubmit={save} className="grid grid-cols-2 gap-3">
            <label className="col-span-2 form-control">
              <div className="label pb-1"><span className="label-text text-xs font-semibold uppercase tracking-wide">Nombre *</span></div>
              <input className="input input-bordered input-sm" required value={form.nombre_insumo} onChange={e => f('nombre_insumo', e.target.value)} placeholder="Ej: Verde bandeja" />
            </label>
            <label className="form-control">
              <div className="label pb-1"><span className="label-text text-xs font-semibold uppercase tracking-wide">Categoría *</span></div>
              <select className="select select-bordered select-sm" required value={form.categoria} onChange={e => f('categoria', e.target.value)}>
                <option value="">Seleccionar...</option>
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="form-control">
              <div className="label pb-1"><span className="label-text text-xs font-semibold uppercase tracking-wide">Proveedor *</span></div>
              <input className="input input-bordered input-sm" required value={form.proveedor} onChange={e => f('proveedor', e.target.value)} />
            </label>
            <label className="form-control">
              <div className="label pb-1"><span className="label-text text-xs font-semibold uppercase tracking-wide">Unidad *</span></div>
              <select className="select select-bordered select-sm" required value={form.unidad_medida} onChange={e => f('unidad_medida', e.target.value)}>
                <option value="">Seleccionar...</option>
                {UNIDADES.map(u => <option key={u}>{u}</option>)}
              </select>
            </label>
            <label className="form-control">
              <div className="label pb-1"><span className="label-text text-xs font-semibold uppercase tracking-wide">Costo Unit. *</span></div>
              <input className="input input-bordered input-sm" type="number" min={0} step="0.01" required value={form.costo_unitario} onChange={e => f('costo_unitario', +e.target.value)} />
            </label>
            <label className="form-control">
              <div className="label pb-1"><span className="label-text text-xs font-semibold uppercase tracking-wide">Stock Inicial *</span></div>
              <input className="input input-bordered input-sm" type="number" min={0} step="0.01" required value={form.stock_actual} onChange={e => f('stock_actual', +e.target.value)} />
            </label>
            <label className="form-control">
              <div className="label pb-1"><span className="label-text text-xs font-semibold uppercase tracking-wide">Punto Reorden *</span></div>
              <input className="input input-bordered input-sm" type="number" min={0} step="0.01" required value={form.punto_reorden} onChange={e => f('punto_reorden', +e.target.value)} />
            </label>
            <div className="col-span-2 modal-action mt-2">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => modalRef.current?.close()}>Cancelar</button>
              <button type="submit" className="btn btn-primary btn-sm">{editId ? 'Actualizar' : 'Guardar'}</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button /></form>
      </dialog>

      {/* Modal stock */}
      <dialog ref={stockRef} className="modal">
        <div className="modal-box max-w-xs">
          <h3 className="font-bold text-lg mb-4">Ajustar Stock</h3>
          <label className="form-control">
            <div className="label pb-1"><span className="label-text text-xs font-semibold uppercase">Nuevo valor de stock</span></div>
            <input className="input input-bordered" type="number" min={0} step="0.01" value={nuevoStock} onChange={e => setNuevoStock(+e.target.value)} />
          </label>
          <div className="modal-action">
            <button className="btn btn-ghost btn-sm" onClick={() => stockRef.current?.close()}>Cancelar</button>
            <button className="btn btn-warning btn-sm" onClick={saveStock}>Actualizar</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button /></form>
      </dialog>

      {toast && (
        <div className="toast toast-end z-50">
          <div className={`alert ${toast.ok ? 'alert-success' : 'alert-error'} text-sm py-2 px-4 shadow-lg`}>
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  )
}
