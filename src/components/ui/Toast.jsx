import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, XCircle, X } from "lucide-react";
import { useCart } from "../../app/providers/CartContext";

export default function Toast() {
  const { toast, triggerToast } = useCart();
  const { show, message, type } = toast;

  const icons = {
    success: <CheckCircle size={18} className="toast-icon success" />,
    error: <XCircle size={18} className="toast-icon error" />,
    warning: <AlertCircle size={18} className="toast-icon warning" />,
    info: <Info size={18} className="toast-icon info" />,
  };

  const closeToast = () => {
    // Hide toast by triggering an empty one or adding a hide action
    // For now, we rely on the auto-hide in triggerToast
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className={`sirat-toast toast-${type}`}
        >
          <div className="toast-content">
            {icons[type] || icons.info}
            <span className="toast-message">{message}</span>
          </div>
          <button className="toast-close" aria-label="Close notification">
            <X size={14} />
          </button>
          
          <motion.div 
            className="toast-progress" 
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 3.5, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
