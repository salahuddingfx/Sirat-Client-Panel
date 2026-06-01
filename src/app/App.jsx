import { useMemo, useState, useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";

import Navbar from "@components/layout/Navbar";
import Footer from "@components/layout/Footer";
import BottomNav from "@components/layout/BottomNav";
import ScrollToTop from "@components/layout/ScrollToTop";
import FloatingSupport from "@components/layout/FloatingSupport";
import IntroLoader from "@components/layout/IntroLoader";
import Toast from "@components/ui/Toast";
import ConfirmDialog from "@components/ui/ConfirmDialog";

import CartDrawer from "@features/cart/CartDrawer";

import HomePage from "@pages/Home/Home";
import AboutPage from "@pages/About/About";
import ShopPage from "@pages/Shop/Shop";
import TrackPage from "@pages/Track/Track";
import ContactPage from "@pages/Contact/Contact";
import ReviewsPage from "@pages/Reviews/Reviews";
import SimplePage from "@pages/Simple/Simple";
import NotFoundPage from "@pages/NotFound/NotFound";
import TermsPage from "@pages/Terms/Terms";
import PrivacyPage from "@pages/Privacy/Privacy";
import RefundPage from "@pages/Refund/Refund";
import CookiePage from "@pages/Cookie/Cookie";
import ProductDetailPage from "@pages/ProductDetail/ProductDetail";
import CartPage from "@pages/Cart/Cart";
import CheckoutPage from "@pages/Checkout/Checkout";
import AccountPage from "@pages/Account/Account";
import OrderSuccessPage from "@pages/OrderSuccess/OrderSuccess";
import FaqPage from "@pages/Faq/Faq";
import SizingPage from "@pages/Sizing/Sizing";

import { useCart } from "@app/providers/CartContext";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Shop", href: "/shop" },
  { label: "Track", href: "/track" },
  { label: "Contact", href: "/contact" },
  { label: "Reviews", href: "/reviews" }
];

export function App() {
  const location = useLocation();
  const { cartDrawerOpen, setCartDrawerOpen } = useCart();
  const [loaderActive, setLoaderActive] = useState(() => {
    return !sessionStorage.getItem("sirat_loader_shown");
  });

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <div className="storefront">
      {loaderActive && <IntroLoader onComplete={() => setLoaderActive(false)} />}
      <Navbar navItems={navItems || []} onCartToggle={() => setCartDrawerOpen(true)} />
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund" element={<RefundPage />} />
        <Route path="/cookie" element={<CookiePage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/sizing" element={<SizingPage />} />
        <Route path="/page/:slug" element={<SimplePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
      <BottomNav />
      <ScrollToTop />
      <FloatingSupport />
      <Toast />
    </div>
  );
}
