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
  const [shipToCountry, setShipToCountry] = useState('')
  const [selectedCountryName, setSelectedCountryName] = useState('')
  const [shippingWarning, setShippingWarning] = useState('')
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFetch = async () => {
    if (!url.trim()) {
      setError('Please enter an AliExpress product URL')
      return
    }
    if (!shipToCountry) {
      setError('Please select a shipping destination country.')
      return
    }

    setLoading(true)
    setError('')
    setShippingWarning('')
    setSelectedCountryName('')
    setProduct(null)
    try {
      const res = await fetch('/api/products/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, shipToCountry }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Failed to fetch product data')
      } else {
        setProduct(json.data)
        setSelectedCountryName(json.selectedCountryName || json.data?.selectedCountryName || shipToCountry)
        setShippingWarning(json.warning || json.data?.shippingWarning || '')
      }
    } catch {
      setError('Network error: Could not connect to the server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>AliExpress Product Scraper</h1>
        <p>Enter an AliExpress product URL to fetch detailed product information</p>
      </header>

      <main className="app-main">
        <SearchBar
          url={url}
          setUrl={setUrl}
          shipToCountry={shipToCountry}
          setShipToCountry={setShipToCountry}
          onFetch={handleFetch}
          loading={loading}
        />

        {error && (
          <div className="error-banner">
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="spinner" />
            <p>Fetching shipping data for selected country...</p>
          </div>
        )}

        {product && (
          <div className="product-container">
            <div className="product-actions">
              <ExportButtons product={product} />
            </div>
            <div className="product-grid">
              <ProductImages images={product.images} title={product.title} />
              <ProductOverview product={product} />
              <StoreInfo store={product.storeInfo || product.store} />
              <Variants variants={product.variants} />
              <Specifications specifications={product.specs || product.specifications} />
              <ShippingInfo
                shipping={product.shipping}
                currency={product.currency || product.currencyInfo?.currencyCode}
                selectedCountry={shipToCountry}
                selectedCountryName={selectedCountryName}
                warning={shippingWarning}
              />
            </div>
            <Reviews reviews={product.reviews} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
