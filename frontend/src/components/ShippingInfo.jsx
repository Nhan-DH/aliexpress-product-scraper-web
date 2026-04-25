function ShippingInfo({ shipping }) {
  if (!shipping || shipping.length === 0) {
    return null
  }

  return (
    <div className="card">
      <h2>Shipping Options</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {shipping.map((option, i) => {
          const method = option.method || option.company || option.serviceName || option.name || `Option ${i + 1}`
          const price = option.price || option.shippingPrice || option.amount
          const time = option.time || option.estimatedDelivery || option.deliveryTime
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: '#f8f9fa',
                borderRadius: '6px',
                border: '1px solid #eee',
              }}
            >
              <div>
                <div style={{ fontWeight: '600', color: '#333' }}>🚚 {method}</div>
                {time && <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.2rem' }}>{time}</div>}
              </div>
              {price != null && (
                <div style={{ fontWeight: '700', color: price === 0 || price === '0' || price === 'Free' ? '#27ae60' : '#e8463a' }}>
                  {price === 0 || price === '0' ? 'Free' : typeof price === 'number' ? `$${price.toFixed(2)}` : price}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ShippingInfo
