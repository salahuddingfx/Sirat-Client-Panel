import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw } from "lucide-react";
import PageFrame from "../components/PageFrame";
import ProductCard from "../components/ProductCard";
import { Button, Panel } from "../lib/ui";
import { products } from "../data/mockData";
import SEO from "../components/SEO";

const categories = ["All", "Outerwear", "Sets", "Essentials", "Bottoms"];
const sizes = ["XS", "S", "M", "L", "XL"];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(searchParamQuery);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(300);
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParamQuery);
  }, [searchParamQuery]);

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSearchParams({});
    setSelectedCategory("All");
    setSelectedSizes([]);
    setMaxPrice(300);
    setSortBy("featured");
  };

  // Dynamic products filtering & sorting logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // 2. Category Tab filter
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // 3. Price slider filter
    result = result.filter((p) => p.price <= maxPrice);

    // 4. Size checkbox filter
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.variants.some((v) => selectedSizes.includes(v.label) && v.inStock)
      );
    }

    // 5. Sorting logic
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // "featured" default, prioritize featured:true
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [searchQuery, selectedCategory, selectedSizes, maxPrice, sortBy]);

  return (
    <PageFrame
      eyebrow="Catalog"
      title="Sirat Custom Drops"
      description="Browse our collection of premium custom printed combed cotton t-shirts. Filter by sizes, prices, and styles."
    >
      <SEO title="Shop" description="Browse all Sirat drops: premium combed cotton oversized tees, custom designs, and exclusive puff print releases." />
      {/* Category Tabs & Toolbar */}
      <div className="shop-toolbar">
        <div className="shop-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={["category-tab", selectedCategory === cat ? "active" : ""].filter(Boolean).join(" ")}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="shop-toolbar__actions">
          <button
            className="filter-toggle-btn"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal size={16} /> Filters
          </button>

          <div className="shop-sort">
            <ArrowUpDown size={14} className="muted" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Featured Drops</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Best Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="shop-layout">
        {/* Filters Sidebar */}
        <aside className={["shop-sidebar", showMobileFilters ? "open" : ""].filter(Boolean).join(" ")}>
          <Panel className="page-card sidebar-panel">
            <div className="sidebar-section">
              <h4 className="sidebar-section__title">Search Products</h4>
              <div className="search-field">
                <Search size={16} className="search-icon muted" />
                <input
                  type="text"
                  placeholder="Type keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-section__header">
                <h4 className="sidebar-section__title">Filter by Price</h4>
                <span className="price-limit">${maxPrice} max</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="price-slider"
              />
              <div className="price-range-labels">
                <span>$50</span>
                <span>$300</span>
              </div>
            </div>

            <div className="sidebar-section">
              <h4 className="sidebar-section__title">Filter by Size</h4>
              <div className="sizes-selector-grid">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className={["size-filter-btn", selectedSizes.includes(sz) ? "active" : ""].filter(Boolean).join(" ")}
                    onClick={() => toggleSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleResetFilters}
              style={{ width: "100%", marginTop: "1rem" }}
            >
              Reset Filters
            </Button>
          </Panel>
        </aside>

        {/* Products Grid / Catalog Content */}
        <div className="shop-content">
          {filteredProducts.length === 0 ? (
            <div className="shop-empty-state sirat-panel">
              <RefreshCw size={40} className="muted animate-spin-slow" />
              <h3>No pieces found</h3>
              <p className="page-section__text">
                We couldn't find any products matching your search terms or size filter combinations.
              </p>
              <Button onClick={handleResetFilters} style={{ marginTop: "1rem" }}>
                Reset Search Filters
              </Button>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageFrame>
  );
}
