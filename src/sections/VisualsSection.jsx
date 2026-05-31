import { useMemo } from "react";
import { SectionHeader } from "../lib/ui";
import ProductCard from "../components/ProductCard";
import { products } from "../data/mockData";

export default function VisualsSection() {
  const highlightedProducts = useMemo(() => {
    return products.filter((p) => p.featured === true).slice(0, 5);
  }, []);

  return (
    <section className="featured-section">
      <SectionHeader
        eyebrow="Visual drop specs"
        title="Product Visuals"
        description="Highlighting signature garments crafted in structured textures and futuristic silhouettes."
      />
      <div className="product-grid-editorial" style={{ marginTop: "1.5rem" }}>
        {highlightedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
