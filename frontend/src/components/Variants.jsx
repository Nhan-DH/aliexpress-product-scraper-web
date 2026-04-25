function Variants({ variants }) {
  const options = Array.isArray(variants) ? variants : variants?.options || []
  const prices = Array.isArray(variants?.prices) ? variants.prices : []

  if (options.length === 0 && prices.length === 0) {
    return null
  }

  return (
    <div className="card">
      <h2>Variants</h2>
      {options.length > 0 && (
        <div className="variant-options">
          {options.map((variant, i) => {
            const name = variant.name || variant.skuPropertyName || variant.property || `Variant ${i + 1}`
            const values = variant.values || variant.skuPropertyValues || []
            return (
              <section key={variant.id || i} className="variant-group">
                <h3>{name}</h3>
                <div className="variant-values">
                  {Array.isArray(values) ? values.map((v, j) => {
                    const label = typeof v === 'string'
                      ? v
                      : (v.displayName || v.name || v.propertyValueName || v.value || JSON.stringify(v))
                    const imgSrc = v.image || v.imgUrl || null
                    return (
                      <div key={v.id || j} className="variant-chip">
                        {imgSrc && <img src={imgSrc} alt={label} />}
                        <span>{label}</span>
                      </div>
                    )
                  }) : null}
                </div>
              </section>
            )
          })}
        </div>
      )}

      {prices.length > 0 && (
        <div className="sku-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Options</th>
                <th>Available</th>
                <th>Original</th>
                <th>Sale</th>
              </tr>
            </thead>
            <tbody>
              {prices.slice(0, 12).map((item, index) => (
                <tr key={item.skuId || index}>
                  <td>{item.skuId}</td>
                  <td>{item.optionValueIds}</td>
                  <td>{item.availableQuantity}</td>
                  <td>{item.originalPrice}</td>
                  <td>{item.salePrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {prices.length > 12 && <p className="table-note">Showing 12 of {prices.length} SKU prices.</p>}
        </div>
      )}
    </div>
  )
}

export default Variants
