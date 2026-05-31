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
        <motion.div 
          className="info-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {storyPoints.map((point) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                }}
              >
                <Panel className="page-card value-card">
                  <div className="value-card-header">
                    <div className="value-icon-container">
                      <Icon size={20} className="value-icon" />
                    </div>
                    <h3 className="value-card-title">{point.title}</h3>
                  </div>
                  <p className="page-section__text value-card-copy">
                    {point.copy}
                  </p>
                </Panel>
              </motion.div>
            );
          })}
        </motion.div>
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
