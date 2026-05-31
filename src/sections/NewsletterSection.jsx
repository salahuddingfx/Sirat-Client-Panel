import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Panel className="page-card newsletter-panel">
          <div className="newsletter-inner">
            <motion.div 
              className="newsletter-copy"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="storefront__badge">
                <Mail size={14} /> Newsletter
              </div>
              <h2 className="newsletter-title" style={{ marginTop: "0.5rem" }}>Stay Synced with Drops</h2>
              <p className="page-section__text">
                Subscribe to receive early catalog access keys, shipping waivers, and private collections drops notification.
              </p>
            </motion.div>
            <motion.div 
              className="newsletter-action"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {newsletterSubscribed ? (
                <motion.div 
                  className="newsletter-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <CheckCircle2 size={24} className="success-icon" />
                  <div>
                    <strong>Welcome to the drop queue</strong>
                    <p className="helper">Early access key has been queued for your inbox.</p>
                  </div>
                </motion.div>
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
            </motion.div>
          </div>
        </Panel>
      </motion.div>
    </section>
  );
}
