import { useState, useEffect, useRef } from "react";
import { m } from "framer-motion";
import { Timer, Zap } from "lucide-react";
import ProductCard from "@features/products/components/ProductCard";
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

        <div className="flash-sale-track-wrapper">
          <div className="flash-sale-track">
            <div className="flash-sale-track-inner">
              {[...products, ...products, ...products].map((product, i) => (
                <div className="flash-sale-item" key={`${product._id}-${i}`}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
