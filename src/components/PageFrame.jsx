import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function PageFrame({ eyebrow, title, description, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="page-section"
    >
      <nav className="page-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">-&gt;</span>
        <span className="breadcrumb-current">{eyebrow}</span>
      </nav>

      <div className="page-section__head">
        <p className="page-section__eyebrow">{eyebrow}</p>
        <h1 className="page-section__title">{title}</h1>
        <p className="page-section__text">{description}</p>
      </div>
      {children}
    </motion.section>
  );
}
