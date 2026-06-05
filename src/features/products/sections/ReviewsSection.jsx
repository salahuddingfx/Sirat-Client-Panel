import { useEffect, useMemo, useState } from "react";
import { Star, Sparkles, ChevronLeft, ChevronRight, Quote, Award, Users, TrendingUp } from "lucide-react";
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

const AuthorAvatar = ({ name, avatar, size = 56, ring = false }) => {
  const ringStyle = ring ? { boxShadow: "0 0 0 3px var(--sirat-bg), 0 0 0 5px var(--sirat-gold)" } : {};
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
          border: "1.5px solid var(--sirat-border-strong, rgba(197, 160, 89, 0.35))",
          background: "var(--sirat-cream, #FAF9F5)",
          flexShrink: 0,
          display: "block",
          ...ringStyle,
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
        border: "1.5px solid var(--sirat-border-strong, rgba(197, 160, 89, 0.35))",
        flexShrink: 0,
        ...ringStyle,
      }}
    >
      {(name || "?").trim().charAt(0).toUpperCase()}
    </div>
  );
};

const Stars = ({ value = 0, size = 14 }) => (
  <div style={{ display: "inline-flex", gap: "2px", color: "var(--sirat-star, #C5A059)" }}>
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

const AUTOPLAY_MS = 7000;

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchReviews()
      .then((data) => { if (mounted) setReviews(Array.isArray(data) ? data : []); })
      .catch((e) => console.error("Failed to fetch reviews:", e));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (reviews.length <= 1 || paused) return undefined;
    const id = setInterval(() => setActive((p) => (p + 1) % reviews.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reviews.length, paused]);

  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { total: 0, avg: 0, fivePct: 0, recommendPct: 0 };
    const sum = reviews.reduce((s, r) => s + Number(r.rating || 0), 0);
    const fiveStar = reviews.filter((r) => Math.round(Number(r.rating || 0)) === 5).length;
    return {
      total,
      avg: sum / total,
      fivePct: Math.round((fiveStar / total) * 100),
      recommendPct: Math.round(reviews.filter((r) => Number(r.rating || 0) >= 4).length / total * 100),
    };
  }, [reviews]);

  if (!reviews || reviews.length === 0) return null;

  const current = reviews[active];
  const productName = current?.product?.name;
  const productSlug = current?.product?.slug;
  const productImage = pickProductImage(current?.product?.images);
  const productHref = productSlug ? `/product/${productSlug}` : null;

  // Sidebar: the next 3 reviews as a "queue" strip
  const upcoming = useMemo(() => {
    if (reviews.length <= 1) return [];
    const items = [];
    for (let i = 1; i <= Math.min(3, reviews.length - 1); i++) {
      items.push(reviews[(active + i) % reviews.length]);
    }
    return items;
  }, [active, reviews]);

  return (
    <section
      className="hp-reviews"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* HEADER STRIP */}
      <div className="hp-reviews__header">
        <div>
          <div className="storefront__badge" style={{ color: "var(--sirat-gold-soft)", borderColor: "var(--sirat-gold-soft)", background: "rgba(197, 160, 89, 0.08)" }}>
            <Sparkles size={12} /> The Wall of Love
          </div>
          <h2 className="hp-reviews__title">Real words from real wearers.</h2>
          <p className="hp-reviews__subtitle">
            Unfiltered reviews from people who actually bought, wore, and lived in our pieces.
          </p>
        </div>
        <div className="hp-reviews__stats">
          <div className="hp-reviews__stat">
            <div className="hp-reviews__stat-icon" style={{ background: "linear-gradient(135deg, #C5A059 0%, #B38F4B 100%)" }}>
              <Award size={18} color="#FFFDFB" />
            </div>
            <div>
              <div className="hp-reviews__stat-value">{stats.avg.toFixed(1)} <Stars value={stats.avg} size={11} /></div>
              <div className="hp-reviews__stat-label">Average rating</div>
            </div>
          </div>
          <div className="hp-reviews__stat">
            <div className="hp-reviews__stat-icon" style={{ background: "linear-gradient(135deg, #141311 0%, #2A2723 100%)" }}>
              <Users size={18} color="#C5A059" />
            </div>
            <div>
              <div className="hp-reviews__stat-value">{stats.total}+</div>
              <div className="hp-reviews__stat-label">Verified reviews</div>
            </div>
          </div>
          <div className="hp-reviews__stat">
            <div className="hp-reviews__stat-icon" style={{ background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)" }}>
              <TrendingUp size={18} color="#FFFDFB" />
            </div>
            <div>
              <div className="hp-reviews__stat-value">{stats.recommendPct}%</div>
              <div className="hp-reviews__stat-label">Would recommend</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN SHOWCASE */}
      <div className="hp-reviews__main">
        {/* FEATURED BIG REVIEW (LEFT) */}
        <div className="hp-reviews__feature">
          <AnimatePresence mode="wait">
            <m.article
              key={`feature-${active}-${current?.id || ""}`}
              className="hp-reviews__feature-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Product image backdrop */}
              {productImage ? (
                <div className="hp-reviews__feature-img" style={{ backgroundImage: `url(${productImage})` }} />
              ) : (
                <div className="hp-reviews__feature-img hp-reviews__feature-img--placeholder">
                  <Quote size={80} strokeWidth={1} />
                </div>
              )}
              <div className="hp-reviews__feature-overlay" />

              {/* Floating quote mark */}
              <Quote size={56} className="hp-reviews__feature-quote" />

              {/* Content */}
              <div className="hp-reviews__feature-content">
                <Stars value={Number(current?.rating || 0)} size={16} />
                <p className="hp-reviews__feature-text">
                  "{current?.comment}"
                </p>
                <div className="hp-reviews__feature-author">
                  <AuthorAvatar name={current?.name} avatar={current?.author?.avatar} size={52} ring />
                  <div>
                    <strong className="hp-reviews__feature-name">{current?.name}</strong>
                    {productName && (
                      <div className="hp-reviews__feature-product">
                        <span className="hp-reviews__feature-product-label">Verified buyer on</span>
                        {productHref ? (
                          <Link to={productHref} className="hp-reviews__feature-product-link">{productName}</Link>
                        ) : (
                          <span className="hp-reviews__feature-product-link">{productName}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Counter pill */}
              <div className="hp-reviews__counter">
                {String(active + 1).padStart(2, "0")} <span>/ {String(reviews.length).padStart(2, "0")}</span>
              </div>
            </m.article>
          </AnimatePresence>

          {/* Controls */}
          <div className="hp-reviews__controls">
            <button
              type="button"
              className="hp-reviews__arrow"
              onClick={() => setActive((p) => (p - 1 + reviews.length) % reviews.length)}
              aria-label="Previous review"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="hp-reviews__dots">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`hp-reviews__dot${idx === active ? " is-active" : ""}`}
                  onClick={() => setActive(idx)}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              className="hp-reviews__arrow"
              onClick={() => setActive((p) => (p + 1) % reviews.length)}
              aria-label="Next review"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* UP NEXT QUEUE (RIGHT) */}
        <div className="hp-reviews__queue">
          <div className="hp-reviews__queue-head">
            <span className="hp-reviews__queue-label">Up Next</span>
            <span className="hp-reviews__queue-count">+{Math.max(0, reviews.length - 1)} more</span>
          </div>
          <div className="hp-reviews__queue-list">
            {upcoming.map((r, idx) => {
              const rImg = pickProductImage(r?.product?.images);
              return (
                <button
                  key={`q-${active}-${idx}-${r?.id}`}
                  type="button"
                  className="hp-reviews__queue-item"
                  onClick={() => setActive((p) => (p + idx + 1) % reviews.length)}
                >
                  <div className="hp-reviews__queue-thumb">
                    {rImg ? (
                      <img src={rImg} alt={r?.product?.name || ""} loading="lazy" />
                    ) : (
                      <Quote size={18} />
                    )}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="hp-reviews__queue-name">
                      <AuthorAvatar name={r?.name} avatar={r?.author?.avatar} size={28} />
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r?.name}</span>
                    </div>
                    <div className="hp-reviews__queue-meta">
                      <Stars value={Number(r?.rating || 0)} size={10} />
                      <span className="hp-reviews__queue-product">{r?.product?.name || ""}</span>
                    </div>
                  </div>
                </button>
              );
            })}
            {reviews.length <= 1 && (
              <p className="hp-reviews__queue-empty">More reviews will appear here as buyers share their experience.</p>
            )}
          </div>

          <Link to="/reviews" className="hp-reviews__queue-cta">
            <span>See all {reviews.length} reviews</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
