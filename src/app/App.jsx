import { useMemo, useState, useEffect, lazy, Suspense } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
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
import { usePageTracking } from "@lib/useTracker";
import track from "@lib/tracker";

// Lazy load pages for performance optimization
const HomePage = lazy(() => import("@pages/Home/Home"));
const AboutPage = lazy(() => import("@pages/About/About"));
const ShopPage = lazy(() => import("@pages/Shop/Shop"));
const TrackPage = lazy(() => import("@pages/Track/Track"));
const ContactPage = lazy(() => import("@pages/Contact/Contact"));
const ReviewsPage = lazy(() => import("@pages/Reviews/Reviews"));
const SimplePage = lazy(() => import("@pages/Simple/Simple"));
const TermsPage = lazy(() => import("@pages/Terms/Terms"));
const PrivacyPage = lazy(() => import("@pages/Privacy/Privacy"));
const RefundPage = lazy(() => import("@pages/Refund/Refund"));
const CookiePage = lazy(() => import("@pages/Cookie/Cookie"));
const ProductDetailPage = lazy(() => import("@pages/ProductDetail/ProductDetail"));
const CartPage = lazy(() => import("@pages/Cart/Cart"));
const CheckoutPage = lazy(() => import("@pages/Checkout/Checkout"));
const AccountPage = lazy(() => import("@pages/Account/Account"));
const OrderSuccessPage = lazy(() => import("@pages/OrderSuccess/OrderSuccess"));
const FaqPage = lazy(() => import("@pages/Faq/Faq"));
const SizingPage = lazy(() => import("@pages/Sizing/Sizing"));
const WishlistPage = lazy(() => import("@pages/Wishlist/Wishlist"));
const DeveloperPage = lazy(() => import("@pages/Developer/Developer"));

import { useCart } from "@app/providers/CartContext";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Shop", href: "/shop" },
  { label: "Track", href: "/track" },
  { label: "Contact", href: "/contact" },
  { label: "Reviews", href: "/reviews" },
  { label: "Wishlist", href: "/wishlist" }
];

// Simple loading fallback
const PageLoader = () => (
  <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '50%' }}></div>
  </div>
);

export function App() {
  const location = useLocation();
  const { cartDrawerOpen, setCartDrawerOpen } = useCart();
  const [loaderActive, setLoaderActive] = useState(() => {
    return !sessionStorage.getItem("sirat_loader_shown");
  });

  usePageTracking();

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  useEffect(() => {
    track.init();
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="storefront">
        {loaderActive && <IntroLoader onComplete={() => setLoaderActive(false)} />}
        <Navbar navItems={navItems || []} onCartToggle={() => setCartDrawerOpen(true)} />
        <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
        
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/developer" element={<DeveloperPage />} />
            <Route path="/page/:slug" element={<SimplePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

        <Footer />
        <BottomNav />
        <ScrollToTop />
        <FloatingSupport />
        <Toast />
        <ConfirmDialog />
      </div>
    </LazyMotion>
  );
}
