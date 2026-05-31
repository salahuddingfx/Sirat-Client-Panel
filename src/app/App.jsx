import { useMemo, useState, useEffect, lazy, Suspense } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";

import Navbar from "@components/layout/Navbar";
import Footer from "@components/layout/Footer";
import BottomNav from "@components/layout/BottomNav";
import ScrollToTop from "@components/layout/ScrollToTop";
import FloatingSupport from "@components/layout/FloatingSupport";
import IntroLoader from "@components/layout/IntroLoader";

import CartDrawer from "@features/cart/CartDrawer";

const HomePage = lazy(() => import("@pages/Home/Home"));
const AboutPage = lazy(() => import("@pages/About/About"));
const ShopPage = lazy(() => import("@pages/Shop/Shop"));
const TrackPage = lazy(() => import("@pages/Track/Track"));
const ContactPage = lazy(() => import("@pages/Contact/Contact"));
const ReviewsPage = lazy(() => import("@pages/Reviews/Reviews"));
const SimplePage = lazy(() => import("@pages/Simple/Simple"));
const NotFoundPage = lazy(() => import("@pages/NotFound/NotFound"));
const TermsPage = lazy(() => import("@pages/Terms/Terms"));
const PrivacyPage = lazy(() => import("@pages/Privacy/Privacy"));
const RefundPage = lazy(() => import("@pages/Refund/Refund"));
const CookiePage = lazy(() => import("@pages/Cookie/Cookie"));
const ProductDetailPage = lazy(() => import("@pages/ProductDetail/ProductDetail"));
const CartPage = lazy(() => import("@pages/Cart/Cart"));
const CheckoutPage = lazy(() => import("@pages/Checkout/Checkout"));
const AccountPage = lazy(() => import("@pages/Account/Account"));
const OrderSuccessPage = lazy(() => import("@pages/OrderSuccess/OrderSuccess"));

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

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <div className="app-container">
      <IntroLoader />
      <Navbar navItems={navItems || []} onCartToggle={() => {}} />
      <CartDrawer />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Suspense fallback={<div className="page-loader" />}>
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
              <Route path="/page/:slug" element={<SimplePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>

      <Footer />
      <BottomNav />
      <ScrollToTop />
      <FloatingSupport />
    </div>
  );
}
