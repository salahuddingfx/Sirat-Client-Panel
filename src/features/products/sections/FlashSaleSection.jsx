import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { m } from "framer-motion";
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
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading || !sale) return null;

  const products = sale.products || [];
  if (products.length === 0) return null;

  return (
    <section className="flash-sale-section">
      <div className="flash-sale-glow-left" />
      <div className="flash-sale-glow-right" />

      <div className="container flash-sale-inner">
        <div className="flash-sale-header">
          <m.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="flash-sale-badge"
          >
            <Zap size={16} fill="currentColor" /> {sale.title || "Flash Sale"}
          </m.div>

          <h2 className="flash-sale-heading">Limited Time Offers</h2>

          <div className="flash-sale-timer">
            <Timer size={24} className="flash-sale-timer-icon" />
            <div className="flash-sale-timer-blocks">
              <div className="time-block">
                <span className="time-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="time-label">Hours</span>
              </div>
              <span className="time-sep">:</span>
              <div className="time-block">
                <span className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="time-label">Mins</span>
              </div>
              <span className="time-sep">:</span>
              <div className="time-block">
                <span className="time-value time-value-accent">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="time-label">Secs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flash-sale-slider-container">
          <button 
            type="button" 
            className="flash-sale-nav-btn prev" 
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft size={22} />
          </button>
          
          <div className="flash-sale-track-wrapper" ref={scrollRef}>
            <div className="flash-sale-track-inner">
              {products.map((product) => (
                <FlashSaleCard key={product._id} product={product} />
              ))}
            </div>
          </div>

          <button 
            type="button" 
            className="flash-sale-nav-btn next" 
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}

function FlashSaleCard({ product }) {
  const { addToCart, setCartDrawerOpen } = useCart();
  const navigate = useNavigate();
  
  const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
  const stockRatio = Math.max(15, Math.min(85, 100 - (totalStock * 1.5))); // Urgency ratio based on stock
  
  const discountAmount = product.oldPrice && product.oldPrice > product.price 
    ? Math.round(product.oldPrice - product.price) 
    : 0;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    const defaultVariant = product.variants?.[0] || { id: "default", label: "M", priceDelta: 0, stock: 10 };
    addToCart(product, defaultVariant, 1);
    setCartDrawerOpen(true);
  };

  return (
    <div className="flash-sale-card" onClick={() => navigate(`/product/${product.slug}`)}>
      <div className="flash-sale-card__media">
        <img src={product.images?.[0] || product.image} alt={product.name} loading="lazy" />
        {discountAmount > 0 && (
          <span className="flash-sale-card__badge">-{'\u09F3'}{discountAmount} OFF</span>
        )}
      </div>
      <div className="flash-sale-card__body">
        <span className="flash-sale-card__category">{product.category?.name || product.category || "Streetwear"}</span>
        <h3 className="flash-sale-card__title">{product.name}</h3>
        
        <div className="flash-sale-card__price-row">
          <span className="flash-sale-card__price">{'\u09F3'}{product.price}</span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="flash-sale-card__old-price">{'\u09F3'}{product.oldPrice}</span>
          )}
        </div>

        {/* Urgency Progress Bar */}
        <div className="flash-sale-card__stock-wrap">
          <div className="flash-sale-card__stock-text">
            <span>{totalStock > 0 ? `Only ${totalStock} left` : "Out of Stock"}</span>
            <span>{Math.round(stockRatio)}% claimed</span>
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
          <ShoppingCart size={13} style={{ marginRight: 6 }} /> Claim Deal
        </button>
      </div>
    </div>
  );
}
