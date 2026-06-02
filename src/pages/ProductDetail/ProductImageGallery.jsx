import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

export default function ProductImageGallery({ images, productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const imageRef = useRef(null);

  const imageList = images?.length > 0 ? images : [];

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setZoom(1);
    setShowLightbox(true);
  };

  const goPrev = useCallback(() => {
    setLightboxIndex(i => (i > 0 ? i - 1 : imageList.length - 1));
    setZoom(1);
  }, [imageList.length]);

  const goNext = useCallback(() => {
    setLightboxIndex(i => (i < imageList.length - 1 ? i + 1 : 0));
    setZoom(1);
  }, [imageList.length]);

  useEffect(() => {
    if (!showLightbox) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setShowLightbox(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "+" || e.key === "=") setZoom(z => Math.min(z + 0.5, 4));
      if (e.key === "-") setZoom(z => Math.max(z - 0.5, 0.5));
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [showLightbox, goPrev, goNext]);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  if (imageList.length === 0) {
    return (
      <div className="detail-media-frame">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999" }}>
          No images
        </div>
      </div>
    );
  }

  const currentImage = imageList[selectedIndex];

  return (
    <>
      <div className="product-detail-media">
        <div
          className="detail-media-frame"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => { setIsHovering(false); setZoom(1); }}
          onMouseMove={handleMouseMove}
          onClick={() => openLightbox(selectedIndex)}
          style={{ cursor: "pointer" }}
        >
          <img
            ref={imageRef}
            src={currentImage}
            alt={productName || `Product image ${selectedIndex + 1}`}
            className="detail-image"
            draggable={false}
            style={
              isHovering
                ? {
                    transform: "scale(1.8)",
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transition: "transform 0.05s ease",
                  }
                : {}
            }
          />
        </div>

        {imageList.length > 1 && (
          <div className="detail-thumbnails">
            {imageList.map((img, i) => (
              <button
                key={i}
                className={`detail-thumb ${i === selectedIndex ? "detail-thumb--active" : ""}`}
                onClick={() => setSelectedIndex(i)}
              >
                <img src={img} alt={`${productName || "Product"} ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {showLightbox && (
        <div className="product-lightbox" onClick={() => setShowLightbox(false)}>
          <button className="lightbox-close" onClick={() => setShowLightbox(false)} title="Close (Esc)">
            <X size={24} />
          </button>

          {imageList.length > 1 && (
            <>
              <button className="lightbox-nav lightbox-nav--prev" onClick={(e) => { e.stopPropagation(); goPrev(); }} title="Previous (←)">
                <ChevronLeft size={32} />
              </button>
              <button className="lightbox-nav lightbox-nav--next" onClick={(e) => { e.stopPropagation(); goNext(); }} title="Next (→)">
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <div className="lightbox-controls">
            <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(z - 0.5, 0.5)); }} title="Zoom Out">
              <ZoomOut size={18} />
            </button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(z + 0.5, 4)); }} title="Zoom In">
              <ZoomIn size={18} />
            </button>
          </div>

          <div className="lightbox-image-wrap" onClick={(e) => e.stopPropagation()}>
            <img
              src={imageList[lightboxIndex]}
              alt={`${productName || "Product"} ${lightboxIndex + 1}`}
              style={{ transform: `scale(${zoom})`, transition: "transform 0.2s ease" }}
            />
          </div>

          <div className="lightbox-counter">
            {lightboxIndex + 1} / {imageList.length}
          </div>

          {imageList.length > 1 && (
            <div className="lightbox-thumbnails" onClick={(e) => e.stopPropagation()}>
              {imageList.map((img, i) => (
                <button
                  key={i}
                  className={`lightbox-thumb ${i === lightboxIndex ? "lightbox-thumb--active" : ""}`}
                  onClick={() => { setLightboxIndex(i); setZoom(1); }}
                >
                  <img src={img} alt={`Thumb ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
