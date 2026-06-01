import { useState, useEffect } from "react";
import { SectionHeader } from "@components/ui";
import ProductCard from "@features/products/components/ProductCard";
import { fetchFeaturedProducts } from "@api/queries";

export default function VisualsSection() {
  const [featured, setFeatured] = useState([]);

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

  if (!featured || featured.length === 0) return null;

  return (
    <section className="featured-section">
      <SectionHeader
        eyebrow="Visual drop specs"
        title="Product Visuals"
        description="Highlighting signature garments crafted in structured textures and futuristic silhouettes."
      />
      <div style={{ marginTop: "1.5rem" }}>
        <div className="marquee-container">
          <div className="marquee-track">
            {[...featured, ...featured].map((product, idx) => (
              <div key={`${product.id}-${idx}`} style={{ minWidth: 210, maxWidth: 210 }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
