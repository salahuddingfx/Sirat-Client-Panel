import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Sparkles, Menu, X, ShoppingBag, Phone, Mail, Zap, Truck, Shirt, Compass, User } from "lucide-react";
import { Button } from "../lib/ui";
import { useCart } from "../context/CartContext";

export default function Navbar({ navItems, brandNote, onCartToggle }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navbarSearchVal, setNavbarSearchVal] = useState("");
  const { cartCount } = useCart();
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
          <div className="storefront__brand-group">
            <Link to="/" className="sirat-brand">
              SIRAT
            </Link>
            <span className="storefront__badge">
              <Compass size={12} /> Purity in Every Step
            </span>
          </div>
          <button className="mobile-menu-button" aria-label="Toggle menu" onClick={() => setMobileOpen((s) => !s)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

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
              </div>
            </div>
          ) : null}

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
            <Link to="/account" aria-label="Account Dashboard">
              <Button variant="ghost" aria-label="Account">
                <User size={16} />
              </Button>
            </Link>
            <Button variant="ghost" aria-label="Cart" onClick={onCartToggle} className="navbar-cart-btn">
              <ShoppingBag size={16} />
              {cartCount > 0 && <span className="navbar-cart-badge">{cartCount}</span>}
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
