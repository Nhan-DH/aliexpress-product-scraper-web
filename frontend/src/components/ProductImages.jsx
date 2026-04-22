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
      <div style={{ marginBottom: '1rem' }}>
        <img
          src={imgSrc(images[selectedIndex])}
          alt={title || 'Product'}
          style={{
            width: '100%',
            maxHeight: '320px',
            objectFit: 'contain',
            borderRadius: '6px',
            border: '1px solid #eee',
            background: '#fafafa',
          }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {images.map((img, i) => (
            <img
              key={i}
              src={imgSrc(img)}
              alt={`${title} ${i + 1}`}
              onClick={() => setSelectedIndex(i)}
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'cover',
                borderRadius: '4px',
                border: i === selectedIndex ? '2px solid #e8463a' : '2px solid #eee',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductImages
