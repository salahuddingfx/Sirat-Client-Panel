import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { Button } from "../../components/ui";

const sliderSlides = [
  {
    type: "video",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-modeling-a-yellow-jacket-40539-large.mp4",
    title: "PREMIUM CUSTOM TEES",
    subtitle: "HIGH-DENSITY PRINTS",
    description: "Explore 100% combed cotton, heavyweight streetwear drops with premium custom print graphics.",
    actionText: "Shop the Drop",
    link: "/shop"
  },
  {
    type: "image",
    mediaUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200",
    title: "IMPORTED COMBED COTTON",
    subtitle: "OVERSIZED STREET FIT",
    description: "Tactile heavy fabrics engineered for maximum durability and comfort. Premium inks only.",
    actionText: "Explore Collection",
    link: "/shop"
  },
  {
    type: "image",
    mediaUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200",
    title: "PUFF PRINT CAPSULES",
    subtitle: "EXCLUSIVE ART DROPS",
    description: "Limitless self-expression. High-density puff graphics printed on hand-picked cotton blends.",
    actionText: "Shop Collection",
    link: "/shop"
  }
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliderSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.from(".hero-animate", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out"
      });
    }, heroRef);
    return () => context.revert();
  }, []);

  return (
    <section className="homepage-hero hero-animate" ref={heroRef}>
      <div className="hero-split-container">
        <div className="hero-split-media">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              className="hero-media-wrapper"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
            >
              {sliderSlides[activeSlide].type === "video" ? (
                <video
                  src={sliderSlides[activeSlide].mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="hero-slide__video"
                />
              ) : (
                <div
                  className="hero-slide__image"
                  style={{ backgroundImage: `url(${sliderSlides[activeSlide].mediaUrl})` }}
                />
              )}
              <div className="hero-media-overlay" />
            </motion.div>
          </AnimatePresence>

          <div className="slider-ctrls-group">
            <button
              className="slider-ctrl prev"
              onClick={() => setActiveSlide((prev) => (prev - 1 + sliderSlides.length) % sliderSlides.length)}
              aria-label="Prev"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="slider-ctrl next"
              onClick={() => setActiveSlide((prev) => (prev + 1) % sliderSlides.length)}
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="hero-split-info">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              className="hero-info-wrapper"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.45 }}
            >
              <span className="storefront__badge hero-animate">
                <Sparkles size={12} /> {sliderSlides[activeSlide].subtitle}
              </span>
              <h1 className="hero-slide__title hero-animate">{sliderSlides[activeSlide].title}</h1>
              <p className="hero-slide__desc hero-animate">{sliderSlides[activeSlide].description}</p>
              <div className="hero-slide__actions hero-animate">
                <Link to={sliderSlides[activeSlide].link}>
                  <Button>{sliderSlides[activeSlide].actionText}</Button>
                </Link>
                <Link to="/shop">
                  <Button variant="outline">Browse drop</Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="slider-indicators">
            {sliderSlides.map((_, idx) => (
              <button
                key={idx}
                className={["indicator", idx === activeSlide ? "active" : ""].filter(Boolean).join(" ")}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Slide ${idx}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
