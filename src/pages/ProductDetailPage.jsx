import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingBag, Plus, Minus, ArrowLeft, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext";
import { products } from "../data/mockData";
import ProductCard from "../components/ProductCard";
import { Button, Panel } from "../lib/ui";
import SEO from "../components/SEO";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, setCartDrawerOpen } = useCart();

  // Find current product
  const product = useMemo(() => {
    return products.find((p) => p.id === productId) || null;
  }, [productId]);

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Selector states
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Set default variant selections on product change
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || "");
      setSelectedSize(product.sizes?.[0] || "");
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product]);

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

  // Get active variant price delta
  const activeVariant = useMemo(() => {
    return product.variants?.find((v) => v.label === selectedSize) || product.variants?.[0] || null;
  }, [product, selectedSize]);

  const currentPrice = product.price + (activeVariant?.priceDelta || 0);

  const handleAddToCart = () => {
    if (!activeVariant) return;
    addToCart(product, activeVariant, quantity);
    setCartDrawerOpen(true);
  };

  // Find related products (excluding current, same category first)
  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.id !== product.id)
      .sort((a, b) => {
        if (a.category === product.category && b.category !== product.category) return -1;
        if (a.category !== product.category && b.category === product.category) return 1;
        return 0;
      })
      .slice(0, 5); // Display exactly 5 cards in the grid row
  }, [product]);

  // Determine Unsplash image for OG sharing preview
  const previewImage =
    product.name.toLowerCase().includes("lumina") ? "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600" :
    product.name.toLowerCase().includes("nova") ? "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600" :
    product.name.toLowerCase().includes("orbit") ? "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600" :
    product.name.toLowerCase().includes("vector") ? "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600" :
    product.name.toLowerCase().includes("zenith") ? "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600" :
    product.name.toLowerCase().includes("helix") ? "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600" :
    product.name.toLowerCase().includes("chrono") ? "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600" :
    product.name.toLowerCase().includes("matrix") ? "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600" :
    product.name.toLowerCase().includes("apex") ? "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600" :
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600";

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
        <div className="product-detail-media">
          <div className="detail-media-frame">
            {/* Displaying placeholder image dynamically */}
            <div className="detail-image-placeholder" />
            {product.bestSeller && (
              <span className="detail-bestseller-badge">BEST SELLER</span>
            )}
          </div>
        </div>

        {/* Right product configuration panel */}
        <div className="product-detail-info">
          <div className="detail-header-row">
            <span className="product-card-modern__badge">{product.category}</span>
            {product.weight && (
              <span className="weight-badge">{product.weight}</span>
            )}
          </div>

          <h1 className="detail-title">{product.name}</h1>

          {/* Rating */}
          <div className="detail-rating">
            <div className="stars-row" style={{ color: "var(--sirat-star)" }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                  className="star-icon"
                />
              ))}
            </div>
            <span className="rating-text">
              {product.rating.toFixed(1)} <span className="muted">({Math.floor(product.rating * 5)} Customer Reviews)</span>
            </span>
          </div>

          {/* Price Stack */}
          <div className="detail-price-stack">
            <span className="detail-current-price">৳{currentPrice}</span>
            {product.oldPrice && (
              <span className="detail-old-price">৳{product.oldPrice}</span>
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
                      disabled={!v.inStock}
                      className={["quickview-variant-btn", selectedSize === v.label ? "active" : ""].filter(Boolean).join(" ")}
                      onClick={() => setSelectedSize(v.label)}
                    >
                      {v.label}
                      {!v.inStock && <span className="sold-out">Out</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector + Add Actions */}
            <div className="detail-action-row" style={{ marginTop: "1.5rem" }}>
              <div className="quickview-qty-selector">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  <Minus size={12} />
                </button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((q) => q + 1)}>
                  <Plus size={12} />
                </button>
              </div>

              <Button
                style={{ flex: 1 }}
                onClick={handleAddToCart}
                disabled={activeVariant && !activeVariant.inStock}
              >
                <ShoppingBag size={16} style={{ marginRight: "8px" }} /> Add to Cart
              </Button>

              <button
                type="button"
                className={["action-circle-btn detail-wishlist-btn", isWishlisted ? "active-wishlist" : ""].filter(Boolean).join(" ")}
                onClick={() => setIsWishlisted(!isWishlisted)}
                style={{ width: "44px", height: "44px" }}
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
