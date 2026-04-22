function SearchBar({ url, setUrl, onFetch, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onFetch()
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      marginBottom: '1rem',
    }}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://www.aliexpress.com/item/1005006789012345.html"
          disabled={loading}
          style={{
            flex: 1,
            minWidth: '250px',
            padding: '0.75rem 1rem',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />
        <button
          onClick={onFetch}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            background: loading ? '#ccc' : '#e8463a',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background 0.2s',
          }}
        >
          {loading ? 'Fetching...' : 'Fetch Product'}
        </button>
      </div>
    </div>
  )
}

export default SearchBar
