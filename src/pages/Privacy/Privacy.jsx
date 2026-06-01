import PageFrame from "@components/layout/PageFrame";
import { Panel } from "@components/ui";

export default function PrivacyPage() {
  return (
    <PageFrame
      eyebrow="Legal Specification"
      title="Privacy Policy"
      description="Last updated: May 31, 2026. Your privacy and data security are central to our luxury storefront experience."
    >
      <div className="policy-layout">
        <Panel className="page-card policy-card">
          <div className="policy-section">
            <h3>1. Information We Collect</h3>
            <p>
              We collect information you provide directly to us when making purchases, creating accounts, subscribing to newsletter drop alerts, or filling out contact forms. This includes details like name, shipping/billing addresses, payment info, and email addresses.
            </p>
          </div>

          <div className="policy-section">
            <h3>2. How We Use Your Data</h3>
            <p>
              We process data to complete order fulfillments, manage accounts, provide order tracking updates, run marketing and drop announcements, and optimize customer support interactions.
            </p>
          </div>

          <div className="policy-section">
            <h3>3. Third-Party Sharing</h3>
            <p>
              We do not sell your personal data. We share details with trusted third parties only to enable fulfillment (e.g., shipping carriers, payment processors like Stripe) and optimize services (e.g., website analytics).
            </p>
          </div>

          <div className="policy-section">
            <h3>4. Your Rights & Choice</h3>
            <p>
              Depending on your location (such as GDPR or CCPA regions), you have the right to request access to, correction of, or deletion of your personal data. You can opt out of marketing emails at any time using the unsubscribe link.
            </p>
          </div>
        </Panel>
      </div>
    </PageFrame>
  );
}
