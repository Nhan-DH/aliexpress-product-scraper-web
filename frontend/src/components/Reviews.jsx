function Reviews({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return null
  }

  const renderStars = (rating) => {
    if (!rating) return null
    const num = Math.max(0, Math.min(5, Math.round(parseFloat(rating))))
    return '★'.repeat(num) + '☆'.repeat(5 - num)
  }

  return (
    <div className="card">
      <h2>Reviews ({reviews.length})</h2>
      <div className="review-list">
        {reviews.map((review, i) => {
          const author = review.displayName || review.author || review.buyerName || review.userName || review.name || 'Anonymous'
          const rating = review.rating || review.reviewStarRating
          const content = review.content || review.reviewContent || review.comment || ''
          const date = review.date || review.reviewTime || ''
          return (
            <article key={i} className="review-item">
              <div className="review-header">
                <strong>{author}</strong>
                {date && <span>{date}</span>}
              </div>
              {rating && <div className="stars">{renderStars(rating)}</div>}
              {review.country && <div className="review-meta">{review.country}</div>}
              {content && <p>{content}</p>}
            </article>
          )
        })}
      </div>
    </div>
  )
}

export default Reviews
