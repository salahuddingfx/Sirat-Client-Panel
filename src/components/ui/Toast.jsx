import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, XCircle, X } from "lucide-react";
import { useCart } from "../../app/providers/CartContext";
import { useDispatch } from "react-redux";
import { hideToast as hideToastAction } from "../../app/store/cartSlice";

export default function Toast() {
  const dispatch = useDispatch();
  const { toast } = useCart();
  const { show, message, type } = toast;

  const icons = {
    success: <CheckCircle size={48} className="toast-icon success" />,
    error: <XCircle size={48} className="toast-icon error" />,
    warning: <AlertCircle size={48} className="toast-icon warning" />,
    info: <Info size={48} className="toast-icon info" />,
  };

  const handleClose = () => {
    dispatch(hideToastAction());
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop for center toast */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9998, backdropFilter: 'blur(4px)' }}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-40%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.8, x: "-50%", y: "-40%" }}
            className={`sirat-toast toast-${type}`}
          >
            <div className="toast-content">
              {icons[type] || icons.info}
              <span className="toast-message">{message}</span>
              
              {(type === 'success' || type === 'info') && (
                <button className="toast-ok-btn" onClick={handleClose}>
                    OK
                </button>
              )}
            </div>
            
            <button className="toast-close" onClick={handleClose} aria-label="Close notification">
              <X size={20} />
            </button>
            
            <motion.div 
              className="toast-progress" 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3.5, ease: "linear" }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
