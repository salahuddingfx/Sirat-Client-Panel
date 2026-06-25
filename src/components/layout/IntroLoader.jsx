import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import gsap from "gsap";

export default function IntroLoader({ onComplete }) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lineRef = useRef(null);
  const taglineRef = useRef(null);
  const cornerTL = useRef(null);
  const cornerTR = useRef(null);
  const cornerBL = useRef(null);
  const cornerBR = useRef(null);
  const progressBar = useRef(null);

  const handleDismiss = () => {
    const tl = gsap.timeline({ onComplete: () => onComplete() });
    tl.to(progressBar.current, { scaleX: 1, duration: 0.3, ease: "power2.in" })
      .to(containerRef.current, { opacity: 0, duration: 0.5, ease: "power3.in" }, "+=0.1");
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Split title into characters
    const titleEl = titleRef.current;
    if (titleEl) {
      const text = titleEl.innerText;
      titleEl.innerHTML = text
        .split("")
        .map(c => `<span class="loader-char" style="display:inline-block">${c === " " ? "&nbsp;" : c}</span>`)
        .join("");
    }

    const tl = gsap.timeline({
      onComplete: () => setTimeout(handleDismiss, 600)
    });

    // Corners slide in
    tl.fromTo([cornerTL.current, cornerTR.current, cornerBL.current, cornerBR.current],
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)", stagger: 0.08 }
    );

    // Line expand
    tl.fromTo(lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: "power3.out" },
      "-=0.2"
    );

    // Character entrance
    tl.fromTo(".loader-char",
      { y: 60, opacity: 0, rotateX: -40 },
      { y: 0, opacity: 1, rotateX: 0, duration: 0.7, stagger: 0.06, ease: "back.out(1.6)" },
      "-=0.5"
    );

    // Tagline
    tl.fromTo(taglineRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );

    // Subtitle
    tl.fromTo(subtitleRef.current,
      { opacity: 0, letterSpacing: "0.15em" },
      { opacity: 1, letterSpacing: "0.3em", duration: 0.8, ease: "power2.out" },
      "-=0.35"
    );

    // Progress bar fill
    tl.fromTo(progressBar.current,
      { scaleX: 0 },
      { scaleX: 0.7, duration: 2, ease: "power1.inOut" },
      "-=0.5"
    );

    // Close button
    tl.fromTo(closeBtnRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)" },
      "-=1.8"
    );

    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="sirat-intro-loader" ref={containerRef}>
      {/* Decorative Corners */}
      <div className="loader-corner loader-corner--tl" ref={cornerTL} />
      <div className="loader-corner loader-corner--tr" ref={cornerTR} />
      <div className="loader-corner loader-corner--bl" ref={cornerBL} />
      <div className="loader-corner loader-corner--br" ref={cornerBR} />

      <button
        type="button"
        className="loader-close-btn"
        onClick={handleDismiss}
        ref={closeBtnRef}
        aria-label="Skip intro"
      >
        <X size={16} />
        <span>Skip</span>
      </button>

      <div className="loader-center-content">
        {/* Diamond icon */}
        <div className="loader-diamond">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L22 12L12 22L2 12Z" />
          </svg>
        </div>

        {/* Gold line */}
        <div className="loader-line" ref={lineRef} />

        {/* Title */}
        <h1 className="loader-title" ref={titleRef}>SIRAT</h1>

        {/* Thin separator */}
        <div className="loader-thin-sep" />

        {/* Tagline */}
        <p className="loader-tagline" ref={taglineRef}>
          Premium Everyday Essentials
        </p>

        {/* Subtitle */}
        <p className="loader-subtitle" ref={subtitleRef}>Purity in Every Step</p>
      </div>

      {/* Progress bar */}
      <div className="loader-progress-track">
        <div className="loader-progress-bar" ref={progressBar} />
      </div>
    </div>
  );
}
