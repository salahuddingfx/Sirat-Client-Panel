import { Link } from "react-router-dom";
import { Facebook, Instagram, Compass, Youtube, Twitter } from "lucide-react";
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
                <img src={settings.logo || "/Sirat.png"} alt="SIRAT Logo" className="storefront__brand-mark footer-brand-mark" />
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
              {settings.whatsapp && (
                <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: "middle" }}>
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.424 5.429 0 12.04 0c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.617-5.43 12.04-12.04 12.04-2.007-.001-3.98-.502-5.733-1.464L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.793 1.453 5.378 0 9.761-4.38 9.765-9.76.002-2.607-1.01-5.057-2.859-6.908C16.449 2.088 14 1.077 11.96 1.077 6.582 1.077 2.2 5.457 2.197 10.835c-.001 1.704.469 3.366 1.362 4.821L2.553 20.3l4.794-1.257zM17.447 14.9c-.29-.145-1.72-.85-1.985-.95-.267-.097-.463-.146-.658.146-.195.29-.755.95-.925 1.144-.171.196-.341.22-.63.074-.29-.145-1.228-.453-2.339-1.444-.864-.772-1.448-1.724-1.618-2.014-.17-.29-.018-.447.127-.59.13-.13.29-.34.435-.508.145-.17.193-.29.292-.483.097-.194.048-.363-.025-.508-.073-.146-.66-1.59-.903-2.175-.236-.57-.478-.49-.658-.5H7.75c-.195 0-.51.072-.776.363-.266.29-1.02 1-1.02 2.438 0 1.437 1.045 2.825 1.19 3.018.145.194 2.055 3.14 4.978 4.4 2.923 1.259 2.923.84 3.453.79.53-.05 1.72-.7 1.96-1.378.24-.678.24-1.258.17-1.377-.07-.119-.265-.194-.556-.34z"/>
                  </svg>
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <Youtube size={18} />
                </a>
              )}
              {settings.twitter && (
                <a href={settings.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X">
                  <Twitter size={18} />
                </a>
              )}
              {settings.pinterest && (
                <a href={settings.pinterest} target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: "middle" }}>
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.19-2.4.04-3.44.2-.87 1.3-5.5 1.3-5.5s-.33-.66-.33-1.64c0-1.54.89-2.68 2-2.68.94 0 1.4.7 1.4 1.55 0 .95-.6 2.37-.91 3.69-.26 1.1.55 2 1.63 2 1.96 0 3.47-2.07 3.47-5.06 0-2.64-1.9-4.49-4.61-4.49-3.14 0-4.99 2.36-4.99 4.8 0 .95.36 1.97.82 2.52.09.11.1.2.07.31-.08.33-.25.99-.28 1.14-.04.16-.14.2-.32.12-1.19-.55-1.93-2.3-1.93-3.7 0-3 2.19-5.77 6.3-5.77 3.3 0 5.88 2.36 5.88 5.51 0 3.29-2.08 5.94-4.96 5.94-.97 0-1.88-.5-2.2-1.1l-.6 2.29c-.22.84-.8 1.9-1.2 2.54 1.12.35 2.3.54 3.53.54 6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
                  </svg>
                </a>
              )}
              {settings.tiktok && (
                <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle" }}>
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
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
                <li><a href="/app-release.apk" download style={{ color: "var(--sirat-gold)", fontWeight: "700" }}>Download Android App</a></li>
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
