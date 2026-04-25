function Variants({ variants }) {
  if (!variants || variants.length === 0) {
    return null
  }

  return (
    <div className="card">
      <h2>Variants</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {variants.map((variant, i) => {
          const name = variant.name || variant.skuPropertyName || variant.property || `Variant ${i + 1}`
          const values = variant.values || variant.skuPropertyValues || []
          return (
            <div key={i}>
              <div style={{ fontWeight: '600', marginBottom: '0.4rem', color: '#555' }}>{name}</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {Array.isArray(values) ? values.map((v, j) => {
                  const label = typeof v === 'string' ? v : (v.name || v.propertyValueName || v.value || JSON.stringify(v))
                  const imgSrc = v.image || v.imgUrl || null
                  return (
                    <div
                      key={j}
                      style={{
                        padding: '0.35rem 0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        background: '#fafafa',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      {imgSrc && (
                        <img src={imgSrc} alt={label} style={{ width: '20px', height: '20px', objectFit: 'cover', borderRadius: '2px' }} />
                      )}
                      {label}
                    </div>
                  )
                }) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Variants
