import { useState } from "react";
import { Package, Heart, ShoppingBag, TrendingUp, Search, Copy, Check, Smartphone, Share2, Gift, Star, ExternalLink, Truck } from "lucide-react";
import { trackOrder } from "../../../api/queries";

export default function OverviewTab({ user, orders, wishlistCount, onNavigate }) {
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const deliveredCount = orders.filter(o => o.status === "delivered").length;

  // Order Tracking
  const [trackId, setTrackId] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [tracking, setTracking] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackId.trim()) return;
    setTracking(true);
    setTrackResult(null);
    try {
      const res = await trackOrder({ orderId: trackId.trim(), email: user?.email });
      if (res?.success && res.data) {
        setTrackResult(res.data);
      } else {
        setTrackResult({ error: res?.message || "Order not found." });
      }
    } catch (err) {
      setTrackResult({ error: "Could not track this order." });
    }
    setTracking(false);
  };

  // Referral
  const [copied, setCopied] = useState(false);
  const referralCode = user?.referralCode || user?.username?.toUpperCase()?.slice(0, 6) || "SIRAT";
  const referralLink = `https://siratclothing.com?ref=${referralCode}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareReferral = () => {
    if (navigator.share) {
      navigator.share({ title: "Join Sirat", text: "Use my referral link for a special discount!", url: referralLink });
    } else {
      handleCopyReferral();
    }
  };

  // Loyalty points (mock calculation)
  const loyaltyPoints = Math.floor(totalSpent / 100);
  const nextTier = loyaltyPoints < 500 ? "Silver" : loyaltyPoints < 1500 ? "Gold" : "Platinum";
  const tierProgress = loyaltyPoints < 500 ? (loyaltyPoints / 500) * 100 : loyaltyPoints < 1500 ? ((loyaltyPoints - 500) / 1000) * 100 : 100;

  return (
    <div>
      <div className="dash-content-header">
        <h2>Welcome back, {user?.name?.split(" ")[0] || "there"}</h2>
        <p>Here's a quick overview of your account.</p>
      </div>

      {/* Stats */}
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

      {/* Quick Actions Grid */}
      <div className="dash-quick-grid">

        {/* Order Tracking */}
        <div className="dash-quick-card">
          <div className="dash-quick-card__header">
            <div className="dash-quick-card__icon dash-quick-card__icon--blue">
              <Truck size={18} />
            </div>
            <h3>Track Order</h3>
          </div>
          <form onSubmit={handleTrack} className="dash-track-form">
            <input
              className="form-input"
              placeholder="Enter Order ID"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
            />
            <button type="submit" className="order-btn order-btn--primary" disabled={tracking}>
              <Search size={14} /> {tracking ? "Tracking..." : "Track"}
            </button>
          </form>
          {trackResult && !trackResult.error && (
            <div className="dash-track-result">
              <div className="dash-track-result__row">
                <span className="dash-track-result__label">Status</span>
                <span className={`order-card__status order-card__status--${trackResult.status}`}>{trackResult.status}</span>
              </div>
              {trackResult.estimatedDelivery && (
                <div className="dash-track-result__row">
                  <span className="dash-track-result__label">Est. Delivery</span>
                  <span>{trackResult.estimatedDelivery}</span>
                </div>
              )}
            </div>
          )}
          {trackResult?.error && (
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.82rem", color: "#dc2626" }}>{trackResult.error}</p>
          )}
        </div>

        {/* Referral Code */}
        <div className="dash-quick-card">
          <div className="dash-quick-card__header">
            <div className="dash-quick-card__icon dash-quick-card__icon--gold">
              <Gift size={18} />
            </div>
            <h3>Refer & Earn</h3>
          </div>
          <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: "var(--sirat-muted)", lineHeight: 1.5 }}>
            Share your link and earn <strong style={{ color: "var(--sirat-gold)" }}>৳150 credit</strong> for each friend who orders.
          </p>
          <div className="dash-referral-box">
            <code className="dash-referral-code">{referralCode}</code>
            <button className="order-btn" onClick={handleCopyReferral} style={{ gap: "0.35rem" }}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button className="order-btn" onClick={handleShareReferral} style={{ gap: "0.35rem" }}>
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>

        {/* Loyalty / Rewards */}
        <div className="dash-quick-card">
          <div className="dash-quick-card__header">
            <div className="dash-quick-card__icon dash-quick-card__icon--gold">
              <Star size={18} />
            </div>
            <h3>Rewards</h3>
          </div>
          <div className="dash-loyalty">
            <div className="dash-loyalty__points">
              <span className="dash-loyalty__num">{loyaltyPoints}</span>
              <span className="dash-loyalty__label">points earned</span>
            </div>
            <div className="dash-loyalty__tier">
              <span className="dash-loyalty__tier-name">{nextTier} Member</span>
              <div className="dash-loyalty__bar">
                <div className="dash-loyalty__bar-fill" style={{ width: `${tierProgress}%` }} />
              </div>
              <span className="dash-loyalty__tier-next">
                {nextTier === "Platinum" ? "Max tier reached" : `${500 - loyaltyPoints} pts to next tier`}
              </span>
            </div>
          </div>
        </div>

        {/* Download App */}
        <div className="dash-quick-card dash-quick-card--app">
          <div className="dash-quick-card__header">
            <div className="dash-quick-card__icon dash-quick-card__icon--green">
              <Smartphone size={18} />
            </div>
            <h3>Get the App</h3>
          </div>
          <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: "var(--sirat-muted)", lineHeight: 1.5 }}>
            Shop faster with the Sirat Android app. Track orders, get exclusive app-only deals, and checkout in seconds.
          </p>
          <a href="/app-release.apk" download className="order-btn order-btn--primary" style={{ width: "fit-content", gap: "0.4rem" }}>
            <Smartphone size={14} /> Download APK
          </a>
        </div>

      </div>

      {/* Recent Activity */}
      <h3 style={{ margin: "2rem 0 1rem", fontSize: "1.05rem" }}>Recent Activity</h3>
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
