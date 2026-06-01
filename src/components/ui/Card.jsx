import { motion } from "framer-motion";

export const Card = ({ children, className = "", ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
