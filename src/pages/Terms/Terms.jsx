import PageFrame from "../../components/layout/PageFrame";
import { Panel } from "../../components/ui";

export default function TermsPage() {
  return (
    <PageFrame
      eyebrow="Legal Specification"
      title="Terms of Service"
      description="Last updated: May 31, 2026. Please read these terms carefully before using our storefront service."
    >
      <div className="policy-layout">
        <Panel className="page-card policy-card">
          <div className="policy-section">
            <h3>1. Introduction & Acceptance</h3>
            <p>
              Welcome to SIRAT ("we," "us," or "our"). By accessing or using our website, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to all of these terms, please do not use our storefront.
            </p>
          </div>

          <div className="policy-section">
            <h3>2. Purchase & Payments</h3>
            <p>
              All purchases made through our storefront are subject to product availability. We reserve the right to limit the quantity of products we supply or refuse orders at our sole discretion. Prices are shown in USD and do not include shipping fees or customs duties, which are calculated at checkout.
            </p>
          </div>

          <div className="policy-section">
            <h3>3. Intellectual Property</h3>
            <p>
              All content on this website, including text, graphics, logos, images, video clips, and designs, is the property of SIRAT and protected by international trademark and copyright laws. No portion of this site may be reproduced without our express written consent.
            </p>
          </div>

          <div className="policy-section">
            <h3>4. Account & User Security</h3>
            <p>
              If you create an account on our storefront, you are responsible for maintaining the confidentiality of your login credentials and restricting unauthorized access. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </div>

          <div className="policy-section">
            <h3>5. Limitation of Liability</h3>
            <p>
              In no event shall SIRAT, its directors, or its affiliates be liable for any indirect, incidental, or consequential damages arising out of the use of our garments or storefront access.
            </p>
          </div>
        </Panel>
      </div>
    </PageFrame>
  );
}
