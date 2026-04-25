import CountrySelector from './CountrySelector'

function SearchBar({ url, setUrl, shipToCountry, setShipToCountry, onFetch, loading }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') onFetch()
  }

  return (
    <div className="search-card">
      <div className="search-form">
        <label className="url-field">
          <span>Product URL</span>
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://www.aliexpress.com/item/1005006789012345.html"
            disabled={loading}
          />
        </label>

        <CountrySelector
          value={shipToCountry}
          onChange={setShipToCountry}
          disabled={loading}
        />

        <button onClick={onFetch} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Product'}
        </button>
      </div>
    </div>
  )
}

export default SearchBar
