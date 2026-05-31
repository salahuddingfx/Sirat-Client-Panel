import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const animatedReviews = [
  {
    name: "Amina Al-Sabah",
    stars: 5,
    text: "The Lumina Coat is architectural perfection. The warm cream and gold details look absolutely stellar. The packaging and tracking were top notch.",
    location: "London, UK"
  },
  {
    name: "Daniel Tremblay",
    stars: 5,
    text: "The Nova Set fabric weight is incredible. It hangs perfectly, feels expensive, and washes beautifully. Sirat has redefined essential wear.",
    location: "Montreal, CA"
  },
  {
    name: "Mia Takahashi",
    stars: 4.8,
    text: "Minimalist fashion at its absolute best. The cream-burgundy website makes browsing feel premium. Quick checkout and friendly support service.",
    location: "Tokyo, JP"
  },
  {
    name: "Marcus Vance",
    stars: 5,
    text: "Fast fulfillment and elite quality. I bought the Matrix Cargo and they are easily the best structured trousers I own. Ready for the next drop!",
    location: "New York, USA"
  }
];

export default function ReviewsSection() {
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

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
          <div className="reviews-ctrls" style={{ marginTop: "1.5rem" }}>
            <button
              type="button"
              className="slider-ctrl prev"
              style={{ position: "static", transform: "none", display: "inline-flex", marginRight: "0.5rem" }}
              onClick={() => setActiveReviewIdx((prev) => (prev - 1 + animatedReviews.length) % animatedReviews.length)}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="slider-ctrl next"
              style={{ position: "static", transform: "none", display: "inline-flex" }}
              onClick={() => setActiveReviewIdx((prev) => (prev + 1) % animatedReviews.length)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="reviews-carousel-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeReviewIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="sirat-panel page-card review-display-card"
            >
              <div className="review-rating-stars">
                {[...Array(5)].map((_, i) => {
                  const stars = animatedReviews[activeReviewIdx].stars;
                  return (
                    <Star
                      key={i}
                      size={16}
                      className="star-filled"
                      fill={i < Math.floor(stars) ? "currentColor" : "none"}
                      color="var(--sirat-star)"
                    />
                  );
                })}
                <span className="review-stars-val">{animatedReviews[activeReviewIdx].stars} rating</span>
              </div>
              <p className="review-quote-text">"{animatedReviews[activeReviewIdx].text}"</p>
              <div className="review-author-meta">
                <strong>{animatedReviews[activeReviewIdx].name}</strong>
                <span className="helper">{animatedReviews[activeReviewIdx].location}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
