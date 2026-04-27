import { useState } from 'react'

function ProductImages({ images, title }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="card">
        <h2>Images</h2>
        <p style={{ color: '#999' }}>No images available</p>
      </div>
    )
  }

  const imgSrc = (img) => (typeof img === 'string' ? img : img.url || img.src || '')

  return (
    <div className="card">
      <h2>Images</h2>
      <div className="product-image-main">
        <img
          src={imgSrc(images[selectedIndex])}
          alt={title || 'Product'}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>
      {images.length > 1 && (
        <div className="product-thumbnails">
          {images.map((img, i) => (
            <img
              key={i}
              src={imgSrc(img)}
              alt={`${title} ${i + 1}`}
              onClick={() => setSelectedIndex(i)}
              className={`product-thumbnail${i === selectedIndex ? ' is-active' : ''}`}
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductImages
