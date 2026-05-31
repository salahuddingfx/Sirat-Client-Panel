import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const Panel = ({ children, className = "", ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("sirat-panel", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};
