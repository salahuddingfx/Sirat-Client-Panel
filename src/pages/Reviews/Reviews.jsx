import { useState, useEffect, useMemo } from "react";
import { Star, MessageSquareQuote, Loader2, Inbox, ChevronDown, Quote, Sparkles, Award, Filter, X, Crown } from "lucide-react";
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

const Stars = ({ value = 0, size = 14, color = "var(--sirat-star, #C5A059)" }) => (
  <div style={{ display: "inline-flex", gap: "2px", color }}>
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

const AuthorAvatar = ({ name, avatar, size = 44, ring = false }) => {
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

const StatBar = ({ stars, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="rp-statbar">
      <span className="rp-statbar__label">{stars} <Star size={10} fill="currentColor" /></span>
      <div className="rp-statbar__track">
        <div className="rp-statbar__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="rp-statbar__count">{count}</span>
    </div>
  );
};

// BENTO CARD — renders a review with a variable size
const ReviewBento = ({ review, size = "md" }) => {
  const productName = review?.product?.name;
  const productSlug = review?.product?.slug;
  const productImage = pickProductImage(review?.product?.images);
  const productHref = productSlug ? `/product/${productSlug}` : null;

  if (size === "hero") {
    return (
      <Panel className="rp-bento rp-bento--hero">
        {productImage && (
          <div className="rp-bento__bg" style={{ backgroundImage: `url(${productImage})` }} />
        )}
        <div className="rp-bento__overlay" />
        <Quote size={64} className="rp-bento__bigquote" />
        <div className="rp-bento__content">
          <Stars value={Number(review.rating || 0)} size={18} />
          <p className="rp-bento__hero-text">"{review.comment}"</p>
          <div className="rp-bento__author">
            <AuthorAvatar name={review.name} avatar={review.author?.avatar} size={56} ring />
            <div>
              <strong className="rp-bento__name">{review.name}</strong>
              {productName && (
                <div className="rp-bento__product">
                  <span className="rp-bento__product-label">On</span>
                  {productHref ? (
                    <Link to={productHref} className="rp-bento__product-link">{productName}</Link>
                  ) : (
                    <span className="rp-bento__product-link">{productName}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <Panel className={`rp-bento rp-bento--${size}`}>
      <div className="rp-bento__top">
        <AuthorAvatar name={review.name} avatar={review.author?.avatar} size={size === "lg" ? 48 : 40} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <strong className="rp-bento__name">{review.name}</strong>
          <div className="rp-bento__meta">
            <Stars value={Number(review.rating || 0)} size={11} />
            <span className="rp-bento__rating-num">{Number(review.rating || 0).toFixed(1)}</span>
            {review.createdAt && <span className="rp-bento__date">{formatDate(review.createdAt)}</span>}
          </div>
        </div>
      </div>

      <Quote size={18} className="rp-bento__quote" />
      <p className="rp-bento__text">"{review.comment}"</p>

      {productName && (
        <div className="rp-bento__footer">
          {productImage && productHref ? (
            <Link to={productHref} className="rp-bento__product-img" title={productName}>
              <img src={productImage} alt={productName} loading="lazy" />
            </Link>
          ) : productImage ? (
            <div className="rp-bento__product-img">
              <img src={productImage} alt={productName} loading="lazy" />
            </div>
          ) : null}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="rp-bento__product-label">Reviewed</div>
            {productHref ? (
              <Link to={productHref} className="rp-bento__product-link">{productName}</Link>
            ) : (
              <span className="rp-bento__product-link" style={{ color: "var(--sirat-text)" }}>{productName}</span>
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
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchReviews()
      .then((data) => { if (mounted) setReviews(Array.isArray(data) ? data : []); })
      .catch((err) => {
        if (!mounted) return;
        console.error("Failed to fetch reviews:", err);
        setError(err?.message || "Could not load reviews.");
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const productOptions = useMemo(() => {
    const seen = new Map();
    for (const r of reviews) {
      const id = r.productId || (r.product && r.product.slug) || "unknown";
      if (!seen.has(id)) {
        seen.set(id, { id, name: r.product?.name || "Unknown product" });
      }
    }
    return [{ id: "all", name: "All products" }, ...Array.from(seen.values())];
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    let list = reviews;
    if (productFilter !== "all") {
      list = list.filter((r) => {
        const id = r.productId || (r.product && r.product.slug) || "unknown";
        return id === productFilter;
      });
    }
    if (ratingFilter !== "all") {
      list = list.filter((r) => Math.round(Number(r.rating || 0)) === Number(ratingFilter));
    }
    const sorted = [...list];
    if (sort === "highest") sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    else if (sort === "lowest") sorted.sort((a, b) => Number(a.rating || 0) - Number(b.rating || 0));
    else sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return sorted;
  }, [reviews, productFilter, ratingFilter, sort]);

  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { total: 0, avg: 0, distribution: [0, 0, 0, 0, 0], fivePct: 0, recommendPct: 0 };
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      const bucket = Math.max(1, Math.min(5, Math.round(Number(r.rating || 0))));
      distribution[5 - bucket] += 1;
    });
    return {
      total,
      avg: sum / total,
      distribution,
      fivePct: Math.round((distribution[0] / total) * 100),
      recommendPct: Math.round(reviews.filter((r) => Number(r.rating || 0) >= 4).length / total * 100),
    };
  }, [reviews]);

  // Bento pattern: hero (col-span 2) + lg card, then md cards in 3-col grid
  const bentoReviews = filteredReviews;

  return (
    <PageFrame
      eyebrow="Customer Reviews"
      title="What our community says about Sirat."
      description="Read verified feedback from real customers about imported fabric quality, print durability, and our commitment to honesty."
    >
      <SEO title="Customer Feedback" description="See what verified buyers say about Sirat's stitch design, premium custom puff prints, and delivery." />

      <div className="rp-wrap">
        {/* HERO HEADER */}
        <div className="rp-hero">
          <div>
            <div className="storefront__badge" style={{ color: "var(--sirat-gold-soft)", borderColor: "var(--sirat-gold-soft)", background: "rgba(197, 160, 89, 0.08)" }}>
              <Sparkles size={12} /> The Wall of Love
            </div>
            <h1 className="rp-hero__title">Every review, a real story.</h1>
            <p className="rp-hero__subtitle">
              Honest words from people who bought, wore, washed, and lived in our pieces. No scripts, no staging — just the truth.
            </p>
          </div>
          {reviews.length > 0 && (
            <div className="rp-hero__bigstat">
              <div className="rp-hero__bigstat-num">{stats.avg.toFixed(1)}</div>
              <Stars value={stats.avg} size={20} />
              <div className="rp-hero__bigstat-label">From {stats.total} verified {stats.total === 1 ? "buyer" : "buyers"}</div>
            </div>
          )}
        </div>

        {/* STATS PANEL */}
        {!loading && !error && reviews.length > 0 && (
          <Panel className="rp-stats">
            <div className="rp-stats__left">
              <div className="rp-stats__head">
                <Award size={18} style={{ color: "var(--sirat-gold-soft)" }} />
                <h3>Rating breakdown</h3>
              </div>
              <div className="rp-stats__bars">
                {[5, 4, 3, 2, 1].map((s, i) => (
                  <StatBar key={s} stars={s} count={stats.distribution[i]} total={stats.total} />
                ))}
              </div>
            </div>
            <div className="rp-stats__divider" />
            <div className="rp-stats__highlights">
              <div className="rp-stat-tile">
                <div className="rp-stat-tile__value">{stats.fivePct}%</div>
                <div className="rp-stat-tile__label">5-star reviews</div>
              </div>
              <div className="rp-stat-tile">
                <div className="rp-stat-tile__value">{stats.recommendPct}%</div>
                <div className="rp-stat-tile__label">Would recommend</div>
              </div>
              <div className="rp-stat-tile">
                <div className="rp-stat-tile__value">{stats.total}</div>
                <div className="rp-stat-tile__label">Total reviews</div>
              </div>
            </div>
          </Panel>
        )}

        {/* FILTERS */}
        {!loading && !error && reviews.length > 0 && (
          <div className="rp-filters">
            <div className="rp-filters__left">
              <Filter size={14} style={{ color: "var(--sirat-muted)" }} />
              <span className="rp-filters__label">Filter</span>
              <div className="rp-filters__group">
                <div style={{ position: "relative" }}>
                  <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} className="rp-filter-select">
                    {productOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="rp-filter-select__caret" />
                </div>
                <div style={{ position: "relative" }}>
                  <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="rp-filter-select">
                    <option value="all">All ratings</option>
                    <option value="5">5 stars only</option>
                    <option value="4">4 stars only</option>
                    <option value="3">3 stars only</option>
                    <option value="2">2 stars only</option>
                    <option value="1">1 star only</option>
                  </select>
                  <ChevronDown size={13} className="rp-filter-select__caret" />
                </div>
                <div style={{ position: "relative" }}>
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="rp-filter-select">
                    <option value="newest">Newest first</option>
                    <option value="highest">Highest rated</option>
                    <option value="lowest">Lowest rated</option>
                  </select>
                  <ChevronDown size={13} className="rp-filter-select__caret" />
                </div>
              </div>
              {(productFilter !== "all" || ratingFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => { setProductFilter("all"); setRatingFilter("all"); }}
                  className="rp-filters__clear"
                >
                  <X size={12} /> Clear filters
                </button>
              )}
            </div>
            <div className="rp-filters__count">
              <strong>{filteredReviews.length}</strong> {filteredReviews.length === 1 ? "review" : "reviews"}
            </div>
          </div>
        )}

        {/* STATES */}
        {loading && (
          <div className="rp-skeletons">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Panel key={i} className="rp-skeleton-card">
                <div className="skeleton" style={{ height: "44px", width: "44px", borderRadius: "50%" }} />
                <div className="skeleton" style={{ height: "12px", width: "75%", marginTop: "12px" }} />
                <div className="skeleton" style={{ height: "12px", width: "100%", marginTop: "6px" }} />
                <div className="skeleton" style={{ height: "12px", width: "60%", marginTop: "6px" }} />
              </Panel>
            ))}
            <div className="rp-loading-text">
              <Loader2 size={14} className="spin" /> Loading customer reviews…
            </div>
          </div>
        )}

        {!loading && error && (
          <Panel className="rp-empty">
            <MessageSquareQuote size={32} style={{ color: "var(--sirat-muted)", marginBottom: "0.75rem" }} />
            <h3>Couldn't load reviews</h3>
            <p>{error}</p>
          </Panel>
        )}

        {!loading && !error && reviews.length === 0 && (
          <Panel className="rp-empty">
            <Inbox size={36} style={{ color: "var(--sirat-gold-soft)", marginBottom: "0.75rem" }} />
            <h3>No reviews yet</h3>
            <p>Once our customers start leaving feedback on their purchases, you'll see their verified reviews here.</p>
          </Panel>
        )}

        {!loading && !error && filteredReviews.length === 0 && reviews.length > 0 && (
          <Panel className="rp-empty">
            <p>No reviews match these filters. Try clearing them.</p>
          </Panel>
        )}

        {/* BENTO GRID */}
        {!loading && !error && bentoReviews.length > 0 && (
          <div className="rp-bento-grid">
            {bentoReviews.map((r, idx) => {
              // Pattern: first review is hero, then 1 large, then alternating
              let size = "md";
              if (idx === 0 && bentoReviews.length > 1) size = "hero";
              else if (idx === 1 && bentoReviews.length > 2) size = "lg";
              else if ((idx - 2) % 7 === 0 && bentoReviews.length > 5) size = "lg";
              return <ReviewBento key={r.id} review={r} size={size} />;
            })}
          </div>
        )}
      </div>
    </PageFrame>
  );
}
