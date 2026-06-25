import PageFrame from "@components/layout/PageFrame";
import { Panel } from "@components/ui";

export default function RefundPage() {
  return (
    <PageFrame
      eyebrow="Customer Service Specs"
      title="Refund & Return Policy"
      description="Last updated: May 31, 2026. We support 14-day hassle-free returns on all garments."
    >
      <div className="policy-layout">
        <Panel className="page-card policy-card">
          <div className="policy-section">
            <h3>1. Eligibility for Returns</h3>
            <p>
              To qualify for a refund, products must be returned within 14 days of delivery. The garments must be in their original unworn, unwashed, and undamaged condition, with all paper specs and security tags fully attached.
            </p>
          </div>

          <div className="policy-section">
            <h3>2. Exchange Procedures</h3>
            <p>
              To exchange an item for a different size or variant, please request an exchange through your customer profile page or contact our support team. Exchanges are processed immediately upon receipt of the returned package.
            </p>
          </div>

          <div className="policy-section">
            <h3>3. Refund Processing Time</h3>
            <p>
              Refunds are credited to the original payment method (e.g., credit card, bank transfer) once our warehouse verifies the returned item's quality. This inspection usually takes 3 to 5 business days from receipt.
            </p>
          </div>

          <div className="policy-section">
            <h3>4. Return Shipping Fees</h3>
            <p>
              Return shipping is free for all orders shipped within domestic regions. International returns may require return delivery shipping fees, which are deducted from the refunded amount.
            </p>
          </div>
        </Panel>
      </div>
    </PageFrame>
  );
}
