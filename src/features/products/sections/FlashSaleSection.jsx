import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { m, AnimatePresence } from "framer-motion";
import { Timer, Zap, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useCart } from "@app/providers/CartContext";
import { fetchActiveFlashSale } from "@api/queries";
import "./FlashSaleSection.css";

export default function FlashSaleSection() {
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const scrollRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchActiveFlashSale();
        if (res.success && res.data) {
          setSale(res.data);
          computeRemaining(res.data.remainingSeconds);
        } else {
          setSale(null);
        }
      } catch (err) {
        console.error("Failed to load flash sale:", err);
        setSale(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const computeRemaining = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    setTimeLeft({ hours: h, minutes: m, seconds: s });
  };

  useEffect(() => {
    if (!sale) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (hours === 0 && minutes === 0 && seconds === 0) return prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            hours--;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [sale]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading || !sale) return null;

  const products = sale.products || [];
  if (products.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  return (
    <section className="flash-sale-section">
      <div className="flash-sale-glow-left" />
      <div className="flash-sale-glow-right" />

      <div className="container flash-sale-inner">
        <div className="flash-sale-header">
          <m.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="flash-sale-badge"
          >
            <Zap size={14} fill="currentColor" /> {sale.title || "Limited Drop"}
          </m.div>

          <m.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flash-sale-heading"
          >
            Midnight Flash Sale
          </m.h2>

          <m.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flash-sale-timer"
          >
            <Timer size={22} className="flash-sale-timer-icon" />
            <div className="flash-sale-timer-blocks">
              <div className="time-block">
                <span className="time-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="time-label">Hrs</span>
              </div>
              <span className="time-sep">:</span>
              <div className="time-block">
                <span className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="time-label">Min</span>
              </div>
              <span className="time-sep">:</span>
              <div className="time-block">
                <span className="time-value time-value-accent">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="time-label">Sec</span>
              </div>
            </div>
          </m.div>
        </div>

        <div className="flash-sale-slider-container">
          <button 
            type="button" 
            className="flash-sale-nav-btn prev" 
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flash-sale-track-wrapper" ref={scrollRef}>
            <m.div 
              className="flash-sale-track-inner"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <AnimatePresence>
                {products.map((product, idx) => (
                  <FlashSaleCard key={product.id || idx} product={product} index={idx} />
                ))}
              </AnimatePresence>
            </m.div>
          </div>

          <button 
            type="button" 
            className="flash-sale-nav-btn next" 
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}

function FlashSaleCard({ product, index }) {
  const { addToCart, setCartDrawerOpen } = useCart();
  const navigate = useNavigate();
  
  const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
  const stockRatio = Math.max(15, Math.min(90, 100 - (totalStock * 1.8))); 
  
  const discountAmount = product.oldPrice && product.oldPrice > product.price 
    ? Math.round(product.oldPrice - product.price) 
    : 0;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    const defaultVariant = product.variants?.[0] || { id: "default", label: "M", priceDelta: 0, stock: 10 };
    addToCart(product, defaultVariant, 1);
    setCartDrawerOpen(true);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <m.div 
      variants={itemVariants}
      className="flash-sale-card" 
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      <div className="flash-sale-card__media">
        <img 
          src={product.images?.[0] || product.image || "/placeholder.png"} 
          alt={product.name} 
          loading="lazy" 
        />
        {discountAmount > 0 && (
          <span className="flash-sale-card__badge">-{'\u09F3'}{discountAmount} OFF</span>
        )}

        {/* The Glassmorphic Overlay Body */}
        <div className="flash-sale-card__body">
          <span className="flash-sale-card__category">{product.category?.name || product.category || "Drop"}</span>
          <h3 className="flash-sale-card__title">{product.name}</h3>
          
          <div className="flash-sale-card__price-row">
            <span className="flash-sale-card__price">{'\u09F3'}{product.price}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="flash-sale-card__old-price">{'\u09F3'}{product.oldPrice}</span>
            )}
          </div>

          <div className="flash-sale-card__stock-wrap">
            <div className="flash-sale-card__stock-text">
              <span>{totalStock > 0 ? `Stock: ${totalStock}` : "Sold Out"}</span>
              <span>{Math.round(stockRatio)}%</span>
            </div>
            <div className="flash-sale-card__progress-bar">
              <div className="flash-sale-card__progress-fill" style={{ width: `${stockRatio}%` }} />
            </div>
          </div>

          <button 
            type="button" 
            className="flash-sale-card__action-btn" 
            onClick={handleQuickAdd}
            disabled={totalStock <= 0}
          >
            <ShoppingCart size={15} style={{ marginRight: 8 }} /> {totalStock > 0 ? "Claim Deal" : "Coming Soon"}
          </button>
        </div>
      </div>
    </m.div>
  );
}
