function Reviews({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return null
  }

  const renderStars = (rating) => {
    if (!rating) return null
    const num = Math.round(parseFloat(rating))
    return '★'.repeat(num) + '☆'.repeat(Math.max(0, 5 - num))
  }

  return (
    <div className="card">
      <h2>Reviews ({reviews.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reviews.map((review, i) => {
          const author = review.author || review.buyerName || review.userName || 'Anonymous'
          const rating = review.rating || review.reviewStarRating
          const content = review.content || review.reviewContent || review.comment || ''
          const date = review.date || review.reviewTime || ''
          return (
            <div
              key={i}
              style={{
                padding: '1rem',
                background: '#f8f9fa',
                borderRadius: '6px',
                border: '1px solid #eee',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#333' }}>{author}</strong>
                {date && <span style={{ fontSize: '0.8rem', color: '#999' }}>{date}</span>}
              </div>
              {rating && (
                <div style={{ color: '#f5a623', marginBottom: '0.5rem' }}>{renderStars(rating)}</div>
              )}
              {content && <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>{content}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Reviews
