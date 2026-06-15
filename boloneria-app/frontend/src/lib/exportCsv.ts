export function descargarCSV(data: Record<string, unknown>[], nombre: string) {
  if (!data.length) return
  const cols = Object.keys(data[0])
  const filas = data.map(row =>
    cols.map(k => {
      const v = String(row[k] ?? '')
      return v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v.replace(/"/g, '""')}"` : v
    }).join(',')
  )
  const csv = '﻿' + [cols.join(','), ...filas].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${nombre}_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
