import ExcelJS from 'exceljs'

function addSheetWithRows(workbook, sheetName, rows) {
  const sheet = workbook.addWorksheet(sheetName)
  rows.forEach((row) => sheet.addRow(row))
  // Bold the header row
  if (rows.length > 0) {
    sheet.getRow(1).font = { bold: true }
  }
}

export async function exportToExcel(product) {
  const wb = new ExcelJS.Workbook()

  // Summary sheet
  addSheetWithRows(wb, 'Summary', [
    ['Field', 'Value'],
    ['Title', product.title || ''],
    ['Price', product.price != null ? (typeof product.price === 'object' ? JSON.stringify(product.price) : String(product.price)) : ''],
    ['Rating', product.rating != null ? String(product.rating) : ''],
    ['Orders', product.orders != null ? String(product.orders) : ''],
    ['Stock', product.stock != null ? String(product.stock) : ''],
    ['Store Name', product.store?.name || ''],
    ['Store URL', product.store?.url || ''],
    ['Store Rating', product.store?.rating != null ? String(product.store.rating) : ''],
    ['Store Followers', product.store?.followers != null ? String(product.store.followers) : ''],
  ])

  // Images sheet
  const imageRows = [['#', 'Image URL']]
  ;(product.images || []).forEach((img, i) => {
    const url = typeof img === 'string' ? img : (img.url || img.src || '')
    imageRows.push([i + 1, url])
  })
  addSheetWithRows(wb, 'Images', imageRows)

  // Specifications sheet
  const specRows = [['Key', 'Value']]
  ;(product.specifications || []).forEach((spec) => {
    const key = spec.key || spec.name || spec.attrName || Object.keys(spec)[0] || ''
    const value = spec.value || spec.attrValue || Object.values(spec)[1] || ''
    specRows.push([key, Array.isArray(value) ? value.join(', ') : String(value)])
  })
  addSheetWithRows(wb, 'Specifications', specRows)

  // Reviews sheet
  const reviewRows = [['Author', 'Rating', 'Date', 'Content']]
  ;(product.reviews || []).forEach((r) => {
    reviewRows.push([
      r.author || r.buyerName || r.userName || '',
      r.rating || r.reviewStarRating || '',
      r.date || r.reviewTime || '',
      r.content || r.reviewContent || r.comment || '',
    ])
  })
  addSheetWithRows(wb, 'Reviews', reviewRows)

  // Shipping sheet
  const shippingRows = [['Method', 'Price', 'Estimated Delivery']]
  ;(product.shipping || []).forEach((s) => {
    shippingRows.push([
      s.method || s.company || s.serviceName || s.name || '',
      s.price || s.shippingPrice || s.amount || '',
      s.time || s.estimatedDelivery || s.deliveryTime || '',
    ])
  })
  addSheetWithRows(wb, 'Shipping', shippingRows)

  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `aliexpress-product-${Date.now()}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}
