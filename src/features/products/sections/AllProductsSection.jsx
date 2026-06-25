import { useState, useEffect } from "react";
import { SectionHeader } from "@components/ui";
import ProductCard from "@features/products/components/ProductCard";
import { products as mockProducts } from "@data/mockData";
import { fetchProducts } from "@api/queries";

export default function AllProductsSection() {
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => console.error("Failed to fetch products:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="all-products-section">
      <SectionHeader
        eyebrow="Storefront Inventory"
        title="All Products"
        description="Browse our complete launch queue. Click on any product spec sheet for detailed quick view add-to-cart operations."
      />
      <div className="product-grid" style={{ marginTop: "1.5rem", opacity: loading ? 0.6 : 1 }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {!loading && products.length === 0 && <p className="muted">No products available at the moment.</p>}
      </div>
    </section>
  );
}
