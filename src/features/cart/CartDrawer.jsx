import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { m, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingCart, Tag } from "lucide-react";
import { useCart } from "@app/providers/CartContext";
import { Button } from "@components/ui";
import { validateCouponCode } from "@api/queries";

export default function CartDrawer({ isOpen, onClose }) {
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
  const [isValidating, setIsValidating] = useState(false);

  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    if (!promoInput) return;

    setIsValidating(true);
    try {
        const res = await validateCouponCode(promoInput, cartSubtotal);
        if (res.success) {
            applyPromoCode({
                code: res.data.code,
                percent: res.data.discountType === 'percentage' ? res.data.discountValue : 0,
                fixed: res.data.discountType === 'fixed' ? res.data.discountValue : 0
            });
            setPromoInput("");
        }
    } catch (err) {
        console.error("Promo error:", err);
        applyPromoCode({ code: "", error: err.response?.data?.message || "Invalid coupon code." });
    } finally {
        setIsValidating(false);
    }
  };

  const handleRemovePromo = () => {
    applyPromoCode("");
    setPromoInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <m.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer container */}
          <m.aside
            className="cart-drawer sirat-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
          >
            <div className="cart-drawer__header">
              <div className="cart-drawer__title-group">
                <ShoppingCart size={20} className="accent" />
                <h3>Your Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {cartItems.length > 0 && (
                    <button 
                        onClick={() => {
                            triggerConfirm("Clear your entire cart?", clearCart);
                        }}
                        style={{ background: "none", border: "none", color: "var(--sirat-error)", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", textTransform: "uppercase" }}
                    >
                        Clear
                    </button>
                )}
                <button className="cart-drawer__close" aria-label="Close cart" onClick={onClose}>
                    <X size={20} />
                </button>
              </div>
            </div>

            <div className="cart-drawer__content">
              {cartItems.length === 0 ? (
                <div className="cart-drawer__empty">
                  <ShoppingCart size={48} className="muted" style={{ marginBottom: "1rem" }} />
                  <p>Your shopping bag is empty.</p>
                  <Button variant="outline" style={{ marginTop: "1rem" }} onClick={onClose}>
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="cart-drawer__items">
                  {cartItems.map((item) => {
                    const price = item.product.price + item.variant.priceDelta;
                    return (
                      <div key={`${item.product.id}-${item.variant.id}`} className="cart-drawer__item">
                        <div className="cart-drawer__item-media">
                          <img 
                            src={item.product.images?.[0] || item.product.image} 
                            alt={item.product.name} 
                            className="cart-drawer__item-media-img" 
                            loading="lazy" 
                          />
                        </div>
                        <div className="cart-drawer__item-info">
                          <span className="cart-drawer__item-category">{item.product.category}</span>
                          <h4 className="cart-drawer__item-name">{item.product.name}</h4>
                          <span className="cart-drawer__item-variant">Size: {item.variant.label}</span>
                          <div className="cart-drawer__item-meta">
                            <strong>{'\u09F3'}{price * item.quantity}</strong>
                            <span className="helper">{'\u09F3'}{price} each</span>
                          </div>
                        </div>

                        <div className="cart-drawer__item-actions">
                          <div className="cart-drawer__item-qty">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}
                            >
                              <Minus size={12} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            type="button"
                            className="cart-drawer__item-remove"
                            onClick={() => removeFromCart(item.product.id, item.variant.id)}
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-drawer__footer">
                <form className="cart-drawer__promo-form" onSubmit={handlePromoSubmit}>
                  <div className="cart-drawer__promo-input-group">
                    <input
                      type="text"
                      placeholder="PROMO CODE (e.g. SIRAT10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      disabled={!!promoCode}
                    />
                    {promoCode ? (
                      <Button type="button" variant="outline" onClick={handleRemovePromo}>
                        Remove
                      </Button>
                    ) : (
                      <Button type="submit">Apply</Button>
                    )}
                  </div>
                  {promoError && <p className="cart-drawer__promo-error">{promoError}</p>}
                  {promoCode && (
                    <p className="cart-drawer__promo-success">
                      <Tag size={12} style={{ marginRight: "4px" }} /> Code <strong>{promoCode}</strong> applied successfully!
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
                  <div className="cart-drawer__summary-row total">
                    <span>Estimated Total</span>
                    <span>{'\u09F3'}{cartTotal}</span>
                  </div>
                </div>

                <div style={{ display: "grid", gap: "0.75rem" }}>
                    <Button 
                    className="cart-drawer__checkout-btn" 
                    style={{ width: "100%" }}
                    onClick={() => {
                        navigate("/checkout");
                        onClose();
                    }}
                    >
                    Proceed to Checkout
                    </Button>
                    
                    <button 
                        onClick={() => {
                            navigate("/cart");
                            onClose();
                        }}
                        style={{ background: "none", border: "none", color: "var(--sirat-gold-soft)", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer", textDecoration: "underline" }}
                    >
                        View Full Shopping Bag
                    </button>
                </div>
              </div>
            )}
          </m.aside>
        </>
      )}
    </AnimatePresence>
  );
}
