import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, CreditCard, Landmark, Truck, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import PageFrame from "../components/PageFrame";
import { Button, Panel } from "../lib/ui";
import SEO from "../components/SEO";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, discountAmount, clearCart } = useCart();

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
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");

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

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !address) {
      alert("Please fill in all required shipping fields.");
      return;
    }

    if ((paymentMethod === "bkash" || paymentMethod === "nagad") && (!paySender || !payTxid)) {
      alert(`Please enter your ${paymentMethod === "bkash" ? "bKash" : "Nagad"} sender phone and transaction ID.`);
      return;
    }

    // Simulate placing order
    const orderNum = `SRT-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedOrderId(orderNum);
    setOrderPlaced(true);
    // Note: clearCart will clear items, so we'll keep variables in success state by rendering local states
  };

  // If order is placed successfully, render success state
  if (orderPlaced) {
    return (
      <PageFrame title="Order Placed" eyebrow="Success">
        <SEO title="Order Success" description="Your streetwear order has been received successfully." />
        <Panel className="shop-empty-state" style={{ padding: "4rem 2rem", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
          <CheckCircle size={56} style={{ color: "#10B981", margin: "0 auto 1.5rem" }} />
          <h2>Thank you for your order!</h2>
          <p className="page-section__text" style={{ margin: "0.5rem auto 1.5rem" }}>
            Your order has been received and is being processed. 
          </p>

          <div style={{ background: "var(--sirat-bg)", border: "1px solid var(--sirat-border)", padding: "1.25rem", borderRadius: "12px", marginBottom: "2rem", textAlign: "left" }}>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--sirat-muted)", display: "block" }}>Order Tracking Number:</span>
              <strong style={{ fontSize: "1.25rem", color: "var(--sirat-gold-soft)", letterSpacing: "0.05em" }}>{generatedOrderId}</strong>
            </div>
            
            <div style={{ fontSize: "0.85rem", display: "grid", gap: "0.55rem", borderTop: "1px dashed var(--sirat-border)", paddingTop: "0.85rem" }}>
              <div>📦 <strong>Recipient Name:</strong> {name}</div>
              <div>📞 <strong>Contact Phone:</strong> {phone}</div>
              <div>📍 <strong>Address:</strong> {address}, {city}</div>
              <div>⚖️ <strong>Total Package Weight:</strong> {totalWeight.toFixed(2)} kg</div>
              <div>🚚 <strong>Shipping Fee:</strong> ৳{shippingCharge}</div>
              <div>💵 <strong>Payment Method:</strong> {paymentMethod.toUpperCase() === "COD" ? "Cash on Delivery (COD)" : `${paymentMethod.toUpperCase()} Mobile Money`}</div>
              {paySender && <div>📱 <strong>Sender Number:</strong> {paySender}</div>}
              {payTxid && <div>🔑 <strong>Transaction ID:</strong> {payTxid}</div>}
              <div style={{ borderTop: "1px solid var(--sirat-border)", paddingTop: "0.55rem", marginTop: "0.2rem", fontSize: "0.95rem" }}>
                💰 <strong>Amount Paid/Due:</strong> <strong style={{ color: "var(--sirat-gold-soft)" }}>৳{estimatedTotal}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Button onClick={() => { clearCart(); navigate("/"); }}>Go to Home</Button>
            <Button variant="outline" onClick={() => { clearCart(); navigate(`/track?id=${generatedOrderId}`); }}>Track Shipment</Button>
          </div>
        </Panel>
      </PageFrame>
    );
  }

  return (
    <PageFrame title="Checkout" eyebrow="Secure Checkout">
      <SEO title="Checkout" description="Enter shipping coordinates and select payments to check out." />

      {cartItems.length === 0 ? (
        <Panel className="shop-empty-state" style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <ShoppingBag size={48} className="muted" style={{ margin: "0 auto 1.5rem", color: "var(--sirat-gold)" }} />
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
              <h3 style={{ margin: "0 0 1.25rem" }}>1. Shipping Details</h3>
              
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
                    💡 Please send money (<strong>৳{estimatedTotal}</strong>) to our personal {paymentMethod === "bkash" ? "bKash" : "Nagad"} wallet: 
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
                {cartItems.map((item) => (
                  <div key={`${item.product.id}-${item.variant.id}`} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                    <span>{item.product.name} (x{item.quantity}) - {item.variant.label}</span>
                    <strong>৳{(item.product.price + item.variant.priceDelta) * item.quantity}</strong>
                  </div>
                ))}
              </div>

              <hr className="product-card-modern__divider" style={{ margin: "0.85rem 0" }} />

              <div className="cart-drawer__summary" style={{ gap: "0.50rem" }}>
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
                <div className="cart-drawer__summary-row">
                  <span>Total Weight</span>
                  <span>{totalWeight.toFixed(2)} kg</span>
                </div>
                <div className="cart-drawer__summary-row">
                  <span>Shipping ({city === "Cox's Bazar" ? "Cox's Bazar" : "Outside"})</span>
                  <span>৳{shippingCharge}</span>
                </div>
                <hr className="product-card-modern__divider" style={{ margin: "0.55rem 0" }} />
                <div className="cart-drawer__summary-row total" style={{ fontSize: "1.15rem" }}>
                  <span>Estimated Total</span>
                  <span>৳{estimatedTotal}</span>
                </div>
              </div>

              <Button type="submit" style={{ width: "100%", marginTop: "1.5rem" }}>
                Place Order (৳{estimatedTotal})
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
