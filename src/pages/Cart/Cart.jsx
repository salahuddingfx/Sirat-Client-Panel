import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart, Tag } from "lucide-react";
import { useCart } from "../../app/providers/CartContext";
import PageFrame from "../../components/layout/PageFrame";
import { Button, Panel } from "../../components/ui";
import SEO from "../../components/layout/SEO";
import { useState } from "react";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    promoCode,
    promoError,
    discountAmount,
    cartSubtotal,
    cartTotal,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    clearCart,
    triggerConfirm
  } = useCart();

  const [promoInput, setPromoInput] = useState("");

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    applyPromoCode(promoInput);
  };

  const handleRemovePromo = () => {
    applyPromoCode("");
    setPromoInput("");
  };

  // Determine placeholder image URL
  const getProductImage = (name) => {
    const n = name.toLowerCase();
    if (n.includes("lumina")) return "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=200";
    if (n.includes("nova")) return "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=200";
    if (n.includes("orbit")) return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200";
    if (n.includes("vector")) return "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=200";
    if (n.includes("zenith")) return "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200";
    if (n.includes("helix")) return "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=200";
    if (n.includes("chrono")) return "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=200";
    if (n.includes("matrix")) return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200";
    if (n.includes("apex")) return "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=200";
    return "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=200";
  };

  return (
    <PageFrame title="Your Bag" eyebrow="Cart">
      <SEO title="Shopping Bag" description="Review items and customize printed clothing choices before checking out." noindex />

      {cartItems.length === 0 ? (
        <Panel className="shop-empty-state" style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <ShoppingCart size={48} className="muted" style={{ margin: "0 auto 1.5rem", color: "var(--sirat-gold)" }} />
          <h3>Your bag is currently empty</h3>
          <p className="page-section__text" style={{ maxWidth: "450px", margin: "0.5rem auto 1.5rem" }}>
            Add some custom high-density print garments from our streetwear catalog to get started.
          </p>
          <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
        </Panel>
      ) : (
        <div className="cart-page-grid">
          {/* Left items column */}
          <div className="cart-items-container">
            {cartItems.map((item) => {
              const productId = item.product.id || item.product._id;
              const price = item.product.price + item.variant.priceDelta;
              return (
                <div key={`${productId}-${item.variant.id}`} className="cart-page-item">
                  <div 
                    className="cart-page-item-img" 
                    style={{ backgroundImage: `url(${getProductImage(item.product.name)})` }} 
                  />
                  <div className="cart-page-item-info">
                    <span className="section-header__eyebrow" style={{ fontSize: "0.68rem" }}>{item.product.category?.name || item.product.category}</span>
                    <h3 className="cart-page-item-name">{item.product.name}</h3>
                    <span className="cart-page-item-meta">Size: <strong>{item.variant.label}</strong></span>
                    <span className="cart-page-item-price">{'\u09F3'}{price}</span>
                  </div>

                  <div className="cart-page-item-qty-actions">
                    <div className="quickview-qty-selector">
                      <button 
                        type="button" 
                        onClick={() => updateQuantity(productId, item.variant.id, item.quantity - 1)}
                      >
                        <Minus size={11} />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        type="button" 
                        onClick={() => updateQuantity(productId, item.variant.id, item.quantity + 1)}
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <button 
                      type="button" 
                      className="action-circle-btn" 
                      style={{ color: "#EF4444" }}
                      onClick={() => removeFromCart(productId, item.variant.id)}
                      title="Remove item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}

            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <Link to="/shop" className="back-btn" style={{ display: "inline-flex", width: "auto" }}>
                <ArrowLeft size={14} /> Back to Shop
              </Link>
              <button 
                onClick={() => {
                    triggerConfirm("Clear your entire cart?", clearCart);
                }}
                style={{ background: "none", border: "none", color: "var(--sirat-error)", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <Trash2 size={14} /> Clear Entire Cart
              </button>
            </div>
          </div>

          {/* Right Summary Column */}
          <Panel className="checkout-section">
            <h3 style={{ margin: "0 0 1rem" }}>Order Summary</h3>
            
            {/* Promo Code Form */}
            <form onSubmit={handlePromoSubmit} style={{ marginBottom: "1.5rem" }}>
              <div className="cart-drawer__promo-input-group">
                <input
                  type="text"
                  placeholder="PROMO CODE (SIRAT10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  disabled={!!promoCode}
                  style={{
                    padding: "0.6rem 1rem",
                    borderRadius: "99px",
                    border: "1px solid var(--sirat-border)",
                    width: "100%",
                    flex: 1,
                    minWidth: 0,
                    outline: "none",
                    background: "var(--sirat-bg)",
                    fontSize: "0.85rem"
                  }}
                />
                {promoCode ? (
                  <Button type="button" variant="outline" onClick={handleRemovePromo}>
                    Remove
                  </Button>
                ) : (
                  <Button type="submit">Apply</Button>
                )}
              </div>
              {promoError && <p className="cart-drawer__promo-error" style={{ marginTop: "0.35rem" }}>{promoError}</p>}
              {promoCode && (
                <p className="cart-drawer__promo-success" style={{ marginTop: "0.35rem" }}>
                  <Tag size={12} style={{ marginRight: "4.5px" }} /> Code <strong>{promoCode}</strong> active!
                </p>
              )}
            </form>

            <div className="cart-drawer__summary">
              <div className="cart-drawer__summary-row">
                <span>Subtotal</span>
                <span>{'\u09F3'}{cartSubtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="cart-drawer__summary-row promo">
                  <span>Discount</span>
                  <span>-{'\u09F3'}{discountAmount}</span>
                </div>
              )}
              <div className="cart-drawer__summary-row">
                <span>Estimated Shipping</span>
                <span style={{ color: "#10B981", fontWeight: "700" }}>FREE</span>
              </div>
              <hr className="product-card-modern__divider" style={{ margin: "0.85rem 0" }} />
              <div className="cart-drawer__summary-row total" style={{ fontSize: "1.2rem" }}>
                <span>Order Total</span>
                <span>{'\u09F3'}{cartTotal}</span>
              </div>
            </div>

            <Button 
              className="cart-drawer__checkout-btn" 
              style={{ width: "100%", marginTop: "1.5rem" }}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </Button>
          </Panel>
        </div>
      )}
    </PageFrame>
  );
}
