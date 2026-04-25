function formatFee(fee, currency) {
  if (fee === 0 || fee === '0') return 'Free Shipping'
  if (fee == null || fee === '') return 'Not listed'

  const numericFee = Number(fee)
  if (Number.isFinite(numericFee)) {
    if (currency === 'USD' || !currency) return `$${numericFee.toFixed(2)}`
    return `${numericFee.toFixed(2)} ${currency}`
  }

  return String(fee)
}

function matchesSelectedCountry(option, selectedCountry, selectedCountryName) {
  const code = String(selectedCountry || '').toUpperCase()
  const toCode = String(option.shippingInfo?.toCode || '').toUpperCase()
  const toName = String(option.to || option.shippingInfo?.to || '').trim().toLowerCase()
  const selectedName = String(selectedCountryName || '').trim().toLowerCase()

  return toCode === code || (selectedName && toName === selectedName)
}

function ShippingInfo({ shipping, currency, selectedCountry, selectedCountryName, warning }) {
  if (!shipping || shipping.length === 0) {
    return (
      <div className="card shipping-info-card">
        <h2>Shipping Information</h2>
        <div className="shipping-selected">Shipping to: {selectedCountryName || selectedCountry}</div>
        {warning && <div className="shipping-warning">{warning}</div>}
        <div className="shipping-empty">No shipping information available for the selected destination.</div>
      </div>
    )
  }

  const hasMismatch = shipping.some((option) => (
    !matchesSelectedCountry(option, selectedCountry, selectedCountryName)
  ))

  return (
    <div className="card shipping-info-card">
      <h2>Shipping Information</h2>
      <div className="shipping-selected">Shipping to: {selectedCountryName || selectedCountry}</div>
      {warning && <div className="shipping-warning">{warning}</div>}
      {hasMismatch && (
        <div className="shipping-warning">
          Shipping data does not match selected destination country.
        </div>
      )}

      <div className="shipping-list">
        {shipping.map((option, i) => {
          const provider = option.provider || option.deliveryProviderName || `Option ${i + 1}`
          const from = option.from || option.shippingInfo?.from || 'Unknown'
          const to = option.to || option.shippingInfo?.to || selectedCountryName || selectedCountry
          const fee = option.fee ?? option.shippingInfo?.fees
          const deliveryMin = option.deliveryMin ?? option.deliveryInfo?.min
          const deliveryMax = option.deliveryMax ?? option.deliveryInfo?.max
          const unreachable = Boolean(option.unreachable ?? option.shippingInfo?.unreachable)

          return (
            <article key={`${provider}-${i}`} className={`shipping-option${unreachable ? ' is-unreachable' : ''}`}>
              <div className="shipping-option-main">
                <strong>🚚 {provider}</strong>
                <span>From: {from}</span>
                <span>To: {to}</span>
                <span>⏱ Delivery time: {deliveryMin ?? '?'} - {deliveryMax ?? '?'} days</span>
              </div>
              <div className="shipping-option-side">
                <strong className={fee === 0 || fee === '0' ? 'free-price' : 'paid-price'}>
                  💰 {formatFee(fee, option.currency || currency)}
                </strong>
                <span className={`shipping-status${unreachable ? ' warning' : ' available'}`}>
                  {unreachable ? 'This product may not ship to this location' : 'Available'}
                </span>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export default ShippingInfo
