import { useState, useMemo } from "react";
import { Star, ShoppingCart, Plus, Minus, Sparkles } from "lucide-react";
import { Button } from "../lib/ui";
import { products } from "../data/mockData";
import { useCart } from "../context/CartContext";

export default function BestSellerSection() {
  const { addToCart } = useCart();
  const [bestSellerSize, setBestSellerSize] = useState("M");
  const [bestSellerQty, setBestSellerQty] = useState(1);

  const bestSellerProduct = useMemo(() => {
    return products.find((p) => p.bestSeller === true) || products[0];
  }, []);

  const handleBestSellerAddToCart = () => {
    const variant =
      bestSellerProduct.variants.find((v) => v.label === bestSellerSize) ||
      bestSellerProduct.variants[0];
    addToCart(bestSellerProduct, variant, bestSellerQty);
  };

  return (
    <section className="bestseller-section sirat-panel">
      <div className="bestseller-grid">
        <div className="bestseller-visual">
          <div className="bestseller-badge">
            <Sparkles size={12} style={{ marginRight: "4px" }} /> BEST SELLER
          </div>
          <div className="bestseller-media-frame" />
        </div>

        <div className="bestseller-details">
          <span className="storefront__badge">{bestSellerProduct.category}</span>
          <h2 className="bestseller-title">{bestSellerProduct.name}</h2>
          
          <div className="bestseller-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="star-filled" fill="currentColor" />
              ))}
            </div>
            <span>{bestSellerProduct.rating.toFixed(1)} / 5.0 rating</span>
          </div>

          <div className="bestseller-price">
            <h3>৳{bestSellerProduct.price}</h3>
            <span className="helper">In high demand — free delivery</span>
          </div>

          <p className="page-section__text">{bestSellerProduct.description}</p>

          {/* Size Selector */}
          <div className="bestseller-variants">
            <h4>Select Size:</h4>
            <div className="quickview-variants-grid">
              {bestSellerProduct.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  disabled={!v.inStock}
                  className={["quickview-variant-btn", bestSellerSize === v.label ? "active" : ""].filter(Boolean).join(" ")}
                  onClick={() => setBestSellerSize(v.label)}
                >
                  {v.label}
                  {!v.inStock && <span className="sold-out">Out</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector + Add to Cart */}
          <div className="bestseller-action-row" style={{ marginTop: "1rem" }}>
            <div className="quickview-qty-selector">
              <button type="button" onClick={() => setBestSellerQty((q) => Math.max(1, q - 1))}>
                <Minus size={12} />
              </button>
              <span>{bestSellerQty}</span>
              <button type="button" onClick={() => setBestSellerQty((q) => q + 1)}>
                <Plus size={12} />
              </button>
            </div>

            <Button style={{ flex: 1 }} onClick={handleBestSellerAddToCart}>
              <ShoppingCart size={16} style={{ marginRight: "8px" }} /> Add Best Seller to Cart
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
