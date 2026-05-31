import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingCart, User, Phone, MapPin, Scale, Truck, CreditCard, Smartphone, Key, Coins } from "lucide-react";
import PageFrame from "../components/PageFrame";
import { Button, Panel } from "../lib/ui";
import SEO from "../components/SEO";

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state;

  if (!orderDetails) {
    return (
      <PageFrame title="Order Success" eyebrow="Success">
        <SEO title="Order Received" description="Your streetwear order has been received." />
        <Panel className="shop-empty-state" style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <ShoppingCart size={48} className="muted" style={{ margin: "0 auto 1.5rem", color: "var(--sirat-gold)" }} />
          <h3>No order details found</h3>
          <p className="page-section__text" style={{ maxWidth: "450px", margin: "0.5rem auto 1.5rem" }}>
            It seems you accessed this page directly. Add some custom high-density print garments to your cart and place an order.
          </p>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
        </Panel>
      </PageFrame>
    );
  }

  const {
    orderId,
    name,
    phone,
    address,
    city,
    totalWeight,
    shippingCharge,
    paymentMethod,
    paySender,
    payTxid,
    estimatedTotal
  } = orderDetails;

  return (
    <PageFrame title="Order Placed" eyebrow="Success">
      <SEO title="Order Success" description="Your streetwear order has been received successfully." />
      <Panel className="shop-empty-state" style={{ padding: "4rem 2rem", textAlign: "center", maxWidth: "650px", margin: "0 auto" }}>
        <CheckCircle size={56} style={{ color: "#10B981", margin: "0 auto 1.5rem" }} />
        <h2>Thank you for your order!</h2>
        <p className="page-section__text" style={{ margin: "0.5rem auto 1.5rem" }}>
          Your order has been received and is being processed. 
        </p>

        <div style={{ background: "var(--sirat-bg)", border: "1px solid var(--sirat-border)", padding: "1.5rem", borderRadius: "16px", marginBottom: "2rem", textAlign: "left" }}>
          <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--sirat-muted)", display: "block" }}>Order Tracking ID:</span>
            <strong style={{ fontSize: "1.35rem", color: "var(--sirat-gold-soft)", letterSpacing: "0.05em" }}>{orderId}</strong>
          </div>
          
          <div style={{ fontSize: "0.88rem", display: "grid", gap: "0.65rem", borderTop: "1px dashed var(--sirat-border)", paddingTop: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><User size={14} className="muted" style={{ color: "var(--sirat-gold-soft)" }} /> <span><strong>Recipient Name:</strong> {name}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Phone size={14} className="muted" style={{ color: "var(--sirat-gold-soft)" }} /> <span><strong>Contact Phone:</strong> {phone}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><MapPin size={14} className="muted" style={{ color: "var(--sirat-gold-soft)" }} /> <span><strong>Address:</strong> {address}, {city}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Scale size={14} className="muted" style={{ color: "var(--sirat-gold-soft)" }} /> <span><strong>Total Weight:</strong> {totalWeight.toFixed(2)} kg</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Truck size={14} className="muted" style={{ color: "var(--sirat-gold-soft)" }} /> <span><strong>Shipping Fee:</strong> ৳{shippingCharge}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><CreditCard size={14} className="muted" style={{ color: "var(--sirat-gold-soft)" }} /> <span><strong>Payment Method:</strong> {paymentMethod.toUpperCase() === "COD" ? "Cash on Delivery (COD)" : `${paymentMethod.toUpperCase().replace("MFS", "bKash/Nagad")} Wallet`}</span></div>
            {paySender && <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Smartphone size={14} className="muted" style={{ color: "var(--sirat-gold-soft)" }} /> <span><strong>Sender Number:</strong> {paySender}</span></div>}
            {payTxid && <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Key size={14} className="muted" style={{ color: "var(--sirat-gold-soft)" }} /> <span><strong>Transaction ID:</strong> {payTxid}</span></div>}
            <div style={{ borderTop: "1px solid var(--sirat-border)", paddingTop: "0.75rem", marginTop: "0.3rem", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Coins size={16} style={{ color: "var(--sirat-gold-soft)" }} /> <span><strong>Total Amount Confirmed:</strong> <strong style={{ color: "var(--sirat-gold-soft)" }}>৳{estimatedTotal}</strong></span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
          <Button variant="outline" onClick={() => navigate(`/track?id=${orderId}`)}>Track Shipment</Button>
        </div>
      </Panel>
    </PageFrame>
  );
}
