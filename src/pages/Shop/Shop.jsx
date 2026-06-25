import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw } from "lucide-react";
import PageFrame from "@components/layout/PageFrame";
import ProductCard from "@features/products/components/ProductCard";
import SEO from "@components/layout/SEO";
import { Button, Panel } from "@components/ui";
import { fetchProducts, fetchCategories } from "@api/queries";
import track from "@lib/tracker";

const sizes = ["XS", "S", "M", "L", "XL"];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamQuery = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "All";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [searchQuery, setSearchQuery] = useState(searchParamQuery);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setProducts(productsData || []);
        if (categoriesData) {
            setCategories(["All", ...categoriesData.map(c => c.name)]);
        }
      } catch (err) {
        console.error("Failed to fetch shop data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    setSearchQuery(searchParamQuery);
  }, [searchParamQuery]);

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "All");
  }, [searchParams]);

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
    setMaxPrice(10000);
    setSortBy("featured");
  };

  // Dynamic products filtering & sorting logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) => {
          const categoryName = p.category?.name || p.category || "";
          return (
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            categoryName.toLowerCase().includes(query)
          );
        }
      );
    }

    // 2. Category Tab filter
    if (selectedCategory !== "All") {
      result = result.filter((p) => {
        const categoryName = p.category?.name || p.category || "";
        return categoryName.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    // 3. Price slider filter
    result = result.filter((p) => p.price <= maxPrice);

    // 4. Size checkbox filter
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.variants?.some((v) => selectedSizes.includes(v.label) && v.stock > 0)
      );
    }

    // 5. Sorting logic
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // "featured" default, prioritize featured:true
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedSizes, maxPrice, sortBy]);

  return (
    <PageFrame
      eyebrow="Catalog"
      title="Sirat Custom Drops"
      description="Browse our collection of premium custom printed combed cotton t-shirts. Filter by sizes, prices, and styles."
    >
      <SEO
        title="Shop"
        description="Browse all Sirat drops: premium combed cotton oversized tees, hoodies, zip-ups, and exclusive puff print releases. Filter by size, price, and category. Free delivery in Cox's Bazar."
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Shop", url: "/shop" },
        ]}
      />
      {/* Category Tabs & Toolbar */}
      <div className="shop-toolbar">
        <div className="shop-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={["category-tab", selectedCategory === cat ? "active" : ""].filter(Boolean).join(" ")}
              onClick={() => {
                setSelectedCategory(cat);
                const params = {};
                const q = searchParams.get("q");
                if (q) params.q = q;
                if (cat !== "All") params.category = cat;
                setSearchParams(params);
                track.event("category_view", { label: cat });
              }}
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim().length >= 2) {
                      track.event("search", { label: searchQuery.trim() });
                    }
                  }}
                />
              </div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-section__header">
                <h4 className="sidebar-section__title">Filter by Price</h4>
                <span className="price-limit">{'\u09F3'}{maxPrice} max</span>
              </div>
              <input
                type="range"
                min="0"
                max="20000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="price-slider"
              />
              <div className="price-range-labels">
                <span>{'\u09F3'}0</span>
                <span>{'\u09F3'}20000</span>
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
          {isLoading ? (
            <div className="product-grid">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="product-card-modern" style={{ pointerEvents: "none" }}>
                  <div className="product-card-modern__media skeleton" style={{ aspectRatio: "1.15 / 1" }} />
                  <div className="product-card-modern__body" style={{ padding: "0.7rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                    <div className="skeleton" style={{ height: "1.1rem", width: "75%" }} />
                    <div className="skeleton" style={{ height: "0.85rem", width: "45%" }} />
                    <div className="skeleton" style={{ height: "0.85rem", width: "90%", marginTop: "0.2rem" }} />
                    <hr className="product-card-modern__divider" style={{ margin: "0.25rem 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div className="skeleton" style={{ height: "1.2rem", width: "30%" }} />
                      <div className="skeleton" style={{ height: "1.7rem", width: "25%", borderRadius: "6px" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
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
