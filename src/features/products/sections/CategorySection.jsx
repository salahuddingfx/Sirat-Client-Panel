import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@components/ui";
import ProductCard from "@features/products/components/ProductCard";
import { fetchProducts, fetchCategories } from "@api/queries";
import "./CategorySection.css";

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
      <section className="cat-section">
        <SectionHeader
          eyebrow="Curated Styles"
          title="Browse by Category"
          description="Loading categories..."
        />
      </section>
    );
  }

  return (
    <section className="cat-section">
      <SectionHeader
        eyebrow="Curated Styles"
        title="Browse by Category"
        description="Click a category below to explore our premium collection."
      />

      <div className="cat-tabs-wrapper">
        <div className="cat-tabs-track">
          <div className="cat-tabs-inner">
            {[...categoryData, ...categoryData, ...categoryData].map((cat, idx) => (
              <button
                key={`${cat.name}-${idx}`}
                type="button"
                className={`hp-category-tab ${selectedCategory === cat.name ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <div className="hp-category-tab__preview" style={{ backgroundImage: `url(${cat.image})` }} />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="cat-products-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="cat-products-grid"
          >
            {categoryProducts.length === 0 ? (
              <div className="cat-empty">
                <p>No items released in this category yet. Check back next drop.</p>
              </div>
            ) : (
              categoryProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
