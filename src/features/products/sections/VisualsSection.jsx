import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader, Button } from "@components/ui";
import ProductCard from "@features/products/components/ProductCard";
import { fetchFeaturedProducts } from "@api/queries";
import "./VisualsSection.css";

export default function VisualsSection() {
  const [featured, setFeatured] = useState([]);
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

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

  useEffect(() => {
    if (!featured.length || isHovered) return;
    let smoothId;
    let pos = 0;
    const step = () => {
      if (!scrollRef.current || isHovered) {
        smoothId = requestAnimationFrame(step);
        return;
      }
      const { scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      pos += 1.5;
      if (pos >= maxScroll) {
        pos = 0;
        scrollRef.current.scrollLeft = 0;
      } else {
        scrollRef.current.scrollLeft = pos;
      }
      smoothId = requestAnimationFrame(step);
    };
    smoothId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(smoothId);
  }, [featured, isHovered]);

  const scroll = useCallback((direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left'
        ? scrollLeft - (clientWidth / 2)
        : scrollLeft + (clientWidth / 2);

      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }, []);

  if (!featured || featured.length === 0) return null;

  return (
    <section
      className="featured-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
        <div
          ref={scrollRef}
          className="marquee-container"
        >
          <div
            className="marquee-track"
            style={{ gap: "1.25rem", alignItems: "flex-start" }}
          >
            {[...featured, ...featured, ...featured].map((product, idx) => (
              <div key={`${product.id}-${idx}`} className="vis-card-wrap">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
