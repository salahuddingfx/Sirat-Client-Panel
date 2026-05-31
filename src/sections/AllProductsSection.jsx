import { SectionHeader } from "../lib/ui";
import ProductCard from "../components/ProductCard";
import { products } from "../data/mockData";

export default function AllProductsSection() {
  return (
    <section className="all-products-section">
      <SectionHeader
        eyebrow="Storefront Inventory"
        title="All Garments"
        description="Browse our complete launch queue. Click on any product spec sheet for detailed quick view add-to-cart operations."
      />
      <div className="product-grid" style={{ marginTop: "1.5rem" }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
