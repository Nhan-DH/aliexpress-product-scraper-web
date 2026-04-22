import { exportToExcel } from '../utils/exportExcel'

function ExportButtons({ product }) {
  const handleExcelExport = () => {
    exportToExcel(product)
  }

  const handleCopyJSON = () => {
    const json = JSON.stringify(product, null, 2)
    navigator.clipboard.writeText(json).then(() => {
      alert('Product JSON copied to clipboard!')
    }).catch(() => {
      const textarea = document.createElement('textarea')
      textarea.value = json
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      alert('Product JSON copied to clipboard!')
    })
  }

  return (
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
      <button
        onClick={handleExcelExport}
        style={{
          padding: '0.6rem 1.2rem',
          background: '#217346',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}
      >
        📊 Export to Excel
      </button>
      <button
        onClick={handleCopyJSON}
        style={{
          padding: '0.6rem 1.2rem',
          background: '#2c3e50',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}
      >
        📋 Copy JSON
      </button>
    </div>
  )
}

export default ExportButtons
