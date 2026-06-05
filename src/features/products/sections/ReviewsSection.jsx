import { useState, useEffect } from "react";
import { Star, Sparkles, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchReviews } from "@api/queries";

const pickProductImage = (images) => {
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && first.url) return first.url;
  }
  return null;
};

const AuthorAvatar = ({ name, avatar, size = 44 }) => {
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

const Stars = ({ value = 0, size = 14 }) => (
  <div style={{ display: "inline-flex", gap: "1px", color: "var(--sirat-star)" }}>
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

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetchReviews();
        if (mounted) setReviews(Array.isArray(res) ? res : []);
      } catch (e) {
        console.error("Failed to fetch reviews:", e);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (!reviews || reviews.length === 0) return null;

  // Duplicate the array so the marquee loops seamlessly.
  const looped = reviews.length > 1 ? [...reviews, ...reviews] : [...reviews, ...reviews, ...reviews, ...reviews];
  // Pick a speed based on count so the cards don't fly past too fast with few reviews.
  const durationSeconds = Math.max(28, Math.min(60, reviews.length * 8));

  return (
    <section className="reviews-carousel-section">
      <div className="reviews-carousel-layout">
        <div className="reviews-carousel-head">
          <div className="storefront__badge" style={{ color: "var(--sirat-gold-soft)", borderColor: "var(--sirat-gold-soft)", background: "rgba(197, 160, 89, 0.08)" }}>
            <Sparkles size={12} /> Reviews
          </div>
          <h2 className="page-section__title" style={{ marginTop: "0.5rem" }}>Customer Feedback</h2>
          <p className="page-section__text">
            Verified buyers verify our high-grammage materials, structured drapes, and fulfillment speeds.
          </p>
          <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--sirat-muted)", fontSize: "0.78rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16a34a", display: "inline-block", boxShadow: "0 0 0 3px rgba(22, 163, 74, 0.15)" }} />
              Live from {reviews.length} verified {reviews.length === 1 ? "buyer" : "buyers"}
            </span>
          </div>
        </div>

        <div className="reviews-carousel-body">
          <div className="marquee-container reviews-marquee">
            <div
              className="marquee-track marquee-infinite-linear reviews-marquee-track"
              style={{ animationDuration: `${durationSeconds}s` }}
            >
              {looped.map((r, idx) => {
                const productName = r.product?.name;
                const productSlug = r.product?.slug;
                const productImage = pickProductImage(r.product?.images);
                const productHref = productSlug ? `/product/${productSlug}` : null;
                return (
                  <div
                    key={`${r.id || r.name}-${idx}`}
                    className="sirat-panel page-card review-display-card"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <AuthorAvatar name={r.name} avatar={r.author?.avatar} size={44} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <strong style={{ display: "block", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</strong>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "1px" }}>
                          <Stars value={Number(r.rating || 0)} size={11} />
                          <span style={{ fontSize: "0.7rem", color: "var(--sirat-muted)", fontWeight: 600 }}>{Number(r.rating || 0).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    <Quote size={28} style={{ color: "var(--sirat-gold)", opacity: 0.18, margin: "0.4rem 0 -0.4rem", display: "block" }} />

                    <p className="review-quote-text">"{r.comment}"</p>

                    {productName && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--sirat-border)" }}>
                        {productImage ? (
                          productHref ? (
                            <Link to={productHref} style={{ width: "40px", height: "40px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--sirat-border)", display: "block", flexShrink: 0, transition: "transform 0.2s ease" }}>
                              <img src={productImage} alt={productName} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                            </Link>
                          ) : (
                            <div style={{ width: "40px", height: "40px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--sirat-border)", flexShrink: 0 }}>
                              <img src={productImage} alt={productName} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                            </div>
                          )
                        ) : (
                          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "var(--sirat-cream, #FAF9F5)", border: "1px solid var(--sirat-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Quote size={16} style={{ color: "var(--sirat-gold-soft)" }} />
                          </div>
                        )}
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--sirat-muted)" }}>On</div>
                          {productHref ? (
                            <Link to={productHref} style={{ fontSize: "0.8rem", color: "var(--sirat-gold-soft)", textDecoration: "none", fontWeight: 700, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {productName}
                            </Link>
                          ) : (
                            <span style={{ fontSize: "0.8rem", color: "var(--sirat-text)", fontWeight: 600, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{productName}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
