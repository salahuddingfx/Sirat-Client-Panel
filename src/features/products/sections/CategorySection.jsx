import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@components/ui";
import ProductCard from "@features/products/components/ProductCard";
import { fetchProducts, fetchCategories } from "@api/queries";

export default function CategorySection() {
  const [products, setProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setProducts(productsData);
        // Prefer featured categories; fallback to all if none are featured
        const featuredCats = categoriesData.filter(c => c.featured);
        const useCats = featuredCats.length > 0 ? featuredCats : categoriesData;
        setCategoryData(useCats);
        if (useCats.length > 0) {
          setSelectedCategory(useCats[0].name);
        }
      } catch (err) {
        console.error("Failed to load category section data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const categoryProducts = useMemo(() => {
    if (!selectedCategory) return [];
    return products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [products, selectedCategory]);

  if (isLoading) {
    return (
      <section className="controllable-categories-section">
        <SectionHeader
          eyebrow="Curated Styles"
          title="Browse by Category"
          description="Loading categories..."
        />
      </section>
    );
  }

  return (
    <section className="controllable-categories-section">
      <SectionHeader
        eyebrow="Curated Styles"
        title="Browse by Category"
        description="Click a category below to explore our premium collection."
      />
      
      <div className="homepage-category-selector" style={{ marginTop: "1.5rem" }}>
        <div className="marquee-container">
          <div className="marquee-track">
            {[...categoryData, ...categoryData].map((cat, idx) => (
              <button
                key={`${cat.name}-${idx}`}
                type="button"
                className={["hp-category-tab", selectedCategory === cat.name ? "active" : ""].filter(Boolean).join(" ")}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <div className="hp-category-tab__preview" style={{ backgroundImage: `url(${cat.image})` }} />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
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
