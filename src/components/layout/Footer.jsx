import { Link } from "react-router-dom";
import { Facebook, Instagram, Compass, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="storefront__footer">
      <div className="storefront__footer-container">
        <div className="footer-grid">
          {/* Brand Block */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <Link to="/" className="storefront__brand-link footer-brand-link">
                <img src="/Sirat.jpg" alt="SIRAT Logo" className="storefront__brand-mark footer-brand-mark" />
                <span className="sirat-brand-text">SIRAT</span>
              </Link>
              <span className="storefront__brand-tagline">
                <Compass size={11} /> Purity in Every Step
              </span>
            </div>
            <p className="footer-desc" style={{ fontSize: "0.92rem", lineHeight: "1.6" }}>
              আপনার পোশাকে আসুক শুদ্ধতার ছোঁয়া। আমরা বিশ্বাস করি কোয়ালিটি এবং সততায়। imported premium fabric এবং 100% combed cotton এ তৈরি কাস্টম প্রিন্টেড টি-শার্টের নির্ভরযোগ্য ঠিকানা।
            </p>
            <div className="footer-socials">
              <a href="https://www.facebook.com/sirat2026" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>
 
          {/* Links container */}
          <div className="footer-links-container">
            {/* Collections links */}
            <div className="footer-col">
              <h4>Collections</h4>
              <ul className="footer-links">
                <li><Link to="/shop">Oversized T-Shirts</Link></li>
                <li><Link to="/shop">Custom Prints</Link></li>
                <li><Link to="/shop">Puff Print Collection</Link></li>
                <li><Link to="/shop">Premium Essentials</Link></li>
              </ul>
            </div>
 
            {/* Support links */}
            <div className="footer-col">
              <h4>Customer Care</h4>
              <ul className="footer-links">
                <li><Link to="/contact">Contact Support</Link></li>
                <li><Link to="/track">Track Order</Link></li>
                <li><Link to="/reviews">Customer Reviews</Link></li>
                <li><Link to="/">Sizing Guide</Link></li>
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
          <span>&copy; 2026 SIRAT Clothing. All rights reserved. (Purity in Every Step)</span>
          <span>Premium custom printed clothing drops.</span>
        </div>
      </div>
    </footer>
  );
}
