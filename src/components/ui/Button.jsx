import { motion } from "framer-motion";

export const Button = ({ 
  children, 
  variant = "primary", 
  className = "", 
  ...props 
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`sirat-button sirat-button--${variant} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
