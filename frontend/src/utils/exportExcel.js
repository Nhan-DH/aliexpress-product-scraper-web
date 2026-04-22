import * as XLSX from 'xlsx'

export function exportToExcel(product) {
  const wb = XLSX.utils.book_new()

  // Summary sheet
  const summary = [
    ['Field', 'Value'],
    ['Title', product.title || ''],
    ['Price', product.price != null ? (typeof product.price === 'object' ? JSON.stringify(product.price) : product.price) : ''],
    ['Rating', product.rating || ''],
    ['Orders', product.orders || ''],
    ['Stock', product.stock || ''],
    ['Store Name', product.store?.name || ''],
    ['Store URL', product.store?.url || ''],
    ['Store Rating', product.store?.rating || ''],
    ['Store Followers', product.store?.followers || ''],
  ]
  const summarySheet = XLSX.utils.aoa_to_sheet(summary)
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary')

  // Images sheet
  const images = [['#', 'Image URL']]
  ;(product.images || []).forEach((img, i) => {
    const url = typeof img === 'string' ? img : (img.url || img.src || '')
    images.push([i + 1, url])
  })
  const imagesSheet = XLSX.utils.aoa_to_sheet(images)
  XLSX.utils.book_append_sheet(wb, imagesSheet, 'Images')

  // Specifications sheet
  const specs = [['Key', 'Value']]
  ;(product.specifications || []).forEach((spec) => {
    const key = spec.key || spec.name || spec.attrName || Object.keys(spec)[0] || ''
    const value = spec.value || spec.attrValue || Object.values(spec)[1] || ''
    specs.push([key, Array.isArray(value) ? value.join(', ') : String(value)])
  })
  const specsSheet = XLSX.utils.aoa_to_sheet(specs)
  XLSX.utils.book_append_sheet(wb, specsSheet, 'Specifications')

  // Reviews sheet
  const reviews = [['Author', 'Rating', 'Date', 'Content']]
  ;(product.reviews || []).forEach((r) => {
    reviews.push([
      r.author || r.buyerName || r.userName || '',
      r.rating || r.reviewStarRating || '',
      r.date || r.reviewTime || '',
      r.content || r.reviewContent || r.comment || '',
    ])
  })
  const reviewsSheet = XLSX.utils.aoa_to_sheet(reviews)
  XLSX.utils.book_append_sheet(wb, reviewsSheet, 'Reviews')

  // Shipping sheet
  const shipping = [['Method', 'Price', 'Estimated Delivery']]
  ;(product.shipping || []).forEach((s) => {
    shipping.push([
      s.method || s.company || s.serviceName || s.name || '',
      s.price || s.shippingPrice || s.amount || '',
      s.time || s.estimatedDelivery || s.deliveryTime || '',
    ])
  })
  const shippingSheet = XLSX.utils.aoa_to_sheet(shipping)
  XLSX.utils.book_append_sheet(wb, shippingSheet, 'Shipping')

  const filename = `aliexpress-product-${Date.now()}.xlsx`
  XLSX.writeFile(wb, filename)
}
