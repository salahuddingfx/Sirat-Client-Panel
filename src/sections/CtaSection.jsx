import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import { Button } from "../lib/ui";

export default function CtaSection() {
  return (
    <section className="homepage-cta-section">
      <div className="homepage-cta-card">
        <div className="cta-overlay" />
        <div className="cta-content">
          <span className="storefront__badge">
            <Tag size={12} style={{ marginRight: "4px" }} /> CODE: LAUNCH15
          </span>
          <h2 className="cta-title">UPGRADE YOUR SILHOUETTE</h2>
          <p className="cta-desc">
            Secure 15% off your initial order and join our release registry queue. Experience structured luxury tailoring shipped with express fulfillment.
          </p>
          <div className="cta-buttons">
            <Link to="/shop">
              <Button>Shop the Drop</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline">
                Join Drop Queue
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
