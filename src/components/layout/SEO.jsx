import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function SEO({ title, description, image, url }) {
  const location = useLocation();

  useEffect(() => {
    // 1. Set Title
    const defaultTitle = "Sirat | Luxury Clothing Store";
    document.title = title ? `${title} | Sirat` : defaultTitle;

    // 2. Helper to set or update meta tag in the head
    const setMetaTag = (attributeName, attributeValue, contentValue) => {
      if (!contentValue) return;
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (element) {
        element.setAttribute("content", contentValue);
      } else {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        element.setAttribute("content", contentValue);
        document.head.appendChild(element);
      }
    };

    // Default SEO specifications
    const defaultDesc = "Premium custom printed clothing. 100% combed cotton, heavyweight streetwear drops.";
    const defaultImage = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200";
    const currentUrl = url || window.location.href;

    // 3. Update Standard Tags
    setMetaTag("name", "description", description || defaultDesc);

    // 4. Update Open Graph (Social Sharing) Tags
    setMetaTag("property", "og:title", title ? `${title} | Sirat` : "Sirat | Luxury Clothing Store");
    setMetaTag("property", "og:description", description || defaultDesc);
    setMetaTag("property", "og:image", image || defaultImage);
    setMetaTag("property", "og:url", currentUrl);

    // 5. Update Twitter Card Tags
    setMetaTag("name", "twitter:title", title ? `${title} | Sirat` : "Sirat | Luxury Clothing Store");
    setMetaTag("name", "twitter:description", description || defaultDesc);
    setMetaTag("name", "twitter:image", image || defaultImage);
  }, [title, description, image, url, location.pathname]);

  return null;
}
