import { m } from "framer-motion";

export const Card = ({ children, className = "", ...props }) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${className}`}
      {...props}
    >
      {children}
    </m.div>
  );
};
