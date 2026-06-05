import { useEffect, useState } from "react";
import { Star, Sparkles, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { m, AnimatePresence } from "framer-motion";
import { fetchReviews } from "@api/queries";

const pickProductImage = (images) => {
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && first.url) return first.url;
  }
  return null;
};

const AuthorAvatar = ({ name, avatar, size = 56 }) => {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name || "Reviewer"}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid var(--sirat-border-strong, rgba(197, 160, 89, 0.35))",
          background: "var(--sirat-cream, #FAF9F5)",
          flexShrink: 0,
          display: "block",
        }}
        loading="lazy"
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, var(--sirat-gold) 0%, var(--sirat-gold-soft) 100%)",
        color: "#FFFDFB",
        fontWeight: 800,
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: size * 0.4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid var(--sirat-border-strong, rgba(197, 160, 89, 0.35))",
        flexShrink: 0,
      }}
    >
      {(name || "?").trim().charAt(0).toUpperCase()}
    </div>
  );
};

const Stars = ({ value = 0, size = 16 }) => (
  <div style={{ display: "inline-flex", gap: "2px", color: "var(--sirat-star)" }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={size}
        fill={i <= Math.round(value) ? "currentColor" : "none"}
        strokeWidth={i <= Math.round(value) ? 0 : 1.5}
      />
    ))}
  </div>
);

const AUTOPLAY_MS = 6500;

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchReviews()
      .then((data) => {
        if (!mounted) return;
        setReviews(Array.isArray(data) ? data : []);
      })
      .catch((e) => console.error("Failed to fetch reviews:", e));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (reviews.length <= 1 || paused) return undefined;
    const id = setInterval(() => {
      setActive((p) => (p + 1) % reviews.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reviews.length, paused]);

  if (!reviews || reviews.length === 0) return null;

  const current = reviews[active];
  const productName = current?.product?.name;
  const productSlug = current?.product?.slug;
  const productImage = pickProductImage(current?.product?.images);
  const productHref = productSlug ? `/product/${productSlug}` : null;

  // Aggregate stats for the left side
  const total = reviews.length;
  const avg = total > 0 ? reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / total : 0;
  const fiveStar = reviews.filter((r) => Math.round(Number(r.rating || 0)) === 5).length;
  const fivePct = total > 0 ? Math.round((fiveStar / total) * 100) : 0;

  const goPrev = () => setActive((p) => (p - 1 + reviews.length) % reviews.length);
  const goNext = () => setActive((p) => (p + 1) % reviews.length);

  return (
    <section
      className="homepage-reviews homepage-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-split-container reviews-split-container">
        {/* LEFT — text / stats (mirrors hero's right side) */}
        <div className="hero-split-info reviews-split-info">
          <AnimatePresence mode="wait">
            <m.div
              key={`info-${active}`}
              className="hero-info-wrapper"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.45 }}
            >
              <span className="storefront__badge hero-animate" style={{ color: "var(--sirat-gold-soft)", borderColor: "var(--sirat-gold-soft)", background: "rgba(197, 160, 89, 0.08)" }}>
                <Sparkles size={12} /> Customer Feedback
              </span>

              <h2 className="hero-slide__title hero-animate" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", marginTop: "0.85rem" }}>
                What our community says about Sirat.
              </h2>

              <p className="hero-slide__desc hero-animate">
                Verified buyers verify our high-grammage materials, structured drapes, and fulfillment speeds — straight from people who actually wear the gear.
              </p>

              {/* STATS BLOCK */}
              <div className="hero-animate reviews-stats">
                <div className="reviews-stat">
                  <div className="reviews-stat__value">{avg.toFixed(1)}</div>
                  <div className="reviews-stat__label">
                    <Stars value={avg} size={12} />
                    <span>Average rating</span>
                  </div>
                </div>
                <div className="reviews-stat">
                  <div className="reviews-stat__value">{total}</div>
                  <div className="reviews-stat__label">
                    <span>Verified {total === 1 ? "review" : "reviews"}</span>
                  </div>
                </div>
                <div className="reviews-stat">
                  <div className="reviews-stat__value">{fivePct}%</div>
                  <div className="reviews-stat__label">
                    <span>5-star feedback</span>
                  </div>
                </div>
              </div>

              <div className="hero-slide__actions hero-animate">
                <Link to="/reviews"><button type="button" className="sirat-button sirat-button--primary">Read All Reviews</button></Link>
                <Link to="/shop"><button type="button" className="sirat-button sirat-button--outline">Shop the Drop</button></Link>
              </div>
            </m.div>
          </AnimatePresence>

          <div className="slider-indicators">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                className={["indicator", idx === active ? "active" : ""].filter(Boolean).join(" ")}
                onClick={() => setActive(idx)}
                aria-label={`Review ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — animated review (mirrors hero's left side) */}
        <div className="hero-split-media reviews-split-media">
          <AnimatePresence mode="wait">
            <m.div
              key={`review-${active}-${current?.id || ""}`}
              className="hero-media-wrapper reviews-card-wrapper"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -8 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="reviews-feature-card">
                {/* BACKGROUND PRODUCT IMAGE */}
                {productImage ? (
                  <div
                    className="reviews-feature-card__bg"
                    style={{ backgroundImage: `url(${productImage})` }}
                    aria-hidden
                  />
                ) : (
                  <div className="reviews-feature-card__bg reviews-feature-card__bg--placeholder" aria-hidden>
                    <Quote size={120} strokeWidth={1} />
                  </div>
                )}
                <div className="reviews-feature-card__overlay" />

                {/* FOREGROUND CONTENT */}
                <div className="reviews-feature-card__content">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                    <AuthorAvatar name={current?.name} avatar={current?.author?.avatar} size={56} />
                    <div style={{ minWidth: 0 }}>
                      <strong className="reviews-feature-card__name">{current?.name}</strong>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "2px" }}>
                        <Stars value={Number(current?.rating || 0)} size={13} />
                        <span className="reviews-feature-card__rating-val">{Number(current?.rating || 0).toFixed(1)} / 5</span>
                      </div>
                    </div>
                  </div>

                  <Quote size={32} className="reviews-feature-card__bigquote" />

                  <p className="reviews-feature-card__comment">
                    "{current?.comment}"
                  </p>

                  {productName && (
                    <div className="reviews-feature-card__product">
                      {productHref ? (
                        <Link to={productHref} className="reviews-feature-card__product-link">
                          On <strong>{productName}</strong>
                          <span aria-hidden>→</span>
                        </Link>
                      ) : (
                        <span className="reviews-feature-card__product-link">On <strong>{productName}</strong></span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </m.div>
          </AnimatePresence>

          <div className="slider-ctrls-group">
            <button className="slider-ctrl prev" onClick={goPrev} aria-label="Previous review">
              <ChevronLeft size={18} />
            </button>
            <button className="slider-ctrl next" onClick={goNext} aria-label="Next review">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Counter pill */}
          <div className="reviews-counter">
            {String(active + 1).padStart(2, "0")} <span>/ {String(reviews.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
