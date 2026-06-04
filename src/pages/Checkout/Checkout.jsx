import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, Landmark, Truck, ShoppingCart, ArrowLeft, UserCheck, Plus, Minus, Trash2, Tag } from "lucide-react";
import { useCart } from "@app/providers/CartContext";
import { useAuth } from "@app/providers/AuthContext";
import PageFrame from "@components/layout/PageFrame";
import { Button, Panel } from "@components/ui";
import SEO from "@components/layout/SEO";
import { placeOrder, validateCouponCode } from "@api/queries";
import track from "@lib/tracker";
import { useTrackOnMount } from "@lib/useTracker";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, discountAmount, promoCode, promoError, clearCart, triggerToast, updateQuantity, removeFromCart, applyPromoCode } = useCart();
  const { isLoggedIn, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  // State controls
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Cox's Bazar"); // Default Cox's Bazar
  const [zip, setZip] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [paySender, setPaySender] = useState("");
  const [payTxid, setPayTxid] = useState("");

  const [selectedAddressId, setSelectedAddressId] = useState("");

  // Auto-fill from logged-in user
  useEffect(() => {
    if (isLoggedIn && user) {
      setEmail(user.email || "");
      setName(user.name || "");
      setPhone(user.phone || "");
      const savedAddresses = user.addresses;
      if (Array.isArray(savedAddresses) && savedAddresses.length > 0) {
        const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
        setAddress(defaultAddr.street || "");
        setCity(defaultAddr.city || "Cox's Bazar");
        setZip(defaultAddr.zipCode || "");
        setSelectedAddressId(defaultAddr.id || "");
      }
    }
  }, [isLoggedIn, user]);

  const handleSelectAddress = (addr) => {
    setAddress(addr.street || "");
    setCity(addr.city || "Cox's Bazar");
    setZip(addr.zipCode || "");
    setSelectedAddressId(addr.id || "");
  };

  useTrackOnMount("checkout_start", {
    value: cartSubtotal - discountAmount,
    currency: "BDT",
    metadata: { itemCount: cartItems.length },
  });

  // Calculate order weight
  const totalWeight = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const weightNum = parseFloat(item.product.weight || 0.35);
      return sum + weightNum * item.quantity;
    }, 0);
  }, [cartItems]);

  // Calculate shipping charges
  const shippingCharge = useMemo(() => {
    if (city === "Cox's Bazar") {
      return 70;
    }
    // Outside Cox's Bazar
    if (totalWeight <= 1.0) {
      return 120;
    }
    const extraWeight = totalWeight - 1.0;
    const extraCharge = Math.ceil(extraWeight) * 10;
    return 120 + extraCharge;
  }, [city, totalWeight]);

  const estimatedTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount + shippingCharge);
  }, [cartSubtotal, discountAmount, shippingCharge]);

  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    if (!promoInput) return;
    setIsValidatingPromo(true);
    try {
      const res = await validateCouponCode(promoInput, cartSubtotal);
      if (res.success) {
        applyPromoCode({
          code: res.data.code,
          percent: res.data.discountType === 'percentage' ? res.data.discountValue : 0,
          fixed: res.data.discountType === 'fixed' ? res.data.discountValue : 0
        });
        setPromoInput("");
        triggerToast("Coupon applied successfully!", "success");
      }
    } catch (err) {
      applyPromoCode({ code: "", error: err.response?.data?.message || "Invalid coupon code." });
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    applyPromoCode("");
    setPromoInput("");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !address) {
      triggerToast("Please fill in all required shipping fields.", "warning");
      return;
    }

    if ((paymentMethod === "bkash" || paymentMethod === "nagad") && (!paySender || !payTxid)) {
      triggerToast(`Please enter your ${paymentMethod === "bkash" ? "bKash" : "Nagad"} sender phone and transaction ID.`, "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        guestInfo: { name, email, phone, address, city, zipCode: zip },
        items: cartItems.map((item) => ({
          product: item.product.id || item.product._id,
          quantity: item.quantity,
          variant: item.variant.label,
          price: item.product.price + item.variant.priceDelta,
        })),
        shippingCharge,
        totalAmount: estimatedTotal,
        discountAmount,
        couponCode: promoCode || undefined,
        paymentMethod,
        paymentDetails: (paymentMethod === "bkash" || paymentMethod === "nagad") ? {
          senderNumber: paySender,
          txId: payTxid
        } : undefined
      };

      const response = await placeOrder(payload);

      if (response.success) {
        const orderDetails = response.data;

        track.event("purchase", {
          label: orderDetails?._id || orderDetails?.orderId || "order",
          value: orderDetails?.totalAmount || estimatedTotal,
          currency: "BDT",
          metadata: {
            orderId: orderDetails?._id || orderDetails?.orderId,
            paymentMethod,
            itemCount: cartItems.length,
          },
        });

        // Save to local for guest tracking convenience
        const existingOrders = JSON.parse(localStorage.getItem("sirat_orders") || "[]");
        existingOrders.push(orderDetails);
        localStorage.setItem("sirat_orders", JSON.stringify(existingOrders));

        clearCart();
        triggerToast("Order placed successfully!", "success");
        navigate("/order-success", { state: orderDetails });
      } else {
        triggerToast(response.message || "Failed to place order.", "error");
      }
    } catch (err) {
      console.error("Order error:", err);
      triggerToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageFrame title="Checkout" eyebrow="Secure Checkout">
      <SEO title="Checkout" description="Enter shipping coordinates and select payments to check out." noindex />

      {cartItems.length === 0 ? (
        <Panel className="shop-empty-state" style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <ShoppingCart size={48} className="muted" style={{ margin: "0 auto 1.5rem", color: "var(--sirat-gold)" }} />
          <h3>Your bag is empty</h3>
          <p className="page-section__text" style={{ maxWidth: "450px", margin: "0.5rem auto 1.5rem" }}>
            You cannot checkout with an empty shopping cart. Add items to bag first.
          </p>
          <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
        </Panel>
      ) : (
        <form onSubmit={handlePlaceOrder} className="checkout-grid">
          {/* Left Form Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Customer & Shipping info */}
            <Panel className="checkout-section">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h3 style={{ margin: 0 }}>1. Shipping Details</h3>
                {isLoggedIn && (
                  <span style={{ 
                    fontSize: "0.75rem", 
                    color: "var(--sirat-success)", 
                    background: "rgba(22, 101, 52, 0.08)", 
                    padding: "0.25rem 0.6rem", 
                    borderRadius: "99px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontWeight: "600"
                  }}>
                    <UserCheck size={12} /> Linked to Account
                  </span>
                )}
              </div>

              {isLoggedIn && Array.isArray(user?.addresses) && user.addresses.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, display: "block", marginBottom: "0.4rem", opacity: 0.7 }}>Saved Addresses</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectAddress(addr)}
                        style={{
                          padding: "0.5rem 0.8rem",
                          borderRadius: "8px",
                          border: `1px solid ${selectedAddressId === addr.id ? "var(--sirat-gold)" : "var(--sirat-border)"}`,
                          background: selectedAddressId === addr.id ? "rgba(212, 175, 55, 0.06)" : "transparent",
                          cursor: "pointer",
                          fontSize: "0.78rem",
                          transition: "all 0.2s"
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>{addr.street}</div>
                        <div style={{ opacity: 0.6 }}>{addr.city}{addr.zipCode ? `, ${addr.zipCode}` : ""}{addr.isDefault ? " (Default)" : ""}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="checkout-form-grid">
                <div className="form-group">
                  <label htmlFor="chk-email">Email Address *</label>
                  <input
                    id="chk-email"
                    type="email"
                    required
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="chk-phone">Contact Phone *</label>
                  <input
                    id="chk-phone"
                    type="tel"
                    required
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1711-223344"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label htmlFor="chk-name">Full Name *</label>
                <input
                  id="chk-name"
                  type="text"
                  required
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Salahuddin Ahmed"
                />
              </div>

              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label htmlFor="chk-address">Shipping Address *</label>
                <input
                  id="chk-address"
                  type="text"
                  required
                  className="form-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House 24, Road 5, Banani"
                />
              </div>

              <div className="checkout-form-grid" style={{ marginTop: "1rem" }}>
                <div className="form-group">
                  <label htmlFor="chk-city">City / District *</label>
                  <select
                    id="chk-city"
                    className="form-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ paddingRight: "2rem" }}
                  >
                    <option value="Cox's Bazar">Cox's Bazar</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Outside Cox's Bazar">Outside Cox's Bazar (Other)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="chk-zip">Postal ZIP Code</label>
                  <input
                    id="chk-zip"
                    type="text"
                    className="form-input"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="1213"
                  />
                </div>
              </div>
            </Panel>

            {/* Payment options selection */}
            <Panel className="checkout-section">
              <h3 style={{ margin: "0 0 1.25rem" }}>2. Payment Options</h3>
              <div className="payment-methods">
                
                {/* Cash on delivery option */}
                <div 
                  className={["payment-option", paymentMethod === "cod" ? "active" : ""].filter(Boolean).join(" ")}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <input 
                    type="radio" 
                    name="payOpt" 
                    checked={paymentMethod === "cod"} 
                    onChange={() => setPaymentMethod("cod")} 
                    aria-label="Cash on Delivery"
                  />
                  <Truck size={20} style={{ color: "var(--sirat-gold)" }} />
                  <div className="payment-option-label">
                    <span className="payment-option-title">Cash on Delivery (COD)</span>
                    <span className="payment-option-desc">Pay in cash upon delivery to your doorstep.</span>
                  </div>
                </div>

                {/* bKash Option */}
                <div 
                  className={["payment-option", paymentMethod === "bkash" ? "active" : ""].filter(Boolean).join(" ")}
                  onClick={() => setPaymentMethod("bkash")}
                >
                  <input 
                    type="radio" 
                    name="payOpt" 
                    checked={paymentMethod === "bkash"} 
                    onChange={() => setPaymentMethod("bkash")} 
                    aria-label="bKash Money Transfer"
                  />
                  <Landmark size={20} style={{ color: "#E2136E" }} />
                  <div className="payment-option-label">
                    <span className="payment-option-title">bKash (Send Money)</span>
                    <span className="payment-option-desc">Instantly pay using bKash personal wallet.</span>
                  </div>
                </div>

                {/* Nagad Option */}
                <div 
                  className={["payment-option", paymentMethod === "nagad" ? "active" : ""].filter(Boolean).join(" ")}
                  onClick={() => setPaymentMethod("nagad")}
                >
                  <input 
                    type="radio" 
                    name="payOpt" 
                    checked={paymentMethod === "nagad"} 
                    onChange={() => setPaymentMethod("nagad")} 
                    aria-label="Nagad Money Transfer"
                  />
                  <Landmark size={20} style={{ color: "#F57C00" }} />
                  <div className="payment-option-label">
                    <span className="payment-option-title">Nagad (Send Money)</span>
                    <span className="payment-option-desc">Instantly pay using Nagad personal wallet.</span>
                  </div>
                </div>

              </div>

              {/* Conditional payment fields */}
              {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
                <div style={{
                  marginTop: "1.5rem",
                  padding: "1.25rem",
                  background: "var(--sirat-bg)",
                  border: "1px solid var(--sirat-border)",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem"
                }}>
                  <div style={{ fontSize: "0.85rem", lineHeight: "1.5", color: "var(--sirat-text)" }}>
                    💡 Please send money (<strong>{'\u09F3'}{estimatedTotal}</strong>) to our personal {paymentMethod === "bkash" ? "bKash" : "Nagad"} wallet: 
                    <strong style={{ display: "block", fontSize: "1rem", color: "var(--sirat-gold-soft)", marginTop: "0.25rem" }}>01700-000000 (Send Money)</strong>
                    Enter your Sender Number and Transaction ID (TxnID) below:
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className="form-group">
                      <label htmlFor="pay-sender">Your {paymentMethod === "bkash" ? "bKash" : "Nagad"} Number *</label>
                      <input
                        id="pay-sender"
                        type="text"
                        required
                        className="form-input"
                        style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--sirat-border)", background: "var(--sirat-surface)" }}
                        placeholder="e.g. 01711223344"
                        value={paySender}
                        onChange={(e) => setPaySender(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="pay-txid">Transaction ID (TxnID) *</label>
                      <input
                        id="pay-txid"
                        type="text"
                        required
                        className="form-input"
                        style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid var(--sirat-border)", background: "var(--sirat-surface)" }}
                        placeholder="e.g. A1B2C3D4E5"
                        value={payTxid}
                        onChange={(e) => setPayTxid(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Panel>
          </div>

          {/* Right Summary Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <Panel className="checkout-section">
              <h3 style={{ margin: "0 0 1.25rem" }}>Order Details</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {cartItems.map((item) => {
                  const productId = item.product.id || item.product._id;
                  const price = item.product.price + item.variant.priceDelta;
                  return (
                    <div key={`${productId}-${item.variant.id}`} className="cart-page-item" style={{ gap: "0.5rem", padding: "0.5rem 0", borderBottom: "1px solid var(--sirat-border)" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.78rem", opacity: 0.6 }}>{item.product.category?.name || item.product.category}</div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 600 }}>{item.product.name}</div>
                        <div style={{ fontSize: "0.78rem" }}>Size: {item.variant.label} — {'\u09F3'}{price}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <div className="quickview-qty-selector" style={{ transform: "scale(0.85)" }}>
                          <button type="button" onClick={() => updateQuantity(productId, item.variant.id, item.quantity - 1)}><Minus size={11} /></button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(productId, item.variant.id, item.quantity + 1)}><Plus size={11} /></button>
                        </div>
                        <button type="button" onClick={() => removeFromCart(productId, item.variant.id)} style={{ background: "none", border: "none", color: "var(--sirat-error)", cursor: "pointer", padding: "0.25rem" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <strong style={{ whiteSpace: "nowrap" }}>{'\u09F3'}{price * item.quantity}</strong>
                    </div>
                  );
                })}
              </div>

              {/* Promo Code */}
              <form onSubmit={handlePromoSubmit} style={{ marginBottom: "1rem" }}>
                <div className="cart-drawer__promo-input-group">
                  <input
                    type="text"
                    placeholder="PROMO CODE (SIRAT10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    disabled={!!promoCode}
                    style={{
                      padding: "0.5rem 0.8rem",
                      borderRadius: "99px",
                      border: "1px solid var(--sirat-border)",
                      width: "100%",
                      flex: 1,
                      minWidth: 0,
                      outline: "none",
                      background: "var(--sirat-bg)",
                      fontSize: "0.8rem"
                    }}
                  />
                  {promoCode ? (
                    <Button type="button" variant="outline" onClick={handleRemovePromo}>Remove</Button>
                  ) : (
                    <Button type="submit" disabled={isValidatingPromo}>{isValidatingPromo ? "..." : "Apply"}</Button>
                  )}
                </div>
                {promoError && <p className="cart-drawer__promo-error" style={{ marginTop: "0.25rem", fontSize: "0.78rem" }}>{promoError}</p>}
                {promoCode && (
                  <p className="cart-drawer__promo-success" style={{ marginTop: "0.25rem", fontSize: "0.78rem" }}>
                    <Tag size={12} style={{ marginRight: "4px" }} /> Code <strong>{promoCode}</strong> active!
                  </p>
                )}
              </form>

              <hr className="product-card-modern__divider" style={{ margin: "0.85rem 0" }} />

              <div className="cart-drawer__summary" style={{ gap: "0.50rem" }}>
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
                  <span>Total Weight</span>
                  <span>{totalWeight.toFixed(2)} kg</span>
                </div>
                <div className="cart-drawer__summary-row">
                  <span>Shipping ({city === "Cox's Bazar" ? "Cox's Bazar" : "Outside"})</span>
                  <span>{'\u09F3'}{shippingCharge}</span>
                </div>
                <hr className="product-card-modern__divider" style={{ margin: "0.55rem 0" }} />
                <div className="cart-drawer__summary-row total" style={{ fontSize: "1.15rem" }}>
                  <span>Estimated Total</span>
                  <span>{'\u09F3'}{estimatedTotal}</span>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} style={{ width: "100%", marginTop: "1.5rem", opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? "Placing Order..." : `Place Order (${'\u09F3'}${estimatedTotal})`}
              </Button>

              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <Link to="/cart" className="back-btn" style={{ display: "inline-flex", width: "auto", border: "none", fontSize: "0.8rem", padding: "0" }}>
                  <ArrowLeft size={12} /> Edit Shopping Bag
                </Link>
              </div>
            </Panel>
          </div>
        </form>
      )}
    </PageFrame>
  );
}
