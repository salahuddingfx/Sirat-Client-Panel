import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader, Button } from "@components/ui";
import ProductCard from "@features/products/components/ProductCard";
import { fetchFeaturedProducts } from "@api/queries";

export default function VisualsSection() {
  const [featured, setFeatured] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetchFeaturedProducts();
        if (mounted) setFeatured(res.slice(0, 10));
      } catch (e) {
        console.error("Failed to fetch featured products:", e);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - (clientWidth / 2) 
        : scrollLeft + (clientWidth / 2);
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!featured || featured.length === 0) return null;

  return (
    <section className="featured-section">
      <SectionHeader
        eyebrow="Visual drop specs"
        title="Product Visuals"
        description="Highlighting signature garments crafted in structured textures and futuristic silhouettes."
      >
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button 
            onClick={() => scroll('left')}
            className="action-circle-btn" 
            style={{ width: "40px", height: "40px" }}
            aria-label="Scroll Left"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="action-circle-btn" 
            style={{ width: "40px", height: "40px" }}
            aria-label="Scroll Right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </SectionHeader>

      <div style={{ marginTop: "1.5rem" }}>
        <div className="marquee-container">
          <div 
            ref={scrollRef}
            className="marquee-track marquee-infinite-linear" 
            style={{ gap: "1.25rem", alignItems: "flex-start" }}
          >
            {/* Multi-duplicate for truly seamless infinite feel */}
            {[...featured, ...featured, ...featured, ...featured].map((product, idx) => (
              <div key={`${product.id}-${idx}`} style={{ minWidth: 260, maxWidth: 260, display: "flex", height: "100%" }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
