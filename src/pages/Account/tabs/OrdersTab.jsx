import { useState } from "react";
import { Package, RotateCcw, Eye, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrdersTab({ orders }) {
  const navigate = useNavigate();
  const [expandedOrder, setExpandedOrder] = useState(null);

  const handleReorder = (order) => {
    const cart = JSON.parse(localStorage.getItem("sirat_cart") || "[]");
    (order.items || []).forEach((item) => {
      const existing = cart.find((c) => c.productId === item.productId && c.size === item.size);
      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        cart.push({
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          size: item.size,
          quantity: item.quantity || 1,
        });
      }
    });
    localStorage.setItem("sirat_cart", JSON.stringify(cart));
    navigate("/cart");
  };

  return (
    <div>
      <div className="dash-content-header">
        <h2>Order History</h2>
        <p>View and manage all your past orders.</p>
      </div>

      <div className="orders-table">
        {orders.map((ord) => (
          <div key={ord._id} className="order-card">
            <div className="order-card__header">
              <div>
                <div className="order-card__id">{ord.orderId}</div>
                <div className="order-card__date">
                  Placed on {new Date(ord.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>
              <span className={`order-card__status order-card__status--${ord.status}`}>
                {ord.status}
              </span>
            </div>

            {/* Item thumbnails */}
            {ord.items && ord.items.length > 0 && (
              <div className="order-card__items">
                {ord.items.map((item, i) => (
                  <div key={i} className="order-card__item-thumb">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sirat-muted)" }}>
                        <Package size={20} strokeWidth={1.4} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="order-card__footer">
              <div>
                <div className="order-card__total">{'\u09F3'}{ord.totalAmount}</div>
                <span className={`order-card__payment order-card__payment--${ord.paymentStatus === "approved" ? "paid" : "unpaid"}`}>
                  {ord.paymentStatus === "approved" ? "Paid" : "Unpaid"}
                </span>
              </div>
              <div className="order-card__actions">
                <button className="order-btn" onClick={() => setExpandedOrder(expandedOrder === ord._id ? null : ord._id)}>
                  <Eye size={14} /> Details
                </button>
                {ord.status === "delivered" && (
                  <button className="order-btn order-btn--primary" onClick={() => handleReorder(ord)}>
                    <RotateCcw size={14} /> Re-order
                  </button>
                )}
              </div>
            </div>

            {/* Expanded details */}
            {expandedOrder === ord._id && (
              <div style={{ padding: "1rem", background: "var(--sirat-bg)", borderRadius: "12px", fontSize: "0.85rem" }}>
                {ord.items && ord.items.length > 0 && (
                  <div style={{ display: "grid", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    {ord.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--sirat-border)" }}>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          <span style={{ fontWeight: 600 }}>{item.name}</span>
                          {item.size && <span style={{ color: "var(--sirat-muted)", fontSize: "0.78rem" }}>({item.size})</span>}
                          <span style={{ color: "var(--sirat-muted)", fontSize: "0.78rem" }}>x{item.quantity || 1}</span>
                        </div>
                        <span style={{ fontWeight: 600 }}>{'\u09F3'}{item.price * (item.quantity || 1)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {ord.shippingAddress && (
                  <div style={{ color: "var(--sirat-muted)" }}>
                    <strong style={{ color: "var(--sirat-text)", fontSize: "0.82rem" }}>Shipping to:</strong>{" "}
                    {ord.shippingAddress.street}, {ord.shippingAddress.city} {ord.shippingAddress.zipCode}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {orders.length === 0 && (
          <div className="dash-empty">
            <Package size={40} strokeWidth={1.2} />
            <h4>No orders yet</h4>
            <p>Your order history will appear here once you make a purchase.</p>
          </div>
        )}
      </div>
    </div>
  );
}
