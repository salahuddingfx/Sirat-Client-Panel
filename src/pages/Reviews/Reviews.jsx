import { useState, useEffect, useMemo } from "react";
import { Star, MessageSquareQuote, Loader2, Inbox, ChevronDown, Quote } from "lucide-react";
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

  const filteredReviews = useMemo(() => {
    let list = reviews;
    if (productFilter !== "all") {
      list = list.filter((r) => {
        const id = r.productId || (r.product && r.product.slug) || "unknown";
        return id === productFilter;
      });
    }
    const sorted = [...list];
    if (sort === "highest") sorted.sort((a, b) => Number(b.rating) - Number(a.rating));
    else if (sort === "lowest") sorted.sort((a, b) => Number(a.rating) - Number(b.rating));
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
        <Panel className="page-card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 320px) 1fr", gap: "2rem", alignItems: "center" }}>
            <div style={{ textAlign: "center", borderRight: "1px solid var(--sirat-border)", paddingRight: "2rem" }}>
              <div style={{ fontSize: "3.5rem", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1, color: "var(--sirat-charcoal, #141311)" }}>
                {stats.avg.toFixed(1)}
              </div>
              <div style={{ margin: "0.5rem 0" }}>
                <Stars value={stats.avg} size={20} />
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--sirat-muted)" }}>
                Based on <strong style={{ color: "var(--sirat-text)" }}>{stats.total}</strong> verified {stats.total === 1 ? "review" : "reviews"}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[5, 4, 3, 2, 1].map((s, i) => (
                <StatBar key={s} stars={s} count={stats.distribution[i]} total={stats.total} />
              ))}
            </div>
          </div>
        </Panel>
      )}

      {/* FILTER + SORT ROW */}
      {!loading && !error && reviews.length > 0 && productOptions.length > 2 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 2.4rem 0.65rem 1rem",
                borderRadius: "99px",
                border: "1px solid var(--sirat-border)",
                background: "var(--sirat-surface)",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--sirat-text)",
                appearance: "none",
                cursor: "pointer",
                outline: "none",
                textOverflow: "ellipsis",
              }}
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
              style={{
                width: "100%",
                padding: "0.65rem 2.4rem 0.65rem 1rem",
                borderRadius: "99px",
                border: "1px solid var(--sirat-border)",
                background: "var(--sirat-surface)",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--sirat-text)",
                appearance: "none",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="newest">Newest first</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
            <ChevronDown size={14} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--sirat-muted)" }} />
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--sirat-muted)", marginLeft: "auto" }}>
            Showing {filteredReviews.length} of {reviews.length}
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

      {/* REVIEWS GRID */}
      {!loading && !error && filteredReviews.length > 0 && (
        <div className="quote-grid">
          {filteredReviews.map((r) => {
            const productName = r.product?.name;
            const productSlug = r.product?.slug;
            const productImage = pickProductImage(r.product?.images);
            const date = formatDate(r.createdAt);
            const productHref = productSlug ? `/product/${productSlug}` : null;
            return (
              <Panel key={r.id} className="page-card review-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div className="storefront__badge" style={{ color: "var(--sirat-star)", borderColor: "var(--sirat-star)", background: "rgba(245, 158, 11, 0.05)" }}>
                    <Star size={12} fill="currentColor" /> {Number(r.rating || 0).toFixed(1)} / 5
                  </div>
                  {date && <span style={{ fontSize: "0.72rem", color: "var(--sirat-muted)" }}>{date}</span>}
                </div>

                <Quote size={18} style={{ color: "var(--sirat-gold-soft)", opacity: 0.5, marginBottom: "0.25rem" }} />
                <p className="page-section__text" style={{ marginTop: "0.25rem", lineHeight: 1.6 }}>
                  {r.comment}
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--sirat-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 0 }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--sirat-cream, #FAF9F5)", border: "1px solid var(--sirat-border)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--sirat-gold-soft)", fontSize: "0.85rem", flexShrink: 0 }}>
                      {(r.name || "?").trim().charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <strong style={{ display: "block", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</strong>
                      {productName && (
                        productHref ? (
                          <Link to={productHref} style={{ fontSize: "0.75rem", color: "var(--sirat-gold-soft)", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                            on {productName}
                          </Link>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "var(--sirat-muted)" }}>on {productName}</span>
                        )
                      )}
                    </div>
                  </div>
                  {productImage && productHref && (
                    <Link to={productHref} style={{ flexShrink: 0, width: "44px", height: "44px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--sirat-border)", display: "block" }} title={`View ${productName}`}>
                      <img src={productImage} alt={productName} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                    </Link>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </PageFrame>
  );
}
