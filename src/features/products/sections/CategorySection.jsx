import { useState, useMemo, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { SectionHeader } from "@components/ui";
import ProductCard from "@features/products/components/ProductCard";
import { fetchProducts, fetchCategories } from "@api/queries";
import "./CategorySection.css";

export default function CategorySection() {
  const [products, setProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const tabsRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setProducts(productsData || []);
        const featuredCats = (categoriesData || []).filter((c) => c.featured);
        const useCats = featuredCats.length > 0 ? featuredCats : categoriesData || [];
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
    return products.filter(
      (p) => (p.category?.name || p.category || "").toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [products, selectedCategory]);

  const getCategoryCount = (catName) =>
    products.filter(
      (p) => (p.category?.name || p.category || "").toLowerCase() === catName.toLowerCase()
    ).length;

  const scrollTabs = (direction) => {
    if (!tabsRef.current) return;
    const amount = tabsRef.current.clientWidth * 0.7;
    tabsRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

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

  if (!categoryData || categoryData.length === 0) return null;

  return (
    <section className="cat-section">
      <SectionHeader
        eyebrow="Curated Styles"
        title="Browse by Category"
        description="Click a category below to explore our premium collection."
      >
        <div className="cat-section__nav">
          <button
            type="button"
            onClick={() => scrollTabs("left")}
            className="action-circle-btn"
            aria-label="Scroll categories left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollTabs("right")}
            className="action-circle-btn"
            aria-label="Scroll categories right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </SectionHeader>

      {/* IMAGE PILLS */}
      <div className="cat-pills-wrapper">
        <div className="cat-pills-fade cat-pills-fade--left" />
        <div className="cat-pills-fade cat-pills-fade--right" />
        <div className="cat-pills" ref={tabsRef}>
          {categoryData.map((cat) => {
            const isActive = selectedCategory === cat.name;
            const count = getCategoryCount(cat.name);
            return (
              <button
                key={cat._id || cat.id || cat.name}
                type="button"
                className={`cat-pill ${isActive ? "cat-pill--active" : ""}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <div className="cat-pill__media">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} loading="lazy" />
                  ) : (
                    <div className="cat-pill__placeholder">
                      <Sparkles size={20} />
                    </div>
                  )}
                  <div className="cat-pill__shine" />
                </div>
                <div className="cat-pill__info">
                  <span className="cat-pill__name">{cat.name}</span>
                  <span className="cat-pill__count">
                    {count} {count === 1 ? "item" : "items"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="cat-products-wrapper">
        <AnimatePresence mode="wait">
          <m.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="cat-products-grid"
          >
            {categoryProducts.length === 0 ? (
              <div className="cat-empty">
                <p>No items released in this category yet. Check back next drop.</p>
              </div>
            ) : (
              categoryProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))
            )}
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
