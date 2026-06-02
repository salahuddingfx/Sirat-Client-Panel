import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, PackageSearch, Package, Truck, ArrowRight, User, MapPin, Calendar, ShieldCheck, Shirt, Check, Clipboard, Settings, Home, CreditCard } from "lucide-react";
import PageFrame from "@components/layout/PageFrame";
import { Button, Panel } from "@components/ui";
import SEO from "@components/layout/SEO";
import "./Track.css";

// Initial Seed Mock Orders to test different statuses and payment methods immediately
const MOCK_ORDERS = [
  {
    orderId: "SRT-26CHO-WIYH",
    name: "Salah Uddin Kader",
    phone: "01851075537",
    email: "salahuddin@email.com",
    address: "Beiterek Tower, Left Bank",
    city: "Cox's Bazar",
    totalWeight: 0.70,
    shippingCharge: 70,
    paymentMethod: "cod",
    paySender: "",
    payTxid: "",
    estimatedTotal: 320,
    date: "May 31, 2026 09:55 PM",
    status: "received",
    items: [
      { id: "p1", name: "OAT-BAR OVERSIZED TEE", category: "Oversized Tees", price: 250, quantity: 1, variantLabel: "M" }
    ]
  },
  {
    orderId: "SRT-48NGA-ZXYZ",
    name: "Tanvir Ahmed",
    phone: "01711223344",
    email: "tanvir@email.com",
    address: "House 24, Road 5, Banani",
    city: "Dhaka",
    totalWeight: 1.20,
    shippingCharge: 120,
    paymentMethod: "bkash",
    paySender: "01711223344",
    payTxid: "BKSH98765432",
    estimatedTotal: 1840,
    date: "May 30, 2026 04:20 PM",
    status: "shipping",
    items: [
      { id: "p2", name: "LUMINA COMPRESSION TEE", category: "Essentials", price: 860, quantity: 1, variantLabel: "L" },
      { id: "p3", name: "HEAVYWEIGHT ZIP HOODIE", category: "Outerwear", price: 860, quantity: 1, variantLabel: "XL" }
    ]
  },
  {
    orderId: "SRT-99NGD-AAAA",
    name: "Salah Uddin Kader",
    phone: "01851075537",
    email: "salahuddin@email.com",
    address: "Beiterek Tower, Left Bank",
    city: "Cox's Bazar",
    totalWeight: 0.35,
    shippingCharge: 70,
    paymentMethod: "nagad",
    paySender: "01851075537",
    payTxid: "NGD55443322",
    estimatedTotal: 930,
    date: "May 29, 2026 10:15 AM",
    status: "delivered",
    items: [
      { id: "p4", name: "ZENITH STREET PANTS", category: "Bottoms", price: 860, quantity: 1, variantLabel: "M" }
    ]
  }
];

const STATUS_STEPS = ["received", "processed", "packaged", "shipping", "delivered"];

export default function TrackPage() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const [query, setQuery] = useState(initialId);
  const [foundOrders, setFoundOrders] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Load all merged orders (local storage + mock seed data)
  const getMergedOrders = () => {
    try {
      const local = JSON.parse(localStorage.getItem("sirat_orders") || "[]");
      return [...local, ...MOCK_ORDERS];
    } catch (e) {
      return MOCK_ORDERS;
    }
  };

  const handleSearch = (searchVal) => {
    const val = searchVal.trim().toLowerCase();
    if (!val) {
      setFoundOrders([]);
      setSearchAttempted(false);
      return;
    }

    const allOrders = getMergedOrders();
    const matches = allOrders.filter((order) => {
      const orderIdStr = order.orderId || "";
      const phoneStr = order.phone || "";
      const emailStr = order.email || "";
      const nameStr = order.name || "";

      const cleanOrderId = orderIdStr.toLowerCase().replace("srt-", "");
      const cleanSearch = val.replace("srt-", "").replace("#", "");
      const safe = (n) => isNaN(Number(n)) ? 0 : Number(n);
      
      const idMatch = cleanOrderId === cleanSearch || orderIdStr.toLowerCase() === val;
      const phoneMatch = phoneStr.toLowerCase().includes(val);
      const emailMatch = emailStr.toLowerCase().includes(val);
      const nameMatch = nameStr.toLowerCase().includes(val);
      
      return idMatch || phoneMatch || emailMatch || nameMatch;
    });

    setFoundOrders(matches);
    setSearchAttempted(true);
  };

  useEffect(() => {
    if (initialId) {
      handleSearch(initialId);
    }
  }, [initialId]);

  const getStepIcon = (step) => {
    switch (step) {
      case "received": return <Clipboard size={16} />;
      case "processed": return <Settings size={16} />;
      case "packaged": return <Package size={16} />;
      case "shipping": return <Truck size={16} />;
      case "delivered": return <Home size={16} />;
      default: return <Package size={16} />;
    }
  };

  const getStepLabel = (step) => {
    switch (step) {
      case "received": return "Order Received";
      case "processed": return "Order Processed";
      case "packaged": return "Packaged";
      case "shipping": return "Shipping";
      case "delivered": return "Delivered";
      default: return "";
    }
  };

  const getStatusTitle = (status) => {
    switch (status) {
      case "received": return "Order Received";
      case "processed": return "Processing Garment";
      case "packaged": return "Parcel Packaged";
      case "shipping": return "Package in Transit";
      case "delivered": return "Delivered Successfully";
      default: return "Order Processing";
    }
  };

  const renderPaymentCard = (order) => {
    const safe = (n) => isNaN(Number(n)) ? 0 : Number(n);
    let cardBg = "linear-gradient(135deg, #1A1816 0%, #2A2622 100%)";
    let cardTitle = "Cash on Delivery";
    let cardNum = "****  ****  ****  COD";
    let cardStatus = "UNPAID";
    let statusBg = "rgba(239, 68, 68, 0.15)";
    let statusColor = "#EF4444";

    if (order.paymentMethod === "bkash") {
      cardBg = "linear-gradient(135deg, #E2136E 0%, #A00C4D 100%)";
      cardTitle = "bKash Wallet";
      cardNum = `****  ****  ****  ${order.paySender ? order.paySender.slice(-4) : "BKSH"}`;
      cardStatus = "PAID";
      statusBg = "rgba(16, 185, 129, 0.18)";
      statusColor = "#10B981";
    } else if (order.paymentMethod === "nagad") {
      cardBg = "linear-gradient(135deg, #F57C00 0%, #B85F00 100%)";
      cardTitle = "Nagad Wallet";
      cardNum = `****  ****  ****  ${order.paySender ? order.paySender.slice(-4) : "NGD"}`;
      cardStatus = "PAID";
      statusBg = "rgba(16, 185, 129, 0.18)";
      statusColor = "#10B981";
    }

    return (
      <div style={{
        width: "250px",
        height: "140px",
        background: cardBg,
        borderRadius: "14px",
        padding: "1.1rem 1.2rem",
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 10px 25px rgba(28, 26, 23, 0.15)",
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        marginRight: "0.5rem"
      }}>
        {/* Card Top */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* Gold Chip */}
          <div style={{
            width: "34px",
            height: "24px",
            background: "linear-gradient(135deg, #F0C419 0%, #C99E0F 100%)",
            borderRadius: "5px",
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4)"
          }} />
          <span style={{
            fontSize: "0.62rem",
            background: statusBg,
            color: statusColor,
            padding: "0.2rem 0.5rem",
            borderRadius: "5px",
            fontWeight: "800",
            letterSpacing: "0.03em"
          }}>{cardStatus}</span>
        </div>

        {/* Card Middle */}
        <div style={{ fontSize: "1.05rem", fontWeight: "700", letterSpacing: "0.1em", margin: "0.4rem 0" }}>
          {cardNum}
        </div>

        {/* Card Bottom */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: "0.68rem" }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: "125px" }}>
            <span style={{ fontSize: "0.5rem", opacity: 0.6, textTransform: "uppercase" }}>Cardholder</span>
            <strong style={{ textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {order.name}
            </strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: "0.5rem", opacity: 0.6, textTransform: "uppercase" }}>{cardTitle}</span>
            <strong style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100px" }}>
              {order.paymentMethod === "cod" ? "Collect Cash" : `TxID: ${order.payTxid || "N/A"}`}
            </strong>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageFrame
      eyebrow="ORDER STATUS"
      title="Where is my Product?"
      description="Stay updated with your order's journey from our printing workshop to your doorstep."
    >
      <SEO title="Track Order" description="Track your premium custom printed clothing drop. Enter your Order ID or registered phone number." />
      
      {/* Search Console */}
      <Panel className="page-card" style={{ maxWidth: "680px", margin: "0 auto 3.5rem", padding: "1.25rem", borderRadius: "16px" }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
            <Search size={18} style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "var(--sirat-muted)" }} />
            <input
              type="text"
              placeholder="Order ID (e.g. SRT-26CHO-WIYH) or Phone Number..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.9rem 1rem 0.9rem 3.2rem",
                borderRadius: "99px",
                border: "1px solid var(--sirat-border)",
                background: "var(--sirat-bg)",
                outline: "none",
                fontSize: "0.95rem",
                fontWeight: "500",
                color: "var(--sirat-text)"
              }}
            />
          </div>
          <Button type="submit" style={{ borderRadius: "99px", padding: "0 2rem", fontSize: "0.9rem", fontWeight: "700", minHeight: "48px" }}>
            Track Now <ArrowRight size={14} style={{ marginLeft: "6px" }} />
          </Button>
        </form>
      </Panel>

      {/* Results View */}
      {searchAttempted && foundOrders.length === 0 && (
        <Panel className="shop-empty-state" style={{ padding: "4rem 2rem", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
          <PackageSearch size={48} className="muted" style={{ margin: "0 auto 1.5rem", color: "var(--sirat-gold)" }} />
          <h3>No Orders Found</h3>
          <p className="page-section__text">
            We couldn't find any orders associated with <strong>"{query}"</strong>. Double check your input ID or Phone Number and try again.
          </p>
        </Panel>
      )}

      {foundOrders.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
          {foundOrders.map((order) => {
            const safe = (n) => isNaN(Number(n)) ? 0 : Number(n);
            const activeStepIndex = STATUS_STEPS.indexOf(order.status);
            const gi = order.guestInfo || order;
            const itemTotal = order.items?.reduce((sum, i) => sum + safe(i.price) * safe(i.quantity), 0) || 0;
            const discount = Math.max(0, itemTotal + safe(order.shippingCharge) - safe(order.estimatedTotal));
            const isPaid = order.paymentMethod && order.paymentMethod !== "cod";

            return (
              <Panel key={order.orderId} style={{ padding: "2.5rem clamp(1.25rem, 4vw, 2.5rem)", borderRadius: "24px", border: "1px solid var(--sirat-border)", boxShadow: "0 10px 40px rgba(0,0,0,0.02)" }}>
                {/* 1. Timeline Header */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--sirat-border)", paddingBottom: "1.75rem", marginBottom: "2.5rem" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--sirat-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>Current Status</span>
                    <strong style={{ fontSize: "1.65rem", color: "var(--sirat-text)", fontFamily: "Space Grotesk, sans-serif" }}>
                      {getStatusTitle(order.status)}
                    </strong>
                  </div>
                  <div style={{ textAlign: "left", mdTextAlign: "right" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--sirat-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>Tracking ID</span>
                    <strong style={{ fontSize: "1.35rem", color: "var(--sirat-gold-soft)", fontFamily: "Space Grotesk, sans-serif" }}>
                      #{order.orderId}
                    </strong>
                  </div>
                </div>

                {/* 2. Progress Timeline */}
                <div className="track-timeline">
                  <div className="track-timeline-line" style={{ width: `${(activeStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }} />

                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx < activeStepIndex;
                    const isActive = idx === activeStepIndex;

                    return (
                      <div key={step} className={`track-step ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}>
                        <div className="track-step-dot">
                          {isCompleted ? <Check size={16} strokeWidth={2.5} /> : getStepIcon(step)}
                          {isActive && <div className="track-step-glow" />}
                        </div>
                        <div className="track-step-info">
                          <span className="track-step-label">{getStepLabel(step)}</span>
                          <span className={`track-step-status ${isActive ? "status-active" : isCompleted ? "status-done" : "status-pending"}`}>
                            {isActive ? "In Progress" : isCompleted ? "Completed" : "Pending"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 3. Detailed Stats Grid Split */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
                  
                  {/* Left Column: Order Content */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <Panel style={{ padding: "1.75rem", borderRadius: "16px", background: "var(--sirat-bg)", border: "1px solid var(--sirat-border)", flex: 1 }}>
                      <h4 style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0 0 1.5rem", borderBottom: "1px solid var(--sirat-border)", paddingBottom: "0.75rem" }}>
                        <Package size={18} style={{ color: "var(--sirat-gold)" }} />
                        <span>Order Content</span>
                        <span style={{ marginLeft: "auto", fontSize: "0.7rem", background: "rgba(197, 160, 89, 0.1)", padding: "0.2rem 0.6rem", borderRadius: "99px", color: "var(--sirat-gold-soft)", fontWeight: "700" }}>
                          {order.items?.length || 1} ITEMS
                        </span>
                      </h4>

                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                        {order.items?.map((item, i) => {
                          const itemName = item.name || item.product?.name || "Item";
                          const itemSize = item.variantLabel || item.variant || item.product?.variant || "—";
                          return (
                          <div key={item._id || item.id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--sirat-border)", paddingBottom: "0.85rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div style={{ width: "48px", height: "48px", background: "var(--sirat-surface)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--sirat-border)", flexShrink: 0 }}>
                                <Shirt size={20} style={{ color: "var(--sirat-gold)" }} />
                              </div>
                              <div>
                                <strong style={{ display: "block", fontSize: "0.88rem", textTransform: "uppercase", color: "var(--sirat-text)" }}>{itemName}</strong>
                                <span style={{ fontSize: "0.72rem", color: "var(--sirat-muted)", display: "flex", gap: "0.5rem", marginTop: "0.15rem" }}>
                                  <span>QTY: <strong>{item.quantity}</strong></span>
                                  <span>•</span>
                                  <span>Size: <strong>{itemSize}</strong></span>
                                </span>
                              </div>
                            </div>
                            <strong style={{ fontSize: "0.9rem", color: "var(--sirat-text)" }}>{'\u09F3'}{safe(item.price) * safe(item.quantity)}</strong>
                          </div>
                          );
                        })}
                      </div>

                      <div style={{ display: "grid", gap: "0.55rem", fontSize: "0.82rem", borderBottom: "1px solid var(--sirat-border)", paddingBottom: "0.85rem", marginBottom: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "var(--sirat-muted)" }}>Subtotal</span>
                          <strong>{'\u09F3'}{itemTotal}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "var(--sirat-muted)" }}>Delivery Fee</span>
                          <strong>{'\u09F3'}{safe(order.shippingCharge)}</strong>
                        </div>
                        {discount > 0 && (
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#10B981" }}>Discount</span>
                            <strong style={{ color: "#10B981" }}>-{'\u09F3'}{discount}</strong>
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                        <div>
                          <span style={{ fontSize: "0.75rem", color: "var(--sirat-muted)" }}>{isPaid ? "Total Paid" : "Total Payable"}</span>
                          <strong style={{ display: "block", fontSize: "1.5rem", color: "var(--sirat-gold-soft)", fontFamily: "Space Grotesk, sans-serif" }}>
                            {'\u09F3'}{safe(order.estimatedTotal)}
                          </strong>
                        </div>
                        {renderPaymentCard(order)}
                      </div>
                    </Panel>
                  </div>

                  {/* Right Column: Shipping & Verification */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {/* Shipping info */}
                    <Panel style={{ padding: "1.75rem", borderRadius: "16px", background: "var(--sirat-bg)", border: "1px solid var(--sirat-border)" }}>
                      <h4 style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0 0 1.5rem", borderBottom: "1px solid var(--sirat-border)", paddingBottom: "0.75rem" }}>
                        <MapPin size={18} style={{ color: "var(--sirat-gold)" }} />
                        <span>Shipping Coordinates</span>
                      </h4>

                      <div style={{ display: "grid", gap: "1.2rem" }}>
                        {/* Customer */}
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--sirat-surface)", border: "1px solid var(--sirat-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sirat-gold)", flexShrink: 0 }}>
                            <User size={16} />
                          </div>
                          <div>
                            <span style={{ fontSize: "0.68rem", color: "var(--sirat-muted)", display: "block" }}>Recipient Name</span>
                            <strong style={{ fontSize: "0.9rem" }}>{gi.name}</strong>
                            <span style={{ display: "block", fontSize: "0.8rem", color: "var(--sirat-muted)", marginTop: "0.05rem" }}>{gi.phone}</span>
                          </div>
                        </div>

                        {/* Address */}
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--sirat-surface)", border: "1px solid var(--sirat-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sirat-gold)", flexShrink: 0 }}>
                            <MapPin size={16} />
                          </div>
                          <div>
                            <span style={{ fontSize: "0.68rem", color: "var(--sirat-muted)", display: "block" }}>Delivery Address</span>
                            <strong style={{ fontSize: "0.9rem" }}>{gi.address}</strong>
                            <span style={{ display: "block", fontSize: "0.8rem", color: "var(--sirat-muted)", marginTop: "0.05rem" }}>{gi.city}</span>
                          </div>
                        </div>

                        {/* Order Date */}
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--sirat-surface)", border: "1px solid var(--sirat-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sirat-gold)", flexShrink: 0 }}>
                            <Calendar size={16} />
                          </div>
                          <div>
                            <span style={{ fontSize: "0.68rem", color: "var(--sirat-muted)", display: "block" }}>Order Date</span>
                            <strong style={{ fontSize: "0.9rem" }}>{order.date || new Date(order.createdAt).toLocaleDateString()}</strong>
                          </div>
                        </div>
                      </div>
                    </Panel>

                    {/* Authenticity badge */}
                    <div style={{
                      background: "rgba(16, 185, 129, 0.06)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      borderRadius: "16px",
                      padding: "1.5rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10B981", fontWeight: "800", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        <ShieldCheck size={18} /> Authenticity Verified
                      </div>
                      <strong style={{ fontSize: "1.05rem", color: "var(--sirat-text)" }}>Safe & Secure Dispatch</strong>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--sirat-muted)", lineHeight: "1.5" }}>
                        Your package is hand-packaged and shipped directly from our printing workshop in Cox's Bazar. Premium combed cotton stitch quality assured.
                      </p>
                    </div>
                  </div>

                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </PageFrame>
  );
}
