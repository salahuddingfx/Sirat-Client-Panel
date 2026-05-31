import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "../lib/ui";
import ProductCard from "../components/ProductCard";
import { products } from "../data/mockData";

const categoryData = [
  { name: "Oversized", bg: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600" },
  { name: "Custom Prints", bg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600" },
  { name: "Screen Prints", bg: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600" },
  { name: "Essentials", bg: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600" }
];

export default function CategorySection() {
  const [selectedCategory, setSelectedCategory] = useState("Oversized");

  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [selectedCategory]);

  return (
    <section className="controllable-categories-section">
      <SectionHeader
        eyebrow="Curated Styles"
        title="Browse by Category"
        description="Click a category below to explore our premium collection."
      />
      
      <div className="homepage-category-selector" style={{ marginTop: "1.5rem" }}>
        {categoryData.map((cat) => (
          <button
            key={cat.name}
            type="button"
            className={["hp-category-tab", selectedCategory === cat.name ? "active" : ""].filter(Boolean).join(" ")}
            onClick={() => setSelectedCategory(cat.name)}
          >
            <div className="hp-category-tab__preview" style={{ backgroundImage: `url(${cat.bg})` }} />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="category-product-wrapper" style={{ marginTop: "1.5rem" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="product-grid"
          >
            {categoryProducts.length === 0 ? (
              <div className="shop-empty-state sirat-panel" style={{ gridColumn: "1 / -1", padding: "3rem" }}>
                <p className="page-section__text">No items released in this category yet. Check back next drop.</p>
              </div>
            ) : (
              categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
