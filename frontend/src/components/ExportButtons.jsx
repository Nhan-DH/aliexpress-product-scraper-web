import { exportToExcel } from '../utils/exportExcel'

function ExportButtons({ product }) {
  const handleExcelExport = async () => {
    await exportToExcel(product)
  }

  return (
    <div className="export-buttons">
      <button onClick={handleExcelExport} className="export-button">
        Export to Excel
      </button>
    </div>
  )
}

export default ExportButtons
