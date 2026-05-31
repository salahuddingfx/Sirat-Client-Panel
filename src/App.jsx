import { useMemo, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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
  const { cartDrawerOpen, setCartDrawerOpen } = useCart();
  const location = useLocation();
  const [loaderActive, setLoaderActive] = useState(() => {
    return !sessionStorage.getItem("sirat_loader_shown");
  });

  return (
    <div className="storefront">
      {loaderActive && <IntroLoader onComplete={() => setLoaderActive(false)} />}
      <Navbar navItems={navItems} brandNote={brandNote} onCartToggle={() => setCartDrawerOpen(true)} />
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />

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
          <Route path="/cart" element={<SimplePage title="Your Bag" description="Review the custom printed garments in your cart before checking out." />} />
          <Route path="/checkout" element={<SimplePage title="Secure Checkout" description="Provide your shipping address and select a payment option to complete your purchase." />} />
          <Route path="/account" element={<SimplePage title="Customer Account" description="Access your order history, edit shipping addresses, and manage your profile." />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
}
