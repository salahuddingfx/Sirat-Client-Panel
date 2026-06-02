import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { m } from "framer-motion";
import { Heart, ShoppingCart, Star, Truck } from "lucide-react";
import { useCart } from "@app/providers/CartContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, setCartDrawerOpen } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.variants?.[0]?.label || "");

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const selectedVariant = product.variants?.find((v) => v.label === selectedSize) || product.variants?.[0] || { id: "default", label: "M", priceDelta: 0, stock: 0 };
    addToCart(product, selectedVariant, 1);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    const selectedVariant = product.variants?.find((v) => v.label === selectedSize) || product.variants?.[0] || { id: "default", label: "M", priceDelta: 0, stock: 0 };
    addToCart(product, selectedVariant, 1, false);
    navigate("/checkout");
  };

  return (
    <m.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.18 }}
      className="product-card-modern"
      onClick={() => navigate(`/product/${product.slug}`)}
      style={{ cursor: "pointer" }}
      >
      {/* Product Image Frame */}
      <div className="product-card-modern__media">
        <img 
          src={product.images?.[0] || product.image} 
          alt={product.name} 
          className="product-card-modern__image" 
          loading="lazy" 
        />
        {product.bestSeller && (
          <span className="product-card-modern__bestseller-badge">BEST SELLER</span>
        )}
      </div>

      {/* Product Card Details */}
      <div className="product-card-modern__body">
        <div className="product-card-modern__header-row">
          <h3 className="product-card-modern__title">{product.name}</h3>
          {product.weight && (
            <span className="product-card-modern__weight-badge">{product.weight}</span>
          )}
        </div>

        {/* Rating Stars */}
        <div className="product-card-modern__rating">
          <div className="stars-row" style={{ color: "var(--sirat-star)" }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                className="star-icon"
              />
            ))}
          </div>
          <span className="rating-val">
            {product.rating.toFixed(1)} <span className="rating-count">({Math.floor(product.rating * 5)})</span>
          </span>
        </div>

        {/* Short description */}
        <p className="product-card-modern__copy">{product.description}</p>

        {/* Color swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="product-card-modern__colors" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                className={["color-swatch-dot", selectedColor === color ? "active" : ""].filter(Boolean).join(" ")}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        )}

        {/* Size details */}
        {product.variants && product.variants.length > 0 && (
          <div className="product-card-modern__sizes" onClick={(e) => e.stopPropagation()}>
            {product.variants.map((v) => (
              <button
                key={v._id || v.id || v.label}
                type="button"
                className={["size-pill", selectedSize === v.label ? "active" : ""].filter(Boolean).join(" ")}
                onClick={() => setSelectedSize(v.label)}
              >
                {v.label}
              </button>
              <button
                key={sz}
                type="button"
                className={["size-pill", selectedSize === sz ? "active" : ""].filter(Boolean).join(" ")}
                onClick={() => setSelectedSize(sz)}
              >
                {sz}
              </button>
            ))}
          </div>
        )}

        <hr className="product-card-modern__divider" />

        {/* Bottom Price & Action Row */}
        <div className="product-card-modern__footer">
          <div className="price-stack">
            <span className="current-price">{'\u09F3'}{product.price}</span>
            {product.oldPrice && (
              <span className="old-price">{'\u09F3'}{product.oldPrice}</span>
            )}
          </div>

          <div className="card-actions-group">
            {/* Wishlist Button */}
            <button
              type="button"
              className={["action-circle-btn", isWishlisted ? "active-wishlist" : ""].filter(Boolean).join(" ")}
              onClick={handleWishlist}
              title="Add to Wishlist"
            >
              <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
            </button>

            {/* Quick Add to Cart Button */}
            <button
              type="button"
              className="action-circle-btn"
              onClick={handleAddToCart}
              title="Quick Add to Cart"
            >
              <ShoppingCart size={14} />
            </button>

            {/* Quick checkout/details trigger button */}
            <button
              type="button"
              className="action-accent-btn"
              onClick={handleBuyNow}
              title="Buy Now"
            >
              <Truck size={14} />
            </button>
          </div>
        </div>
      </div>
    </m.article>
  );
}
