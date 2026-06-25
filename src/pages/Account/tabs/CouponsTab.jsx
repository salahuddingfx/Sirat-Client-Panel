import { useState } from "react";
import { Tag, Copy, Check, Clock } from "lucide-react";

const MOCK_COUPONS = [
  {
    code: "SIRAT15",
    discount: "15% OFF",
    description: "Get 15% off on your first order. Minimum order ৳1,000.",
    expiry: "2026-12-31",
    minOrder: 1000,
    active: true,
  },
  {
    code: "WELCOME10",
    discount: "10% OFF",
    description: "Welcome discount for new customers. No minimum order.",
    expiry: "2026-09-30",
    minOrder: 0,
    active: true,
  },
  {
    code: "SUMMER25",
    discount: "25% OFF",
    description: "Summer collection special. Minimum order ৳2,500.",
    expiry: "2026-06-30",
    minOrder: 2500,
    active: false,
  },
];

export default function CouponsTab() {
  const [copied, setCopied] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="dash-content-header">
        <h2>Coupons</h2>
        <p>Available discounts and promo codes for your orders.</p>
      </div>

      <div className="coupons-grid">
        {MOCK_COUPONS.map((coupon) => (
          <div key={coupon.code} className={`coupon-card ${!coupon.active ? "coupon-card--expired" : ""}`}>
            <div className="coupon-card__discount">{coupon.discount}</div>
            <div className="coupon-card__code">
              {coupon.code}
              <button className="coupon-card__copy-btn" onClick={() => handleCopy(coupon.code)}>
                {copied === coupon.code ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
            <div className="coupon-card__desc">{coupon.description}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.25rem" }}>
              <div className="coupon-card__expiry">
                <Clock size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                Expires {new Date(coupon.expiry).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
              <span className={`coupon-card__status coupon-card__status--${coupon.active ? "active" : "expired"}`}>
                {coupon.active ? "Active" : "Expired"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
