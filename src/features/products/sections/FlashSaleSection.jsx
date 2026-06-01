import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, Zap } from "lucide-react";
import ProductCard from "@features/products/components/ProductCard";
import { fetchProducts } from "@api/queries";

export default function FlashSaleSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Flash sale timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    // Simulated countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
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
  }, []);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        if (data && data.length > 0) {
          // Find products that actually have a discount, or fallback to first 4
          let discounted = data.filter(p => p.oldPrice && p.oldPrice > p.price);
          if (discounted.length === 0) {
              discounted = data.slice(0, 4); // Fallback
          }
          setProducts(discounted.slice(0, 4));
        }
      })
      .catch((err) => console.error("Failed to fetch products:", err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="flash-sale-section" style={{ 
        padding: "4rem 0", 
        background: "linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%)",
        borderTop: "1px solid rgba(239, 68, 68, 0.1)",
        borderBottom: "1px solid rgba(239, 68, 68, 0.1)",
        position: "relative",
        overflow: "hidden"
    }}>
      {/* Background glow effects */}
      <div style={{ position: "absolute", top: "-50%", left: "-10%", width: "50%", height: "150%", background: "radial-gradient(ellipse at center, rgba(239, 68, 68, 0.1) 0%, transparent 70%)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-50%", right: "-10%", width: "50%", height: "150%", background: "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.1) 0%, transparent 70%)", zIndex: 0 }} />
      
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "3rem", textAlign: "center" }}>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                whileInView={{ scale: 1, opacity: 1 }} 
                viewport={{ once: true }}
                style={{ 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: "0.5rem", 
                    padding: "0.5rem 1rem", 
                    background: "rgba(239, 68, 68, 0.1)", 
                    color: "#EF4444", 
                    borderRadius: "2rem", 
                    fontWeight: "600", 
                    fontSize: "0.875rem",
                    marginBottom: "1rem"
                }}
            >
                <Zap size={16} fill="currentColor" /> Flash Sale
            </motion.div>
            
            <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "1.5rem", color: "var(--sirat-text-main)", letterSpacing: "-0.02em" }}>
                Limited Time Offers
            </h2>
            
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <Timer size={24} style={{ color: "var(--sirat-gold)" }} />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <div style={{ background: "var(--sirat-surface)", border: "1px solid var(--sirat-border)", padding: "0.75rem", borderRadius: "12px", minWidth: "60px" }}>
                        <span style={{ display: "block", fontSize: "1.5rem", fontWeight: "700", color: "var(--sirat-text-main)" }}>{String(timeLeft.hours).padStart(2, '0')}</span>
                        <span style={{ fontSize: "0.65rem", color: "var(--sirat-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Hours</span>
                    </div>
                    <span style={{ fontSize: "2rem", fontWeight: "700", color: "var(--sirat-muted)", alignSelf: "flex-start", marginTop: "0.25rem" }}>:</span>
                    <div style={{ background: "var(--sirat-surface)", border: "1px solid var(--sirat-border)", padding: "0.75rem", borderRadius: "12px", minWidth: "60px" }}>
                        <span style={{ display: "block", fontSize: "1.5rem", fontWeight: "700", color: "var(--sirat-text-main)" }}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                        <span style={{ fontSize: "0.65rem", color: "var(--sirat-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Mins</span>
                    </div>
                    <span style={{ fontSize: "2rem", fontWeight: "700", color: "var(--sirat-muted)", alignSelf: "flex-start", marginTop: "0.25rem" }}>:</span>
                    <div style={{ background: "var(--sirat-surface)", border: "1px solid var(--sirat-border)", padding: "0.75rem", borderRadius: "12px", minWidth: "60px" }}>
                        <span style={{ display: "block", fontSize: "1.5rem", fontWeight: "700", color: "#EF4444" }}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                        <span style={{ fontSize: "0.65rem", color: "var(--sirat-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Secs</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="product-grid" style={{ opacity: loading ? 0.6 : 1 }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
