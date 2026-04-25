function StoreInfo({ store }) {
  if (!store || (!store.name && !store.url)) {
    return null
  }

  return (
    <div className="card">
      <h2>Store Information</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {store.name && (
          <div>
            <strong>Store:</strong>{' '}
            {store.url ? (
              <a href={store.url} target="_blank" rel="noopener noreferrer">{store.name}</a>
            ) : (
              store.name
            )}
          </div>
        )}
        {store.rating != null && (
          <div><strong>Rating:</strong> {store.rating}</div>
        )}
        {store.followers != null && (
          <div><strong>Followers:</strong> {store.followers.toLocaleString?.() ?? store.followers}</div>
        )}
      </div>
    </div>
  )
}

export default StoreInfo
