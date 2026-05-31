import { useState } from "react";
import { motion } from "framer-motion";
import HeroSection from "../sections/HeroSection";
import VisualsSection from "../sections/VisualsSection";
import CategorySection from "../sections/CategorySection";
import BestSellerSection from "../sections/BestSellerSection";
import AllProductsSection from "../sections/AllProductsSection";
import ReviewsSection from "../sections/ReviewsSection";
import CtaSection from "../sections/CtaSection";
import FaqSection from "../sections/FaqSection";
import NewsletterSection from "../sections/NewsletterSection";
import { storyPoints } from "../data/mockData";
import { Panel } from "../lib/ui";
import SEO from "../components/SEO";

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="storefront__content"
    >
      <SEO title="Home" description="Sirat specializes in premium custom printed garments made from 100% combed cotton. Explore our latest heavyweight streetwear drops." />
      {/* 1. Hero media slider */}
      <HeroSection />

      {/* 2. Highlighted products visual grid */}
      <VisualsSection />

      {/* 3. Controllable animated categories */}
      <CategorySection />

      {/* 4. Best Seller detailed showcase */}
      <BestSellerSection />

      {/* 5. Complete inventory product grid */}
      <AllProductsSection />

      {/* Value proposition points */}
      <section className="story-section">
        <div className="info-grid">
          {storyPoints.map((point) => {
            const Icon = point.icon;
            return (
              <Panel key={point.title} className="page-card">
                <div className="storefront__badge">
                  <Icon size={14} /> {point.title}
                </div>
                <p className="page-section__text" style={{ marginTop: "0.85rem" }}>
                  {point.copy}
                </p>
              </Panel>
            );
          })}
        </div>
      </section>

      {/* 6. Animated reviews carousel */}
      <ReviewsSection />

      {/* 7. Call To Action (CTA) collection card */}
      <CtaSection />

      {/* FAQ accordions */}
      <FaqSection />

      {/* Newsletter signup card */}
      <NewsletterSection />
    </motion.div>
  );
}
