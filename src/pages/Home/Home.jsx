import { useState } from "react";
import { m } from "framer-motion";
import HeroSection from "@features/products/sections/HeroSection";
import FlashSaleSection from "@features/products/sections/FlashSaleSection";
import VisualsSection from "@features/products/sections/VisualsSection";
import CategorySection from "@features/products/sections/CategorySection";
import BestSellerSection from "@features/products/sections/BestSellerSection";
import AllProductsSection from "@features/products/sections/AllProductsSection";
import ReviewsSection from "@features/products/sections/ReviewsSection";
import CtaSection from "@features/products/sections/CtaSection";
import FaqSection from "@features/products/sections/FaqSection";
import NewsletterSection from "@features/products/sections/NewsletterSection";
import { storyPoints } from "@data/mockData";
import { Panel } from "@components/ui";
import SEO from "@components/layout/SEO";

export default function HomePage() {
  return (
    <>
      <SEO
        title="Home"
        description="Sirat specializes in premium custom printed garments made from 100% combed cotton. Explore our latest heavyweight streetwear drops, limited puff print collections, and signature oversized fits."
        keywords="streetwear Bangladesh, custom printed tee, combed cotton, heavyweight oversized t-shirt, puff print, hoodies, zip-ups, premium clothing brand"
      />
      {/* 1. Hero media slider — full width, outside container */}
      <HeroSection />

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.35 }}
        className="storefront__content"
      >
      {/* Flash Sale highlighted section */}
      <FlashSaleSection />

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
        <m.div 
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
              <m.div
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
              </m.div>
            );
          })}
        </m.div>
      </section>

      {/* 6. Animated reviews carousel */}
      <ReviewsSection />

      {/* 7. Call To Action (CTA) collection card */}
      <CtaSection />

      {/* FAQ accordions */}
      <FaqSection />

      {/* Newsletter signup card */}
      <NewsletterSection />
      </m.div>
    </>
  );
}
