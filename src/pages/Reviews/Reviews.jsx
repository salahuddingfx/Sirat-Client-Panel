import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Star, MessageSquareQuote, Loader2, Inbox, ChevronDown, Quote, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import PageFrame from "@components/layout/PageFrame";
import { Panel } from "@components/ui";
import SEO from "@components/layout/SEO";
import { fetchReviews } from "@api/queries";

const formatDate = (input) => {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const pickProductImage = (images) => {
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && first.url) return first.url;
  }
  return null;
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

const StatBar = ({ stars, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.78rem" }}>
      <span style={{ width: "44px", color: "var(--sirat-muted)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
        {stars} <Star size={11} fill="currentColor" color="var(--sirat-star)" />
      </span>
      <div style={{ flex: 1, height: "6px", background: "var(--sirat-border)", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "var(--sirat-gold)", borderRadius: "99px", transition: "width 0.4s ease" }} />
      </div>
      <span style={{ width: "32px", textAlign: "right", color: "var(--sirat-muted)", fontWeight: 600 }}>{count}</span>
    </div>
  );
};

const AuthorAvatar = ({ name, avatar, size = 40 }) => {
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
          border: "1.5px solid var(--sirat-border-strong)",
          background: "var(--sirat-cream, #FAF9F5)",
          flexShrink: 0,
          display: "block",
        }}
        loading="lazy"
        onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextElementSibling && (e.currentTarget.nextElementSibling.style.display = "flex"); }}
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
        border: "1.5px solid var(--sirat-border-strong)",
        flexShrink: 0,
        letterSpacing: "0.02em",
      }}
    >
      {(name || "?").trim().charAt(0).toUpperCase()}
    </div>
  );
};

const FeaturedSlider = ({ reviews }) => {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons, reviews.length]);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-slider-card]");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (reviews.length === 0) return null;

  return (
    <div className="reviews-featured">
      <div className="reviews-featured__head">
        <div>
          <div className="storefront__badge" style={{ color: "var(--sirat-gold-soft)", borderColor: "var(--sirat-gold-soft)", background: "rgba(197, 160, 89, 0.08)" }}>
            <Sparkles size={12} /> Featured
          </div>
          <h2 className="page-section__title" style={{ marginTop: "0.5rem", fontSize: "1.4rem" }}>What buyers are saying</h2>
        </div>
        <div className="reviews-featured__nav">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canPrev}
            aria-label="Previous reviews"
            className="reviews-featured__arrow"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canNext}
            aria-label="Next reviews"
            className="reviews-featured__arrow"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="reviews-featured__track" ref={trackRef}>
        {reviews.map((r) => {
          const productName = r.product?.name;
          const productSlug = r.product?.slug;
          const productImage = pickProductImage(r.product?.images);
          const productHref = productSlug ? `/product/${productSlug}` : null;
          return (
            <Panel key={r.id} data-slider-card className="page-card review-featured-card">
              <div className="review-featured-card__top">
                <AuthorAvatar name={r.name} avatar={r.author?.avatar} size={52} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <strong style={{ display: "block", fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</strong>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "2px" }}>
                    <Stars value={Number(r.rating || 0)} size={13} />
                    <span style={{ fontSize: "0.72rem", color: "var(--sirat-muted)" }}>{formatDate(r.createdAt)}</span>
                  </div>
                </div>
              </div>

              <Quote size={22} className="review-featured-card__quote" />

              <p className="page-section__text" style={{ lineHeight: 1.6, fontSize: "0.92rem", flex: 1 }}>
                {r.comment}
              </p>

              {productName && (
                <div className="review-featured-card__product">
                  {productImage ? (
                    productHref ? (
                      <Link to={productHref} className="review-featured-card__product-img" title={`View ${productName}`}>
                        <img src={productImage} alt={productName} loading="lazy" />
                      </Link>
                    ) : (
                      <div className="review-featured-card__product-img">
                        <img src={productImage} alt={productName} loading="lazy" />
                      </div>
                    )
                  ) : (
                    <div className="review-featured-card__product-img review-featured-card__product-img--placeholder">
                      <MessageSquareQuote size={20} />
                    </div>
                  )}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--sirat-muted)" }}>Reviewed</div>
                    {productHref ? (
                      <Link to={productHref} className="review-featured-card__product-name">{productName}</Link>
                    ) : (
                      <span className="review-featured-card__product-name" style={{ color: "var(--sirat-text)" }}>{productName}</span>
                    )}
                  </div>
                </div>
              )}
            </Panel>
          );
        })}
      </div>
    </div>
  );
};

const ReviewListCard = ({ r }) => {
  const productName = r.product?.name;
  const productSlug = r.product?.slug;
  const productImage = pickProductImage(r.product?.images);
  const productHref = productSlug ? `/product/${productSlug}` : null;
  return (
    <Panel className="page-card review-card">
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.85rem" }}>
        <AuthorAvatar name={r.name} avatar={r.author?.avatar} size={44} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <strong style={{ display: "block", fontSize: "0.92rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</strong>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "2px" }}>
            <Stars value={Number(r.rating || 0)} size={12} />
            <span style={{ fontSize: "0.72rem", color: "var(--sirat-muted)" }}>{formatDate(r.createdAt)}</span>
          </div>
        </div>
        <div className="storefront__badge" style={{ color: "var(--sirat-star)", borderColor: "var(--sirat-star)", background: "rgba(245, 158, 11, 0.05)", fontSize: "0.7rem", padding: "4px 8px" }}>
          {Number(r.rating || 0).toFixed(1)}
        </div>
      </div>

      <Quote size={16} style={{ color: "var(--sirat-gold-soft)", opacity: 0.5, marginBottom: "0.25rem" }} />
      <p className="page-section__text" style={{ marginTop: "0.25rem", lineHeight: 1.6, fontSize: "0.88rem" }}>
        {r.comment}
      </p>

      {productName && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px solid var(--sirat-border)" }}>
          {productImage && productHref ? (
            <Link to={productHref} style={{ width: "40px", height: "40px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--sirat-border)", display: "block", flexShrink: 0 }}>
              <img src={productImage} alt={productName} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
            </Link>
          ) : productImage ? (
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--sirat-border)", flexShrink: 0 }}>
              <img src={productImage} alt={productName} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
            </div>
          ) : null}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--sirat-muted)" }}>On</div>
            {productHref ? (
              <Link to={productHref} style={{ fontSize: "0.8rem", color: "var(--sirat-gold-soft)", textDecoration: "none", fontWeight: 600, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {productName}
              </Link>
            ) : (
              <span style={{ fontSize: "0.8rem", color: "var(--sirat-text)", fontWeight: 600, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{productName}</span>
            )}
          </div>
        </div>
      )}
    </Panel>
  );
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productFilter, setProductFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchReviews()
      .then((data) => {
        if (!mounted) return;
        setReviews(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("Failed to fetch reviews:", err);
        setError(err?.message || "Could not load reviews.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const productOptions = useMemo(() => {
    const seen = new Map();
    for (const r of reviews) {
      const id = r.productId || (r.product && r.product.slug) || "unknown";
      if (!seen.has(id)) {
        seen.set(id, {
          id,
          name: r.product?.name || "Unknown product",
          slug: r.product?.slug,
        });
      }
    }
    return [{ id: "all", name: "All Products" }, ...Array.from(seen.values())];
  }, [reviews]);

  const featuredReviews = useMemo(() => {
    // Highest-rated first, then take the first 8 (or all if fewer).
    return [...reviews]
      .sort((a, b) => {
        const r = Number(b.rating || 0) - Number(a.rating || 0);
        if (r !== 0) return r;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      })
      .slice(0, 8);
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    let list = reviews;
    if (productFilter !== "all") {
      list = list.filter((r) => {
        const id = r.productId || (r.product && r.product.slug) || "unknown";
        return id === productFilter;
      });
    }
    const sorted = [...list];
    if (sort === "highest") sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    else if (sort === "lowest") sorted.sort((a, b) => Number(a.rating || 0) - Number(b.rating || 0));
    else sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return sorted;
  }, [reviews, productFilter, sort]);

  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { total: 0, avg: 0, distribution: [0, 0, 0, 0, 0] };
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      const bucket = Math.max(1, Math.min(5, Math.round(Number(r.rating || 0))));
      distribution[5 - bucket] += 1;
    });
    return { total, avg: sum / total, distribution };
  }, [reviews]);

  return (
    <PageFrame
      eyebrow="Customer Reviews"
      title="What our community says about Sirat."
      description="Read verified feedback from real customers about imported fabric quality, print durability, and our commitment to honesty."
    >
      <SEO title="Customer Feedback" description="See what verified buyers say about Sirat's stitch design, premium custom puff prints, and delivery." />

      {/* SUMMARY PANEL */}
      {!loading && !error && reviews.length > 0 && (
        <Panel className="page-card" style={{ marginBottom: "1.75rem" }}>
          <div className="reviews-summary">
            <div className="reviews-summary__avg">
              <div style={{ fontSize: "3.75rem", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1, color: "var(--sirat-charcoal, #141311)" }}>
                {stats.avg.toFixed(1)}
              </div>
              <div style={{ margin: "0.5rem 0" }}>
                <Stars value={stats.avg} size={22} />
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--sirat-muted)" }}>
                Based on <strong style={{ color: "var(--sirat-text)" }}>{stats.total}</strong> verified {stats.total === 1 ? "review" : "reviews"}
              </div>
            </div>
            <div className="reviews-summary__bars">
              {[5, 4, 3, 2, 1].map((s, i) => (
                <StatBar key={s} stars={s} count={stats.distribution[i]} total={stats.total} />
              ))}
            </div>
          </div>
        </Panel>
      )}

      {/* FEATURED HORIZONTAL SLIDER */}
      {!loading && !error && featuredReviews.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <FeaturedSlider reviews={featuredReviews} />
        </div>
      )}

      {/* ALL REVIEWS SECTION HEADER */}
      {!loading && !error && reviews.length > 0 && (
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", margin: "0.5rem 0 1rem" }}>
          <h2 className="page-section__title" style={{ fontSize: "1.25rem" }}>All Reviews</h2>
          <span style={{ fontSize: "0.82rem", color: "var(--sirat-muted)" }}>{reviews.length} total</span>
        </div>
      )}

      {/* FILTER + SORT ROW */}
      {!loading && !error && reviews.length > 0 && productOptions.length > 2 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="reviews-filter-select"
            >
              {productOptions.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown size={14} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--sirat-muted)" }} />
          </div>
          <div style={{ position: "relative", flex: "0 1 180px" }}>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="reviews-filter-select"
            >
              <option value="newest">Newest first</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
            <ChevronDown size={14} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--sirat-muted)" }} />
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--sirat-muted)", marginLeft: "auto" }}>
            Showing {filteredReviews.length}
          </div>
        </div>
      )}

      {/* STATES */}
      {loading && (
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {[0, 1, 2, 3].map((i) => (
            <Panel key={i} className="page-card">
              <div className="skeleton" style={{ height: "16px", width: "90px", marginBottom: "0.75rem" }} />
              <div className="skeleton" style={{ height: "12px", width: "100%", marginBottom: "6px" }} />
              <div className="skeleton" style={{ height: "12px", width: "85%", marginBottom: "6px" }} />
              <div className="skeleton" style={{ height: "12px", width: "70%", marginBottom: "1rem" }} />
              <div className="skeleton" style={{ height: "14px", width: "120px" }} />
            </Panel>
          ))}
          <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--sirat-muted)", fontSize: "0.85rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
            <Loader2 size={14} className="spin" /> Loading customer reviews…
          </div>
        </div>
      )}

      {!loading && error && (
        <Panel className="page-card" style={{ textAlign: "center", padding: "2rem" }}>
          <MessageSquareQuote size={28} style={{ color: "var(--sirat-muted)", marginBottom: "0.5rem" }} />
          <h3 style={{ marginBottom: "0.25rem" }}>Couldn’t load reviews</h3>
          <p style={{ color: "var(--sirat-muted)", fontSize: "0.9rem" }}>{error}</p>
        </Panel>
      )}

      {!loading && !error && reviews.length === 0 && (
        <Panel className="page-card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <Inbox size={32} style={{ color: "var(--sirat-gold-soft)", marginBottom: "0.75rem" }} />
          <h3 style={{ marginBottom: "0.25rem" }}>No reviews yet</h3>
          <p style={{ color: "var(--sirat-muted)", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto" }}>
            Once our customers start leaving feedback on their purchases, you’ll see their verified reviews here.
          </p>
        </Panel>
      )}

      {!loading && !error && filteredReviews.length === 0 && reviews.length > 0 && (
        <Panel className="page-card" style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ color: "var(--sirat-muted)" }}>No reviews match this filter.</p>
        </Panel>
      )}

      {/* ALL REVIEWS GRID */}
      {!loading && !error && filteredReviews.length > 0 && (
        <div className="quote-grid">
          {filteredReviews.map((r) => <ReviewListCard key={r.id} r={r} />)}
        </div>
      )}
    </PageFrame>
  );
}
