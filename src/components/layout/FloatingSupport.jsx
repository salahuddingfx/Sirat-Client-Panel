import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, X, ChevronDown } from "lucide-react";
import { useSettings } from "@app/providers/settings";

export default function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettings();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.75rem",
      }}
    >
      <style>{`
        @media (max-width: 480px) {
          .fs-fab {
            width: 44px !important;
            height: 44px !important;
          }
          .fs-fab svg {
            width: 20px !important;
            height: 20px !important;
          }
          .fs-card {
            max-width: 280px !important;
            right: 0 !important;
          }
        }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fs-card"
            style={{
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 12px 48px rgba(0,0,0,0.12)",
              border: "1px solid rgba(0,0,0,0.06)",
              maxWidth: "300px",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#075E54",
                color: "#fff",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MessageCircle size={18} />
                <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Chat with us</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: "#fff",
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: 0,
                }}
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>

            <div style={{ padding: "16px" }}>
              <p style={{ margin: "0 0 12px", fontSize: "0.88rem", color: "#444", lineHeight: "1.5" }}>
                👋 Hey! Got a question or need help with your order? We're here for you!
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  padding: "10px 12px",
                  background: "#F5F5F5",
                  borderRadius: "10px",
                  marginBottom: "12px",
                  fontSize: "0.85rem",
                  color: "#333",
                  fontWeight: 600,
                }}
              >
                <Phone size={16} style={{ flexShrink: 0, color: "#075E54" }} />
                <span>{settings.phone}</span>
              </div>

              <a
                href={settings.whatsapp || "https://wa.me/8801700000000"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "10px 0",
                  background: "#25D366",
                  color: "#fff",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.424 5.429 0 12.04 0c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.617-5.43 12.04-12.04 12.04-2.007-.001-3.98-.502-5.733-1.464L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.793 1.453 5.378 0 9.761-4.38 9.765-9.76.002-2.607-1.01-5.057-2.859-6.908C16.449 2.088 14 1.077 11.96 1.077 6.582 1.077 2.2 5.457 2.197 10.835c-.001 1.704.469 3.366 1.362 4.821L2.553 20.3l4.794-1.257zM17.447 14.9c-.29-.145-1.72-.85-1.985-.95-.267-.097-.463-.146-.658.146-.195.29-.755.95-.925 1.144-.171.196-.341.22-.63.074-.29-.145-1.228-.453-2.339-1.444-.864-.772-1.448-1.724-1.618-2.014-.17-.29-.018-.447.127-.59.13-.13.29-.34.435-.508.145-.17.193-.29.292-.483.097-.194.048-.363-.025-.508-.073-.146-.66-1.59-.903-2.175-.236-.57-.478-.49-.658-.5H7.75c-.195 0-.51.072-.776.363-.266.29-1.02 1-1.02 2.438 0 1.437 1.045 2.825 1.19 3.018.145.194 2.055 3.14 4.978 4.4 2.923 1.259 2.923.84 3.453.79.53-.05 1.72-.7 1.96-1.378.24-.678.24-1.258.17-1.377-.07-.119-.265-.194-.556-.34z" />
                </svg>
                WhatsApp Chat
              </a>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen((p) => !p)}
        className="fs-fab"
        style={{
          background: "#25D366",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: isOpen
            ? "0 4px 16px rgba(37, 211, 102, 0.3)"
            : "0 8px 32px rgba(37, 211, 102, 0.35)",
          width: "54px",
          height: "54px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          cursor: "pointer",
          padding: 0,
          transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
        }}
        aria-label={isOpen ? "Close support" : "Open support"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
