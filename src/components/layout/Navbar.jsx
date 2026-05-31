import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Sparkles, Menu, X, ShoppingCart, Phone, Mail, Zap, Truck, Shirt, Compass, User } from "lucide-react";
import { Button } from "@components/ui";
import { useCart } from "@app/providers/CartContext";
import { useAuth } from "@app/providers/AuthContext";

export default function Navbar({ navItems, brandNote, onCartToggle }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navbarSearchVal, setNavbarSearchVal] = useState("");
  const { cartCount } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div className="storefront__top-bar">
        <div className="storefront__top-bar-inner">
          <div className="top-bar-contact">
            <span className="contact-item">
              <Phone size={11} className="top-bar-icon" /> +880 1700 000000
            </span>
            <span className="separator">|</span>
            <span className="contact-item">
              <Mail size={11} className="top-bar-icon" /> hello@siratclothing.com
            </span>
          </div>

          <div className="top-bar-ticker">
            <div className="ticker-scroll">
              <span className="ticker-item">
                <Zap size={11} className="ticker-icon" /> Summer Drop 2026 is LIVE! Use Code: <strong>LAUNCH15</strong> for 15% OFF
              </span>
              <span className="ticker-item">
                <Truck size={11} className="ticker-icon" /> FREE shipping on orders over ৳1500 / $150
              </span>
              <span className="ticker-item">
                <Shirt size={11} className="ticker-icon" /> Crafted in 100% premium combed cotton & tactile prints
              </span>
            </div>
          </div>

          <div className="top-bar-selectors">
            <select className="top-bar-select" aria-label="Select Language">
              <option value="en">EN</option>
              <option value="bn">বাংলা</option>
            </select>
            <select className="top-bar-select" aria-label="Select Currency">
              <option value="bdt">BDT (৳)</option>
              <option value="usd">USD ($)</option>
            </select>
          </div>
        </div>
      </div>

      <header className="storefront__header">
        <div className="storefront__header-inner">
          <div className="storefront__brand-group" style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
              <img 
                src="/logo.png" 
                alt="SIRAT Logo" 
                style={{ height: "32px", width: "auto", objectFit: "contain" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }} 
              />
              <span className="sirat-brand" style={{ display: "inline-block" }}>SIRAT</span>
            </Link>
            <span style={{ 
              fontSize: "0.68rem", 
              color: "var(--sirat-gold)", 
              opacity: 0.9, 
              letterSpacing: "0.1em", 
              textTransform: "uppercase", 
              fontWeight: "600", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.3rem", 
              marginTop: "0.1rem" 
            }}>
              <Compass size={11} /> Purity in Every Step
            </span>
          </div>

          <nav className="storefront-nav" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => ["storefront-nav__link", isActive ? "active" : ""].filter(Boolean).join(" ")}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>



          {searchOpen && (
            <div className="navbar-search-overlay-container">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (navbarSearchVal.trim()) {
                    navigate(`/shop?q=${encodeURIComponent(navbarSearchVal)}`);
                    setNavbarSearchVal("");
                    setSearchOpen(false);
                  }
                }}
                className="navbar-search-form"
              >
                <Search size={15} className="search-icon-inside" />
                <input
                  type="text"
                  placeholder="Search products (e.g. Oversized, Sets, Essentials)..."
                  value={navbarSearchVal}
                  onChange={(e) => setNavbarSearchVal(e.target.value)}
                  className="navbar-search-input"
                  autoFocus
                />
                <button type="button" className="navbar-search-close" onClick={() => setSearchOpen(false)} aria-label="Close search">
                  <X size={15} />
                </button>
              </form>
            </div>
          )}

          <div className="storefront__toolbar">
            <Button variant="ghost" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search size={16} />
            </Button>
            
            <div className="hide-on-mobile">
              {isLoggedIn ? (
                <div className="navbar-profile-dropdown-container">
                  <button type="button" className="navbar-profile-trigger-btn" aria-label="User Profile Menu">
                    {user?.name?.charAt(0) || "U"}
                  </button>
                  <div className="navbar-profile-dropdown-menu">
                    <div className="dropdown-user-info">
                      <strong>{user?.name}</strong>
                      <span>{user?.email}</span>
                    </div>
                    <hr className="product-card-modern__divider" style={{ margin: "0.55rem 0" }} />
                    <Link to="/account" className="dropdown-item">Dashboard</Link>
                    <button type="button" className="dropdown-item logout-btn" onClick={logout}>
                      Log Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/account" aria-label="Account Dashboard">
                  <Button variant="ghost" aria-label="Account">
                    <User size={16} />
                  </Button>
                </Link>
              )}
            </div>

            <Button variant="ghost" aria-label="Cart" onClick={onCartToggle} className="navbar-cart-btn">
              <ShoppingCart size={16} />
              {cartCount > 0 && <span className="navbar-cart-badge">{cartCount}</span>}
            </Button>
          </div>

          <button className="mobile-menu-button" aria-label="Toggle menu" onClick={() => setMobileOpen((s) => !s)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <div className="mobile-nav">
          <div className="mobile-nav__inner">
            <button className="mobile-nav__close" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
              <X size={22} />
            </button>
            {navItems.map((item) => (
              <NavLink key={item.href} to={item.href} className="mobile-nav__link" onClick={() => setMobileOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            
            {isLoggedIn ? (
              <div className="mobile-nav-user-section" style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--sirat-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div className="navbar-profile-trigger-btn">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <strong style={{ fontSize: "0.9rem" }}>{user?.name}</strong>
                    <span style={{ fontSize: "0.72rem", color: "var(--sirat-muted)" }}>{user?.email}</span>
                  </div>
                </div>
                <NavLink to="/account" className="mobile-nav__link" onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <User size={16} /> Dashboard
                </NavLink>
                <button type="button" className="mobile-nav__link logout-btn" onClick={() => { logout(); setMobileOpen(false); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "none", background: "none", width: "100%", textAlign: "left", cursor: "pointer", color: "#EF4444", marginTop: "0.5rem" }}>
                  Log Out
                </button>
              </div>
            ) : (
              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--sirat-border)" }}>
                <NavLink to="/account" className="mobile-nav__link" onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <User size={16} /> Sign In / Account
                </NavLink>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
