import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { fetchReviews } from "@api/queries";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetchReviews();
        if (mounted) setReviews(res || []);
      } catch (e) {
        console.error("Failed to fetch reviews:", e);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="reviews-carousel-section">
      <div className="reviews-carousel-layout">
        <div className="reviews-carousel-head">
          <div className="storefront__badge">
            <Star size={12} /> Reviews
          </div>
          <h2 className="page-section__title" style={{ marginTop: "0.5rem" }}>Customer Feedback</h2>
          <p className="page-section__text">
            Verified buyers verify our high-grammage materials, structured drapes, and fulfillment speeds.
          </p>
        </div>

        <div className="reviews-carousel-body">
          <div className="marquee-container">
            <div className="marquee-track">
              {[...reviews, ...reviews].map((r, idx) => (
                <div key={`${r._id || r.name}-${idx}`} className="sirat-panel page-card review-display-card" style={{ minWidth: 320 }}>
                  <div className="review-rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="star-filled" fill={i < Math.floor(r.rating) ? "currentColor" : "none"} color="var(--sirat-star)" />
                    ))}
                    <span className="review-stars-val">{r.rating} rating</span>
                  </div>
                  <p className="review-quote-text">"{r.comment}"</p>
                  <div className="review-author-meta">
                    <strong>{r.name}</strong>
                    <span className="helper">{r.location || r.country || ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
