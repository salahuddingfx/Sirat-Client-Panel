import { useMemo, useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ShopPage from "./pages/ShopPage";
import TrackPage from "./pages/TrackPage";
import ContactPage from "./pages/ContactPage";
import ReviewsPage from "./pages/ReviewsPage";
import SimplePage from "./pages/SimplePage";
import NotFoundPage from "./pages/NotFoundPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPage from "./pages/RefundPage";
import CookiePage from "./pages/CookiePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import CartDrawer from "./components/CartDrawer";
import IntroLoader from "./components/IntroLoader";
import { products } from "./data/mockData";
import { useCart } from "./context/CartContext";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Shop", href: "/shop" },
  { label: "Track", href: "/track" },
  { label: "Contact", href: "/contact" },
  { label: "Reviews", href: "/reviews" }
];

export function App() {
  const brandNote = useMemo(() => "Cox's Bazar", []);
  const { cartDrawerOpen, setCartDrawerOpen, toast } = useCart();
  const location = useLocation();
  const [loaderActive, setLoaderActive] = useState(true);

  // Initialize smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="storefront">
      {loaderActive && <IntroLoader onComplete={() => setLoaderActive(false)} />}
      <Navbar navItems={navItems} brandNote={brandNote} onCartToggle={() => setCartDrawerOpen(true)} />
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />

      {/* Global Centered Toast Alert Overlay */}
      <AnimatePresence>
        {toast.show && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 99999,
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                background: "rgba(26, 24, 22, 0.95)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--sirat-gold)",
                padding: "1.2rem 2.2rem",
                borderRadius: "16px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
                color: "#FFFDFB",
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                fontSize: "0.95rem",
                fontWeight: "600",
                textAlign: "center",
                width: "max-content",
                maxWidth: "90vw",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: toast.type === "success" ? "#10B981" : "var(--sirat-gold)",
                  boxShadow: `0 0 10px ${toast.type === "success" ? "#10B981" : "var(--sirat-gold)"}`,
                }}
              />
              {toast.message}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund-policy" element={<RefundPage />} />
          <Route path="/cookie-policy" element={<CookiePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
}
