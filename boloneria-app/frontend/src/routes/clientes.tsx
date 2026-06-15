import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { clientesApi, type Cliente } from '../lib/api'
import { Plus, Pencil, Trash2, RefreshCw, Search } from 'lucide-react'

export const Route = createFileRoute('/clientes')({ component: Clientes })

const empty = { nombre_completo: '', telefono: null as string | null, email: null as string | null, direccion: null as string | null }

export default function Clientes() {
  const [items, setItems] = useState<Cliente[]>([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState<number | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const modalRef = useRef<HTMLDialogElement>(null)

  const load = async () => { try { setItems(await clientesApi.listar()) } catch {} }
  useEffect(() => { load() }, [])

  const show = (msg: string, ok: boolean) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }

  const openModal = (item?: Cliente) => {
    item ? (setEditId(item.id), setForm({ nombre_completo: item.nombre_completo, telefono: item.telefono ?? null, email: item.email ?? null, direccion: item.direccion ?? null }))
         : (setEditId(null), setForm(empty))
    modalRef.current?.showModal()
  }

  const ne = (v: string | null) => (v?.trim() ? v.trim() : null)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { nombre_completo: form.nombre_completo, telefono: ne(form.telefono), email: ne(form.email), direccion: ne(form.direccion) }
    try {
      editId ? await clientesApi.actualizar(editId, payload) : await clientesApi.crear(payload)
      show(editId ? 'Cliente actualizado' : 'Cliente creado', true)
      modalRef.current?.close(); load()
    } catch (e: any) { show(e.message, false) }
  }

  const del = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar a "${nombre}"?`)) return
    try { await clientesApi.eliminar(id); show('Eliminado', true); load() }
    catch (e: any) { show(e.message, false) }
  }

  const filtered = items.filter(i =>
    i.nombre_completo.toLowerCase().includes(search.toLowerCase()) ||
    (i.email ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const sf = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v || null }))

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">Clientes</h1>
          <p className="text-sm text-base-content/50">Base de datos de clientes</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <label className="input input-bordered input-sm flex items-center gap-2 w-44">
            <Search size={13} className="text-base-content/40" />
            <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="grow min-w-0" />
          </label>
          <button className="btn btn-ghost btn-sm" onClick={load}><RefreshCw size={14} /></button>
          <button className="btn btn-primary btn-sm" onClick={() => openModal()}><Plus size={14} /> Nuevo</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
        <table className="table table-sm">
          <thead className="bg-base-200">
            <tr><th>ID</th><th>Nombre</th><th>Teléfono</th><th>Email</th><th>Dirección</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-base-content/30">No hay clientes registrados</td></tr>}
            {filtered.map(i => (
              <tr key={i.id} className="hover">
                <td className="text-base-content/30 text-xs">#{i.id}</td>
                <td className="font-semibold">{i.nombre_completo}</td>
                <td className="text-sm">{i.telefono ?? <span className="text-base-content/25">—</span>}</td>
                <td className="text-sm">{i.email ?? <span className="text-base-content/25">—</span>}</td>
                <td className="text-sm max-w-xs truncate">{i.direccion ?? <span className="text-base-content/25">—</span>}</td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn btn-ghost btn-xs" onClick={() => openModal(i)}><Pencil size={12} /></button>
                    <button className="btn btn-ghost btn-xs text-error" onClick={() => del(i.id, i.nombre_completo)}><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box max-w-md">
          <h3 className="font-bold text-lg mb-5">{editId ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
          <form onSubmit={save} className="space-y-3">
            <label className="form-control">
              <div className="label pb-1"><span className="label-text text-xs font-semibold uppercase">Nombre Completo *</span></div>
              <input className="input input-bordered input-sm" required value={form.nombre_completo} onChange={e => setForm(p => ({ ...p, nombre_completo: e.target.value }))} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="form-control">
                <div className="label pb-1"><span className="label-text text-xs font-semibold uppercase">Teléfono</span></div>
                <input className="input input-bordered input-sm" value={form.telefono ?? ''} onChange={e => sf('telefono', e.target.value)} />
              </label>
              <label className="form-control">
                <div className="label pb-1"><span className="label-text text-xs font-semibold uppercase">Email</span></div>
                <input className="input input-bordered input-sm" type="email" value={form.email ?? ''} onChange={e => sf('email', e.target.value)} />
              </label>
            </div>
            <label className="form-control">
              <div className="label pb-1"><span className="label-text text-xs font-semibold uppercase">Dirección</span></div>
              <textarea className="textarea textarea-bordered textarea-sm" rows={2} value={form.direccion ?? ''} onChange={e => sf('direccion', e.target.value)} />
            </label>
            <div className="modal-action">
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
