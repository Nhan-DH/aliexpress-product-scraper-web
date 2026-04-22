import { useState } from 'react'
import SearchBar from './components/SearchBar'
import ProductOverview from './components/ProductOverview'
import ProductImages from './components/ProductImages'
import StoreInfo from './components/StoreInfo'
import Specifications from './components/Specifications'
import Variants from './components/Variants'
import ShippingInfo from './components/ShippingInfo'
import Reviews from './components/Reviews'
import ExportButtons from './components/ExportButtons'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFetch = async () => {
    if (!url.trim()) {
      setError('Please enter an AliExpress product URL')
      return
    }
    setLoading(true)
    setError('')
    setProduct(null)
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Failed to fetch product data')
      } else {
        setProduct(json.data)
      }
    } catch (err) {
      setError('Network error: Could not connect to the server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🛒 AliExpress Product Scraper</h1>
        <p>Enter an AliExpress product URL to fetch detailed product information</p>
      </header>

      <main className="app-main">
        <SearchBar url={url} setUrl={setUrl} onFetch={handleFetch} loading={loading} />

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="spinner" />
            <p>Fetching product data...</p>
          </div>
        )}

        {product && (
          <div className="product-container">
            <ExportButtons product={product} />
            <div className="product-grid">
              <div className="product-left">
                <ProductImages images={product.images} title={product.title} />
                <StoreInfo store={product.store} />
              </div>
              <div className="product-right">
                <ProductOverview product={product} />
                <Variants variants={product.variants} />
                <ShippingInfo shipping={product.shipping} />
              </div>
            </div>
            <Specifications specifications={product.specifications} />
            <Reviews reviews={product.reviews} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
