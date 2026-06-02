import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { m } from "framer-motion";
import { Star, Heart, ShoppingCart, Plus, Minus, ArrowLeft, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { useCart } from "@app/providers/CartContext";
import { products } from "@data/mockData";
import ProductCard from "@features/products/components/ProductCard";
import { Button, Panel } from "@components/ui";
import SEO from "@components/layout/SEO";
import { fetchProductBySlug, fetchProductReviews, submitReview } from "@api/queries";
import ProductImageGallery from "./ProductImageGallery";

// Custom StarRatingSelector supporting half stars
function StarRatingSelector({ rating, onChange }) {
  const [hoverRating, setHoverRating] = useState(null);
  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isFull = activeRating >= starIndex;
        const isHalf = activeRating === starIndex - 0.5;

        return (
          <div
            key={starIndex}
            style={{
              position: "relative",
              width: "28px",
              height: "28px",
              display: "inline-block",
            }}
            onMouseLeave={() => setHoverRating(null)}
          >
            {/* Display the Star Icon */}
            <div style={{ color: "var(--sirat-star)" }}>
              {isFull ? (
                <Star size={26} fill="currentColor" />
              ) : isHalf ? (
                <div style={{ position: "relative" }}>
                  <Star size={26} fill="none" stroke="currentColor" />
                  <div style={{ position: "absolute", inset: 0, width: "50%", overflow: "hidden", color: "currentColor" }}>
                    <Star size={26} fill="currentColor" stroke="currentColor" />
                  </div>
                </div>
              ) : (
                <Star size={26} fill="none" stroke="currentColor" />
              )}
            </div>

            {/* Click/Hover Zones */}
            {/* Left Zone (Half Star) */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "50%",
                zIndex: 5,
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoverRating(starIndex - 0.5)}
              onClick={() => onChange(starIndex - 0.5)}
            />
            {/* Right Zone (Full Star) */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "50%",
                zIndex: 5,
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoverRating(starIndex)}
              onClick={() => onChange(starIndex)}
            />
          </div>
        );
      })}
      <span style={{ marginLeft: "0.5rem", fontWeight: "700", color: "var(--sirat-gold-soft)" }}>
        {activeRating.toFixed(1)} / 5.0
      </span>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity, setCartDrawerOpen, triggerToast } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Find current product from API or mock
  useEffect(() => {
    setLoading(true);
    fetchProductBySlug(slug)
      .then((data) => {
        if (data) setProduct(data);
      })
      .catch((err) => {
        console.warn("API fetch failed, trying mock data:", err);
        const mockProduct = products.find((p) => p.slug === slug || p.id === slug);
        if (mockProduct) setProduct(mockProduct);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Selector states
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Reviews state
  const [reviews, setReviews] = useState([]);

  // Load reviews from API
  useEffect(() => {
    if (product?.id) {
      fetchProductReviews(product.id)
        .then(data => {
            if (data && data.length > 0) {
                setReviews(data);
            } else {
                // Fallback seed data if no reviews in DB
                setReviews([
                    { _id: 1, name: "Tanvir Ahmed", rating: 5.0, createdAt: "2026-05-12T00:00:00Z", comment: "কাপড়ের ফিনিশিং এবং থিকনেস অসাধারণ! কাস্টম প্রিন্ট অনেক চমৎকার লেগেছে।" },
                    { _id: 2, name: "Salahuddin", rating: 4.5, createdAt: "2026-05-18T00:00:00Z", comment: "Comfortable and sits perfectly. Delivery was fast and packed well." }
                ]);
            }
        })
        .catch(err => console.error("Failed to load reviews:", err));
    }
  }, [product?.id]);

  // New review input states
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5.0);
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  // Set default variant selections on product change
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || "");
      setSelectedSize(product.sizes?.[0] || "");
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product]);

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  // Get active variant price delta
  const activeVariant = useMemo(() => {
    if (!product) return null;
    return product.variants?.find((v) => v.label === selectedSize) || product.variants?.[0] || null;
  }, [product, selectedSize]);

  // Find if this variant is already in the cart
  const cartItem = useMemo(() => {
    if (!product || !activeVariant) return null;
    return cartItems.find(
      (item) => item.product.id === product.id && item.variant.id === activeVariant.id
    );
  }, [cartItems, product, activeVariant]);

  // Find related products (excluding current, same category first)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id)
      .sort((a, b) => {
        if (a.category === product.category && b.category !== product.category) return -1;
        if (a.category !== product.category && b.category === product.category) return 1;
        return 0;
      })
      .slice(0, 5); // Display exactly 5 cards in the grid row
  }, [product]);

  if (loading) {
    return (
      <div className="storefront__content" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="loading-spinner">
          <div className="spinner-dot"></div>
          <p style={{ marginTop: "1rem", color: "var(--sirat-muted)" }}>Initializing garment spec...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="storefront__content">
        <SEO title="Product Not Found" description="The streetwear garment could not be found." />
        <div className="shop-empty-state sirat-panel" style={{ padding: "4rem 2rem" }}>
          <h3>Garment Not Found</h3>
          <p className="page-section__text">
            The streetwear piece you are looking for does not exist or has been removed from the drop queue.
          </p>
          <Button onClick={() => navigate("/shop")} style={{ marginTop: "1rem" }}>
            Return to Shop
          </Button>
        </div>
      </div>
    );
  }

  const currentPrice = product.price + (activeVariant?.priceDelta || 0);

  const handleAddToCart = () => {
    if (!activeVariant) return;
    addToCart(product, activeVariant, quantity);
  };

  const handleBuyNow = () => {
    if (!activeVariant) return;
    addToCart(product, activeVariant, quantity, false);
    navigate("/checkout");
  };

  // OG sharing preview
  const previewImage = product.images?.[0] || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600";

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReviewName || !newReviewComment) {
      triggerToast("Please fill in your name and comment.", "warning");
      return;
    }
    
    setIsReviewSubmitting(true);
    try {
        const payload = {
            product: product.id,
            name: newReviewName,
            rating: newReviewRating,
            comment: newReviewComment
        };
        const res = await submitReview(payload);
        if (res.success) {
            setNewReviewName("");
            setNewReviewComment("");
            setNewReviewRating(5.0);
            triggerToast("রিভিউটি সফলভাবে পাঠানো হয়েছে! এডমিন অ্যাপ্রুভ করলে এটি দেখা যাবে।", "success");
        }
    } catch (err) {
        console.error("Review submission failed:", err);
        triggerToast("Failed to submit review. Please try again.", "error");
    } finally {
        setIsReviewSubmitting(false);
    }
  };

  return (
    <div className="storefront__content product-detail-page">
      <SEO title={`${product.name}`} description={product.description} image={previewImage} />
      {/* Breadcrumbs Navigation */}
      <nav className="detail-breadcrumbs">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="breadcrumbs-links">
          <Link to="/">Home</Link>
          <span className="separator">-&gt;</span>
          <Link to="/shop">Shop</Link>
          <span className="separator">-&gt;</span>
          <span className="current-crumb">{product.name}</span>
        </div>
      </nav>

      {/* Main product spec sheet */}
      <div className="product-detail-grid">
        {/* Left media visual panel */}
        <ProductImageGallery images={product.images} productName={product.name} />

        {/* Right product configuration panel */}
        <div className="product-detail-info">
          <div className="detail-header-row">
            <span className="product-card-modern__badge">{product.category}</span>
            {product.weight && (
              <span className="weight-badge">{product.weight} kg</span>
            )}
          </div>

          <h1 className="detail-title">{product.name}</h1>

          {/* Rating */}
          <div className="detail-rating">
            <div className="stars-row" style={{ color: "var(--sirat-star)", display: "flex", gap: "0.15rem" }}>
              {[...Array(5)].map((_, i) => {
                const isFull = averageRating >= i + 1;
                const isHalf = averageRating >= i + 0.5 && averageRating < i + 1;
                return (
                  <div key={i} style={{ position: "relative", display: "inline-block", width: "16px", height: "16px" }}>
                    {isFull ? (
                      <Star size={16} fill="currentColor" />
                    ) : isHalf ? (
                      <div style={{ position: "relative" }}>
                        <Star size={16} fill="none" stroke="currentColor" />
                        <div style={{ position: "absolute", inset: 0, width: "50%", overflow: "hidden", color: "currentColor" }}>
                          <Star size={16} fill="currentColor" stroke="currentColor" />
                        </div>
                      </div>
                    ) : (
                      <Star size={16} fill="none" stroke="currentColor" />
                    )}
                  </div>
                );
              })}
            </div>
            <span className="rating-text">
              {averageRating.toFixed(1)} <span className="muted">({reviews.length} Customer Reviews)</span>
            </span>
          </div>

          {/* Price Stack */}
          <div className="detail-price-stack">
            <span className="detail-current-price">{'\u09F3'}{currentPrice}</span>
            {product.oldPrice && (
              <span className="detail-old-price">{'\u09F3'}{product.oldPrice}</span>
            )}
          </div>

          <p className="detail-description">{product.description}</p>

          <hr className="detail-divider" />

          {/* Configuration Form */}
          <div className="detail-configs">
            {/* Colors Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="config-group">
                <span className="config-label">Select Color:</span>
                <div className="colors-swatch-list">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={["color-swatch-dot", selectedColor === color ? "active" : ""].filter(Boolean).join(" ")}
                      style={{ backgroundColor: color, width: "20px", height: "20px" }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="config-group" style={{ marginTop: "1rem" }}>
                <span className="config-label">Select Size:</span>
                <div className="quickview-variants-grid">
                  {product.variants?.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      disabled={!v.stock || v.stock < 1}
                      className={["quickview-variant-btn", selectedSize === v.label ? "active" : ""].filter(Boolean).join(" ")}
                      onClick={() => setSelectedSize(v.label)}
                    >
                      {v.label}
                      {(!v.stock || v.stock < 1) && <span className="sold-out">Out</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector + Add Actions */}
            <div className="detail-action-row" style={{ marginTop: "1.5rem" }}>
              <div className="quickview-qty-selector">
                <button 
                  type="button" 
                  onClick={() => {
                    if (cartItem) {
                      updateQuantity(product.id, activeVariant.id, cartItem.quantity - 1);
                    } else {
                      setQuantity((q) => Math.max(1, q - 1));
                    }
                  }}
                >
                  <Minus size={12} />
                </button>
                <span>{cartItem ? cartItem.quantity : quantity}</span>
                <button 
                  type="button" 
                  onClick={() => {
                    if (cartItem) {
                      updateQuantity(product.id, activeVariant.id, cartItem.quantity + 1);
                    } else {
                      setQuantity((q) => q + 1);
                    }
                  }}
                >
                  <Plus size={12} />
                </button>
              </div>

              <Button
                variant="outline"
                style={{ flex: 1, minHeight: "48px" }}
                onClick={handleAddToCart}
                disabled={activeVariant && (!activeVariant.stock || activeVariant.stock < 1)}
              >
                <ShoppingCart size={16} style={{ marginRight: "8px" }} /> Add to Cart
              </Button>

              <Button
                style={{ flex: 1, minHeight: "48px", display: "flex", alignItems: "center", justifyContent: "center" }}
                onClick={handleBuyNow}
                disabled={activeVariant && (!activeVariant.stock || activeVariant.stock < 1)}
              >
                <Truck size={16} style={{ marginRight: "8px" }} /> Order Now
              </Button>

              <button
                type="button"
                className={["action-circle-btn detail-wishlist-btn", isWishlisted ? "active-wishlist" : ""].filter(Boolean).join(" ")}
                onClick={() => setIsWishlisted(!isWishlisted)}
                style={{ width: "48px", height: "48px", flexShrink: 0 }}
                title="Add to Wishlist"
              >
                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <hr className="detail-divider" />

          {/* Assurances Proposition */}
          <div className="detail-assurances">
            <div className="assurance-item">
              <Truck size={16} className="icon" />
              <span>Free Next-Day Delivery across Bangladesh</span>
            </div>
            <div className="assurance-item">
              <ShieldCheck size={16} className="icon" />
              <span>Authentic Sirat Craft & Stitch Assured</span>
            </div>
            <div className="assurance-item">
              <Sparkles size={16} className="icon" />
              <span>Limited Drop Capsule — No Restocks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Reviews Section */}
      <section className="product-reviews-section" style={{ marginTop: "4rem" }}>
        <div className="section-header" style={{ marginBottom: "2rem" }}>
          <p className="section-header__eyebrow">Customer feedback</p>
          <h2>Ratings & Reviews</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(1.25rem, 4vw, 2.5rem)", marginBottom: "3rem" }}>
          {/* Rating Summary column */}
          <Panel style={{ padding: "clamp(1rem, 4vw, 2rem)" }}>
            <h3 style={{ margin: "0 0 1rem" }}>Product Summary</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <strong style={{ fontSize: "3.5rem", fontWeight: "850", color: "var(--sirat-gold-soft)", lineHeight: "1" }}>
                {averageRating.toFixed(1)}
              </strong>
              <div>
                <div style={{ color: "var(--sirat-star)", display: "flex", gap: "0.2rem", marginBottom: "0.25rem" }}>
                  {[...Array(5)].map((_, i) => {
                    const isFull = averageRating >= i + 1;
                    const isHalf = averageRating >= i + 0.5 && averageRating < i + 1;
                    return (
                      <div key={i} style={{ position: "relative", display: "inline-block", width: "18px", height: "18px" }}>
                        {isFull ? (
                          <Star size={18} fill="currentColor" />
                        ) : isHalf ? (
                          <div style={{ position: "relative" }}>
                            <Star size={18} fill="none" stroke="currentColor" />
                            <div style={{ position: "absolute", inset: 0, width: "50%", overflow: "hidden", color: "currentColor" }}>
                              <Star size={18} fill="currentColor" stroke="currentColor" />
                            </div>
                          </div>
                        ) : (
                          <Star size={18} fill="none" stroke="currentColor" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <span style={{ fontSize: "0.85rem", color: "var(--sirat-muted)" }}>Based on {reviews.length} reviews</span>
              </div>
            </div>

            {/* Stars distributions bars */}
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.85rem" }}>
                    <span style={{ width: "50px", textAlign: "right" }}>{stars} Star</span>
                    <div style={{ flex: 1, height: "8px", background: "var(--sirat-bg)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: `${percentage}%`, height: "100%", background: "var(--sirat-gold)", borderRadius: "4px" }} />
                    </div>
                    <span style={{ width: "35px", color: "var(--sirat-muted)" }}>{Math.round(percentage)}%</span>
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* Review submission form column */}
          <Panel style={{ padding: "clamp(1rem, 4vw, 2rem)" }}>
            <h3 style={{ margin: "0 0 1rem" }}>Write a Review</h3>
            <form onSubmit={handleSubmitReview} style={{ display: "grid", gap: "1rem" }}>
              <div className="form-group">
                <span style={{ fontSize: "0.85rem", fontWeight: "700", display: "block", marginBottom: "0.45rem" }}>Rating * (Half-stars supported)</span>
                <StarRatingSelector rating={newReviewRating} onChange={setNewReviewRating} />
              </div>

              <div className="form-group">
                <label htmlFor="rev-name" style={{ fontSize: "0.85rem", fontWeight: "700", display: "block", marginBottom: "0.45rem" }}>Your Name *</label>
                <input
                  id="rev-name"
                  type="text"
                  required
                  style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--sirat-border)", background: "var(--sirat-surface)" }}
                  placeholder="e.g. Tanvir Ahmed"
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="rev-comment" style={{ fontSize: "0.85rem", fontWeight: "700", display: "block", marginBottom: "0.45rem" }}>Review Comments *</label>
                <textarea
                  id="rev-comment"
                  required
                  rows={3}
                  style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--sirat-border)", background: "var(--sirat-surface)", resize: "vertical" }}
                  placeholder="Share your thoughts about this garment..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={isReviewSubmitting} style={{ width: "max-content", marginTop: "0.5rem" }}>
                {isReviewSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </Panel>
        </div>

        {/* Reviews List */}
        <h3 style={{ margin: "2rem 0 1rem" }}>Customer Reviews ({reviews.length})</h3>
        <div style={{ display: "grid", gap: "1.25rem" }}>
          {reviews.map((rev) => (
            <Panel key={rev._id} style={{ padding: "clamp(0.85rem, 3vw, 1.25rem)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div>
                  <strong style={{ display: "block", fontSize: "0.95rem" }}>{rev.name}</strong>
                  <span style={{ fontSize: "0.78rem", color: "var(--sirat-muted)" }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
                
                {/* Review Star Icons */}
                <div style={{ color: "var(--sirat-star)", display: "flex", gap: "0.15rem" }}>
                  {[...Array(5)].map((_, i) => {
                    const isFull = rev.rating >= i + 1;
                    const isHalf = rev.rating >= i + 0.5 && rev.rating < i + 1;
                    return (
                      <div key={i} style={{ position: "relative", display: "inline-block", width: "14px", height: "14px" }}>
                        {isFull ? (
                          <Star size={14} fill="currentColor" />
                        ) : isHalf ? (
                          <div style={{ position: "relative" }}>
                            <Star size={14} fill="none" stroke="currentColor" />
                            <div style={{ position: "absolute", inset: 0, width: "50%", overflow: "hidden", color: "currentColor" }}>
                              <Star size={14} fill="currentColor" stroke="currentColor" />
                            </div>
                          </div>
                        ) : (
                          <Star size={14} fill="none" stroke="currentColor" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <p style={{ margin: "0", fontSize: "0.9rem", color: "var(--sirat-muted)", lineHeight: "1.5" }}>
                {rev.comment}
              </p>
            </Panel>
          ))}
        </div>
      </section>

      {/* Related Products Grid */}
      <section className="related-products-section" style={{ marginTop: "4rem" }}>
        <div className="section-header" style={{ marginBottom: "1.5rem" }}>
          <p className="section-header__eyebrow">Complementary drops</p>
          <h2>You May Also Like</h2>
        </div>
        <div className="product-grid">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
