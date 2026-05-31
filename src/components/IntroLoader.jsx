import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import gsap from "gsap";

export default function IntroLoader({ onComplete }) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const closeBtnRef = useRef(null);

  const handleDismiss = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      }
    });
    
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.85,
      ease: "power4.inOut"
    });
  };

  useEffect(() => {
    // Prevent scrolling behind loader
    document.body.style.overflow = "hidden";

    // Split title into characters
    const titleText = titleRef.current;
    if (titleText) {
      const chars = titleText.innerText.split("");
      titleText.innerHTML = chars
        .map(char => `<span class="loader-char" style="display:inline-block">${char === " " ? "&nbsp;" : char}</span>`)
        .join("");
    }

    const tl = gsap.timeline({
      onComplete: () => {
        // Auto dismiss 800ms after animations finish
        setTimeout(handleDismiss, 800);
      }
    });

    // Character entrance
    tl.fromTo(
      ".loader-char",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "back.out(1.6)" }
    );

    // Tagline entrance
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, letterSpacing: "0.1em" },
      { opacity: 1, letterSpacing: "0.22em", duration: 0.8, ease: "power2.out" },
      "-=0.45"
    );

    // Fade-in close button
    tl.fromTo(
      closeBtnRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      "-=0.6"
    );

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="sirat-intro-loader" ref={containerRef}>
      <button 
        type="button" 
        className="loader-close-btn" 
        onClick={handleDismiss} 
        ref={closeBtnRef}
        aria-label="Skip intro"
      >
        <X size={18} />
      </button>
      
      <div className="loader-center-content">
        <h1 className="loader-title" ref={titleRef}>
          SIRAT
        </h1>
        <p className="loader-subtitle" ref={subtitleRef}>
          Purity in Every Step
        </p>
      </div>
    </div>
  );
}
