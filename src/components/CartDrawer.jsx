import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingCart, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Button } from "../lib/ui";

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
    applyPromoCode
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer container */}
          <motion.aside
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
              <button className="cart-drawer__close" aria-label="Close cart" onClick={onClose}>
                <X size={20} />
              </button>
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
                        <div className="cart-drawer__item-media" />
                        <div className="cart-drawer__item-info">
                          <span className="cart-drawer__item-category">{item.product.category}</span>
                          <h4 className="cart-drawer__item-name">{item.product.name}</h4>
                          <span className="cart-drawer__item-variant">Size: {item.variant.label}</span>
                          <div className="cart-drawer__item-meta">
                            <strong>৳{price * item.quantity}</strong>
                            <span className="helper">৳{price} each</span>
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
                    <span>৳{cartSubtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="cart-drawer__summary-row promo">
                      <span>Discount</span>
                      <span>-৳{discountAmount}</span>
                    </div>
                  )}
                  <div className="cart-drawer__summary-row total">
                    <span>Estimated Total</span>
                    <span>৳{cartTotal}</span>
                  </div>
                </div>

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
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
