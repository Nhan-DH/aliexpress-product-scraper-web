function StoreInfo({ store }) {
  if (!store || (!store.name && !store.storeNumber && !store.companyId)) {
    return null
  }

  return (
    <div className="card">
      <h2>Store Information</h2>
      <div className="info-list">
        {store.name && (
          <div>
            <span>Store</span>
            <strong>
              {store.url ? (
                <a href={store.url} target="_blank" rel="noopener noreferrer">{store.name}</a>
              ) : (
                store.name
              )}
            </strong>
          </div>
        )}
        {store.companyId != null && <Info label="Company ID" value={store.companyId} />}
        {store.storeNumber != null && <Info label="Store Number" value={store.storeNumber} />}
        {store.followers != null && <Info label="Followers" value={store.followers.toLocaleString?.() ?? store.followers} />}
        {store.ratingCount != null && <Info label="Rating Count" value={store.ratingCount.toLocaleString?.() ?? store.ratingCount} />}
        {store.rating != null && <Info label="Rating" value={store.rating} />}
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export default StoreInfo
