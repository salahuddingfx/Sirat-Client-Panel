import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SectionHeader } from "@components/ui";
import { fetchFeaturedProducts } from "@api/queries";
import "./VisualsSection.css";

export default function VisualsSection() {
  const [featured, setFeatured] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetchFeaturedProducts();
        if (mounted) setFeatured((res || []).slice(0, 5));
      } catch (e) {
        console.error("Failed to fetch featured products:", e);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (!featured || featured.length === 0) return null;

  const [hero, ...rest] = featured;
  const tiles = rest.slice(0, 4);

  return (
    <section className="visuals-section">
      <SectionHeader
        eyebrow="Visual drop specs"
        title="Product Visuals"
        description="Highlighting signature garments crafted in structured textures and futuristic silhouettes."
      />

      <div className="visuals-bento">
        <BentoHero product={hero} onClick={() => navigate(`/product/${hero.slug}`)} />

        <div className="visuals-bento__grid">
          {tiles.map((product, idx) => (
            <BentoTile
              key={product.id}
              product={product}
              index={idx}
              onClick={() => navigate(`/product/${product.slug}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BentoHero({ product, onClick }) {
  return (
    <m.button
      type="button"
      onClick={onClick}
      className="visuals-hero"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="visuals-hero__media">
        <img src={product.images?.[0] || product.image} alt={product.name} loading="lazy" />
        <div className="visuals-hero__shine" />
      </div>
      <div className="visuals-hero__overlay">
        <span className="visuals-hero__tag">Featured · 01</span>
        <h3 className="visuals-hero__title">{product.name}</h3>
        <div className="visuals-hero__footer">
          <span className="visuals-hero__price">৳{product.price}</span>
          <span className="visuals-hero__cta">
            View <ArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </m.button>
  );
}

function BentoTile({ product, index, onClick }) {
  return (
    <m.button
      type="button"
      onClick={onClick}
      className="visuals-tile"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="visuals-tile__media">
        <img src={product.images?.[0] || product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="visuals-tile__info">
        <span className="visuals-tile__name">{product.name}</span>
        <span className="visuals-tile__price">৳{product.price}</span>
      </div>
      <span className="visuals-tile__arrow">
        <ArrowUpRight size={14} />
      </span>
    </m.button>
  );
}
