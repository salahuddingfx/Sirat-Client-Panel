import { m, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useCart } from "../../app/providers/CartContext";

export default function ConfirmDialog() {
  const { confirm, handleConfirm, handleCancel } = useCart();
  const { show = false, message = "" } = confirm || {};

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 10000,
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Dialog Container */}
          <m.div
            initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-40%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-40%" }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              background: "var(--sirat-surface)",
              border: "2px solid var(--sirat-gold)",
              padding: "2rem",
              borderRadius: "24px",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5)",
              zIndex: 10001,
              minWidth: "350px",
              maxWidth: "90vw",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "rgba(245, 158, 11, 0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--sirat-gold)",
              }}
            >
              <AlertTriangle size={32} />
            </div>

            <div style={{ display: "grid", gap: "0.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700" }}>Are you sure?</h3>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--sirat-muted)", lineHeight: "1.5" }}>
                {message || "This action cannot be undone."}
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
              <button
                onClick={handleCancel}
                style={{
                  flex: 1,
                  padding: "0.85rem",
                  borderRadius: "12px",
                  border: "1px solid var(--sirat-border)",
                  background: "none",
                  color: "var(--sirat-text-main)",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  flex: 1,
                  padding: "0.85rem",
                  borderRadius: "12px",
                  border: "none",
                  background: "var(--sirat-gold)",
                  color: "#000",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
              >
                Yes, Confirm
              </button>
            </div>

            <button
              onClick={handleCancel}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "none",
                border: "none",
                color: "var(--sirat-muted)",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <X size={18} />
            </button>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
