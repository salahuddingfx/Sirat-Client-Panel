import { Link } from "react-router-dom";
import { Facebook, Instagram, Compass } from "lucide-react";
import { useSettings } from "@app/providers/settings";

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="storefront__footer">
      <div className="storefront__footer-container">
        <div className="footer-grid">
          {/* Brand Block */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <Link to="/" className="storefront__brand-link footer-brand-link">
                <img src="/Sirat.png" alt="SIRAT Logo" className="storefront__brand-mark footer-brand-mark" />
                <span className="sirat-brand-text">SIRAT</span>
              </Link>
              <span className="storefront__brand-tagline">
                <Compass size={11} /> {settings.tagline}
              </span>
            </div>
            <p className="footer-desc" style={{ fontSize: "0.92rem", lineHeight: "1.6" }}>
              {settings.description}
            </p>
            <div className="footer-socials">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
              )}
            </div>
          </div>
 
          {/* Links container */}
          <div className="footer-links-container">
            {/* Support links */}
            <div className="footer-col">
              <h4>Customer Care</h4>
              <ul className="footer-links">
                <li><Link to="/contact">Contact Support</Link></li>
                <li><Link to="/track">Track Order</Link></li>
                <li><Link to="/faq">FAQ Support</Link></li>
                <li><Link to="/sizing">Sizing Guide</Link></li>
                <li><Link to="/reviews">Customer Reviews</Link></li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="footer-col contact-col">
              <h4>Get in Touch</h4>
              <ul className="footer-links contact-details-list" style={{ display: "grid", gap: "0.85rem" }}>
                <li style={{ color: "var(--sirat-muted)", fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                  <span style={{ fontWeight: "600", color: "var(--sirat-text)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>Support Hotline</span>
                  <span>{settings.phone}</span>
                </li>
                <li style={{ color: "var(--sirat-muted)", fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                  <span style={{ fontWeight: "600", color: "var(--sirat-text)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>Email Address</span>
                  <span style={{ wordBreak: "break-all" }}>{settings.email}</span>
                </li>
                <li style={{ color: "var(--sirat-muted)", fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                  <span style={{ fontWeight: "600", color: "var(--sirat-text)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>Corporate Office</span>
                  <span>{settings.address}</span>
                </li>
              </ul>
            </div>
 
            {/* Legal links */}
            <div className="footer-col">
              <h4>Legal</h4>
              <ul className="footer-links">
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/refund">Refund & Return Policy</Link></li>
                <li><Link to="/cookie">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
 
        <div className="storefront__footer-inner">
          <span>&copy; 2026 SIRAT Clothing. All rights reserved. ({settings.tagline})</span>
          <span>Premium custom printed clothing drops.</span>
        </div>
      </div>
    </footer>
  );
}
