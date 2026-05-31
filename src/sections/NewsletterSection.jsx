import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Panel, Button } from "../lib/ui";

export default function NewsletterSection() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <section className="newsletter-section">
      <Panel className="page-card newsletter-panel">
        <div className="newsletter-inner">
          <div className="newsletter-copy">
            <div className="storefront__badge">
              <Mail size={14} /> Newsletter
            </div>
            <h2 className="newsletter-title" style={{ marginTop: "0.5rem" }}>Stay Synced with Drops</h2>
            <p className="page-section__text">
              Subscribe to receive early catalog access keys, shipping waivers, and private collections drops notification.
            </p>
          </div>
          <div className="newsletter-action">
            {newsletterSubscribed ? (
              <div className="newsletter-success">
                <CheckCircle2 size={24} className="success-icon" />
                <div>
                  <strong>Welcome to the drop queue</strong>
                  <p className="helper">Early access key has been queued for your inbox.</p>
                </div>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <Button type="submit">Subscribe</Button>
              </form>
            )}
          </div>
        </div>
      </Panel>
    </section>
  );
}
