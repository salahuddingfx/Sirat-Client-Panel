import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { m, AnimatePresence } from "framer-motion";
import { Timer, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@features/products/components/ProductCard";
import { fetchActiveFlashSale } from "@api/queries";
import "./FlashSaleSection.css";

export default function FlashSaleSection() {
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

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
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading || !sale) return null;

  const products = sale.products || [];
  if (products.length === 0) return null;

  // Double the products for infinite marquee effect
  const displayProducts = [...products, ...products];

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
            <ChevronLeft size={28} />
          </button>
          
          <div 
            className="flash-sale-track-wrapper" 
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <m.div 
              className="flash-sale-track-inner marquee-track"
              animate={{ x: isPaused ? undefined : [0, -100 * (displayProducts.length / 2) + "%"] }}
              transition={{ 
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: displayProducts.length * 5, // Dynamic duration based on count
                  ease: "linear"
                }
              }}
            >
              {displayProducts.map((product, idx) => (
                <div key={`${product.id}-${idx}`} className="flash-sale-item-wrapper">
                  <ProductCard product={product} />
                  <StockBar product={product} />
                </div>
              ))}
            </m.div>
          </div>

          <button 
            type="button" 
            className="flash-sale-nav-btn next" 
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </section>
  );
}

function StockBar({ product }) {
  const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
  const stockRatio = Math.max(15, Math.min(90, 100 - (totalStock * 1.8))); 

  return (
    <div className="flash-sale-stock-bar">
      <div className="flash-sale-stock-text">
        <span>{totalStock > 0 ? `${totalStock} Left` : "Sold Out"}</span>
        <span>{Math.round(stockRatio)}%</span>
      </div>
      <div className="flash-sale-progress">
        <div className="flash-sale-fill" style={{ width: `${stockRatio}%` }} />
      </div>
    </div>
  );
}
