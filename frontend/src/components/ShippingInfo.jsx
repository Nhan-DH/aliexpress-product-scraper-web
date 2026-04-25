function ShippingInfo({ shipping }) {
  if (!shipping || shipping.length === 0) {
    return null
  }

  return (
    <div className="card">
      <h2>Shipping Options</h2>
      <div className="shipping-list">
        {shipping.map((option, i) => {
          const method = option.method || option.company || option.serviceName || option.name || option.deliveryProviderName || `Option ${i + 1}`
          const price = option.price || option.shippingPrice || option.amount || option.shippingInfo?.fees
          const time = option.time || option.estimatedDelivery || option.deliveryTime || option.deliveryInfo
          const deliveryText = typeof time === 'object' && time
            ? `${time.min ?? ''}${time.max && time.max !== time.min ? ` - ${time.max}` : ''} days`
            : time
          return (
            <div key={i} className="shipping-option">
              <div>
                <strong>{method}</strong>
                {deliveryText && <span>{deliveryText}</span>}
                {option.shippingInfo?.from && <span>From {option.shippingInfo.from}</span>}
              </div>
              {price != null && (
                <strong className={price === 0 || price === '0' || price === 'Free' ? 'free-price' : 'paid-price'}>
                  {price === 0 || price === '0' ? 'Free' : typeof price === 'number' ? price.toFixed(2) : price}
                </strong>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ShippingInfo
