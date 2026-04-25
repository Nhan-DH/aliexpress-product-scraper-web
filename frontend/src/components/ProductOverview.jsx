function ProductOverview({ product }) {
  const {
    title,
    categoryId,
    productId,
    currency,
    totalAvailableQuantity,
    price,
    rating,
    orders,
    stock,
    originalPrice,
    salePrice,
    ratings,
  } = product

  const availableQuantity = totalAvailableQuantity ?? stock
  const averageRating = ratings?.averageStar ?? rating

  const formatPrice = (value) => {
    if (value == null || value === '') return ''
    if (typeof value === 'object') return value.formatedAmount || value.value || JSON.stringify(value)
    return `${currency || 'USD'} ${value}`
  }

  const formatRange = (range) => {
    if (!range || (range.min == null && range.max == null)) return ''
    if (range.min === range.max || range.max == null) return formatPrice(range.min)
    if (range.min == null) return formatPrice(range.max)
    return `${formatPrice(range.min)} - ${formatPrice(range.max)}`
  }

  const renderStars = (value) => {
    if (!value) return null
    const num = Math.max(0, Math.min(5, Math.round(parseFloat(value))))
    return '★'.repeat(num) + '☆'.repeat(5 - num)
  }

  return (
    <div className="card">
      <h2>Product Overview</h2>
      {title && <h3 className="product-title">{title}</h3>}
      <div className="overview-price">
        {formatRange(salePrice) || formatPrice(price)}
      </div>
      {formatRange(originalPrice) && (
        <div className="overview-original-price">
          Original: {formatRange(originalPrice)}
        </div>
      )}

      <div className="metric-grid">
        {productId != null && <Metric label="Product ID" value={productId} />}
        {categoryId != null && <Metric label="Category ID" value={categoryId} />}
        {orders != null && <Metric label="Orders" value={orders.toLocaleString?.() ?? orders} />}
        {availableQuantity != null && <Metric label="Available" value={availableQuantity.toLocaleString?.() ?? availableQuantity} />}
        {currency && <Metric label="Currency" value={currency} />}
        {ratings?.totalStartCount != null && <Metric label="Ratings" value={ratings.totalStartCount.toLocaleString?.() ?? ratings.totalStartCount} />}
      </div>

      {averageRating != null && (
        <div className="rating-row">
          <span className="stars">{renderStars(averageRating)}</span>
          <span>{averageRating}/5</span>
          {ratings?.totalStartCount != null && <span>({ratings.totalStartCount} ratings)</span>}
        </div>
      )}

      {ratings && (
        <div className="rating-breakdown">
          {[
            ['5', ratings.fiveStarCount],
            ['4', ratings.fourStarCount],
            ['3', ratings.threeStarCount],
            ['2', ratings.twoStarCount],
            ['1', ratings.oneStarCount],
          ].map(([star, count]) => (
            count != null ? <span key={star}>{star}★: {count}</span> : null
          ))}
        </div>
      )}
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export default ProductOverview
