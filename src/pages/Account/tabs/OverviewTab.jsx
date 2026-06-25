import { Package, Heart, MapPin, ShoppingBag, TrendingUp } from "lucide-react";

export default function OverviewTab({ user, orders, wishlistCount, onNavigate }) {
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const deliveredCount = orders.filter(o => o.status === "delivered").length;

  return (
    <div>
      <div className="dash-content-header">
        <h2>Welcome back, {user?.name?.split(" ")[0] || "there"}</h2>
        <p>Here's a quick overview of your account.</p>
      </div>

      <div className="dash-stats">
        <div className="dash-stat-card">
          <div className="dash-stat-card__icon dash-stat-card__icon--gold">
            <Package size={18} />
          </div>
          <span className="dash-stat-card__value">{orders.length}</span>
          <span className="dash-stat-card__label">Total Orders</span>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-card__icon dash-stat-card__icon--green">
            <TrendingUp size={18} />
          </div>
          <span className="dash-stat-card__value">{'\u09F3'}{totalSpent.toLocaleString()}</span>
          <span className="dash-stat-card__label">Total Spent</span>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-card__icon dash-stat-card__icon--blue">
            <ShoppingBag size={18} />
          </div>
          <span className="dash-stat-card__value">{deliveredCount}</span>
          <span className="dash-stat-card__label">Delivered</span>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-card__icon dash-stat-card__icon--pink">
            <Heart size={18} />
          </div>
          <span className="dash-stat-card__value">{wishlistCount}</span>
          <span className="dash-stat-card__label">Wishlisted</span>
        </div>
      </div>

      <h3 style={{ margin: "0 0 1rem", fontSize: "1.05rem" }}>Recent Activity</h3>
      <div className="dash-activity">
        {orders.slice(0, 5).map((ord) => (
          <div key={ord._id} className="dash-activity-item">
            <div className="dash-activity-item__icon">
              <Package size={16} />
            </div>
            <div className="dash-activity-item__content">
              <div className="dash-activity-item__title">Order {ord.orderId}</div>
              <div className="dash-activity-item__meta">
                {new Date(ord.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
            <div className="dash-activity-item__amount">
              {'\u09F3'}{ord.totalAmount}
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="dash-empty">
            <Package size={40} strokeWidth={1.2} />
            <h4>No orders yet</h4>
            <p>Start shopping to see your orders here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
