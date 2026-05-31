import PageFrame from "../../components/layout/PageFrame";
import { Panel } from "../../components/ui";

export default function CookiePage() {
  return (
    <PageFrame
      eyebrow="Legal Specification"
      title="Cookie Policy"
      description="Last updated: May 31, 2026. This policy explains how we utilize cookies to enhance your storefront experience."
    >
      <div className="policy-layout">
        <Panel className="page-card policy-card">
          <div className="policy-section">
            <h3>1. What Are Cookies?</h3>
            <p>
              Cookies are small text files stored on your computer or mobile device by websites you visit. They are widely used to make websites work, remember preferences, and provide analytical data to website owners.
            </p>
          </div>

          <div className="policy-section">
            <h3>2. Cookies We Use</h3>
            <p>
              We use both session cookies (which expire when you close your browser) and persistent cookies (which remain on your device until deleted). These cookies fall into three categories:
            </p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required to maintain shopping cart items, manage user sessions, and enable checkout.</li>
              <li><strong>Performance & Analytics:</strong> Used to understand how visitors interact with storefront pages, identifying errors or load bottlenecks.</li>
              <li><strong>Marketing:</strong> Used to show tailored drop promotions based on browsing history.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h3>3. Managing Cookie Preferences</h3>
            <p>
              Most web browsers allow you to control cookies through browser settings. Disabling essential cookies may prevent you from using certain e-commerce features (like adding items to the cart).
            </p>
          </div>
        </Panel>
      </div>
    </PageFrame>
  );
}
