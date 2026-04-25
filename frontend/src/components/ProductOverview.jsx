function ProductOverview({ product }) {
  const { title, price, rating, orders, stock } = product

  const renderStars = (rating) => {
    if (!rating) return null
    const num = parseFloat(rating)
    return '★'.repeat(Math.round(num)) + '☆'.repeat(5 - Math.round(num))
  }

  return (
    <div className="card">
      <h2>Product Overview</h2>
      {title && <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#222' }}>{title}</h3>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {price != null && (
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#e8463a' }}>
            {typeof price === 'object' ? `$${price.min || price.current || JSON.stringify(price)}` : `$${price}`}
          </div>
        )}
        {rating != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#f5a623', fontSize: '1.1rem' }}>{renderStars(rating)}</span>
            <span style={{ color: '#666' }}>{rating}</span>
          </div>
        )}
        {orders != null && (
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            📦 <strong>{orders}</strong> orders
          </div>
        )}
        {stock != null && (
          <div style={{ color: stock > 0 ? '#27ae60' : '#e74c3c', fontSize: '0.9rem', fontWeight: '600' }}>
            {stock > 0 ? `✓ In stock (${stock} available)` : '✗ Out of stock'}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductOverview
