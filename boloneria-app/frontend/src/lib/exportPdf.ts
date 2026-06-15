// html2canvas doesn't support oklch() (DaisyUI v4 / Tailwind v4) and there is
// no clean workaround. Instead we open a print window so the browser renders
// the content natively (it handles oklch fine) and the user saves as PDF.
export function descargarPDF(elementId: string, nombre: string) {
  const el = document.getElementById(elementId)
  if (!el) return

  const styleLinks = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
    .map(l => `<link rel="stylesheet" href="${l.href}">`)
    .join('\n')

  const win = window.open('', '_blank')
  if (!win) return

  win.document.write(`<!DOCTYPE html><html><head>
    <meta charset="utf-8">
    <title>${nombre}</title>
    ${styleLinks}
    <style>
      body { padding: 24px; background: white; }
      @media print { @page { margin: 15mm; } }
    </style>
  </head><body data-theme="light">${el.outerHTML}</body></html>`)
  win.document.close()
  win.addEventListener('load', () => { win.focus(); win.print() })
}
