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
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ScrollToTop from "./components/ScrollToTop";
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
      <ScrollToTop />
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
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>

      <Footer />

      {/* Floating WhatsApp Support Contact Widget */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.5rem"
        }}
      >
        <a
          href="https://wa.me/8801700000000"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#25D366", // WhatsApp Green
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(37, 211, 102, 0.3)",
            backdropFilter: "blur(8px)",
            width: "54px",
            height: "54px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justify-content: "center",
            color: "#FFFFFF",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1) translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 36px rgba(37, 211, 102, 0.55)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(37, 211, 102, 0.3)";
          }}
          title="Chat with Support"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.424 5.429 0 12.04 0c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.617-5.43 12.04-12.04 12.04-2.007-.001-3.98-.502-5.733-1.464L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.793 1.453 5.378 0 9.761-4.38 9.765-9.76.002-2.607-1.01-5.057-2.859-6.908C16.449 2.088 14 1.077 11.96 1.077 6.582 1.077 2.2 5.457 2.197 10.835c-.001 1.704.469 3.366 1.362 4.821L2.553 20.3l4.794-1.257zM17.447 14.9c-.29-.145-1.72-.85-1.985-.95-.267-.097-.463-.146-.658.146-.195.29-.755.95-.925 1.144-.171.196-.341.22-.63.074-.29-.145-1.228-.453-2.339-1.444-.864-.772-1.448-1.724-1.618-2.014-.17-.29-.018-.447.127-.59.13-.13.29-.34.435-.508.145-.17.193-.29.292-.483.097-.194.048-.363-.025-.508-.073-.146-.66-1.59-.903-2.175-.236-.57-.478-.49-.658-.5H7.75c-.195 0-.51.072-.776.363-.266.29-1.02 1-1.02 2.438 0 1.437 1.045 2.825 1.19 3.018.145.194 2.055 3.14 4.978 4.4 2.923 1.259 2.923.84 3.453.79.53-.05 1.72-.7 1.96-1.378.24-.678.24-1.258.17-1.377-.07-.119-.265-.194-.556-.34z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
