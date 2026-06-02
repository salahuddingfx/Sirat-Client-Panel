import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_NAME = "Sirat";
const SITE_URL = "https://siratclothing.com";
const DEFAULT_TITLE = "Sirat | Luxury Combed Cotton Streetwear — Bangladesh";
const DEFAULT_DESCRIPTION =
  "Premium custom printed streetwear from Bangladesh. 100% heavyweight combed cotton tees, hoodies, and zip-ups with soft-touch puff prints.";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
const DEFAULT_KEYWORDS =
  "streetwear, combed cotton, custom print, Bangladesh clothing, premium t-shirt, heavyweight tee, oversized, puff print, Sirat, Cox's Bazar";

const setOrUpdateTag = (selector, attr, value) => {
  if (!value && value !== 0 && value !== false) return;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    const [, key, val] = selector.match(/\[(\w+)="([^"]+)"\]/) || [];
    if (key && val) {
      element.setAttribute(key, val);
    }
    document.head.appendChild(element);
  }
  element.setAttribute(attr, value);
};

const setOrCreateLink = (rel, href) => {
  if (!href) return;
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
};

const setOrUpdateJsonLd = (id, data) => {
  if (!data) return;
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

const removeJsonLd = (id) => {
  const script = document.getElementById(id);
  if (script) script.remove();
};

export default function SEO({
  title,
  description,
  image,
  url,
  type = "website",
  keywords,
  noindex = false,
  product,
  breadcrumb,
  author,
  publishedTime,
  modifiedTime,
}) {
  const location = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const desc = description || DEFAULT_DESCRIPTION;
    const ogImage = image || DEFAULT_IMAGE;
    const currentUrl = url || `${SITE_URL}${location.pathname}${location.search}`;
    const kw = keywords || DEFAULT_KEYWORDS;

    document.title = fullTitle;
    document.documentElement.lang = "en";

    setOrUpdateTag('meta[name="description"]', "content", desc);
    setOrUpdateTag('meta[name="keywords"]', "content", kw);
    setOrUpdateTag('meta[name="author"]', "content", author || "Sirat Clothing");
    setOrUpdateTag('meta[name="robots"]', "content", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setOrUpdateTag('meta[name="theme-color"]', "content", "#FAF9F5");

    setOrCreateLink("canonical", currentUrl);

    setOrUpdateTag('meta[property="og:title"]', "content", fullTitle);
    setOrUpdateTag('meta[property="og:description"]', "content", desc);
    setOrUpdateTag('meta[property="og:image"]', "content", ogImage);
    setOrUpdateTag('meta[property="og:url"]', "content", currentUrl);
    setOrUpdateTag('meta[property="og:type"]', "content", type);
    setOrUpdateTag('meta[property="og:site_name"]', "content", SITE_NAME);
    setOrUpdateTag('meta[property="og:locale"]', "content", "en_US");

    setOrUpdateTag('meta[name="twitter:card"]', "content", "summary_large_image");
    setOrUpdateTag('meta[name="twitter:title"]', "content", fullTitle);
    setOrUpdateTag('meta[name="twitter:description"]', "content", desc);
    setOrUpdateTag('meta[name="twitter:image"]', "content", ogImage);
    setOrUpdateTag('meta[name="twitter:site"]', "content", "@siratclothing");

    if (publishedTime) {
      setOrUpdateTag('meta[property="article:published_time"]', "content", publishedTime);
    }
    if (modifiedTime) {
      setOrUpdateTag('meta[property="article:modified_time"]', "content", modifiedTime);
    }

    if (breadcrumb && Array.isArray(breadcrumb) && breadcrumb.length > 0) {
      setOrUpdateJsonLd("sirat-breadcrumb", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumb.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url ? `${SITE_URL}${item.url}` : undefined,
        })),
      });
    } else {
      removeJsonLd("sirat-breadcrumb");
    }

    if (product) {
      const productLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description || desc,
        image: Array.isArray(product.images) ? product.images : [product.image || ogImage],
        sku: product.sku || product.id || product._id,
        mpn: product.mpn,
        brand: {
          "@type": "Brand",
          name: SITE_NAME,
        },
        category: product.category,
        offers: {
          "@type": "Offer",
          url: currentUrl,
          priceCurrency: product.currency || "BDT",
          price: product.price,
          priceValidUntil: product.priceValidUntil || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: SITE_NAME,
          },
        },
      };
      if (product.aggregateRating) {
        productLd.aggregateRating = {
          "@type": "AggregateRating",
          ratingValue: product.aggregateRating.ratingValue,
          reviewCount: product.aggregateRating.reviewCount,
          bestRating: product.aggregateRating.bestRating || 5,
          worstRating: product.aggregateRating.worstRating || 1,
        };
      }
      if (product.reviews && Array.isArray(product.reviews) && product.reviews.length > 0) {
        productLd.review = product.reviews.slice(0, 10).map((r) => ({
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: r.rating,
            bestRating: 5,
          },
          author: { "@type": "Person", name: r.author || "Anonymous" },
          datePublished: r.date || new Date().toISOString(),
          reviewBody: r.body || r.comment || "",
        }));
      }
      setOrUpdateJsonLd("sirat-product", productLd);
    } else {
      removeJsonLd("sirat-product");
    }
  }, [title, description, image, url, type, keywords, noindex, product, breadcrumb, author, publishedTime, modifiedTime, location.pathname, location.search]);

  return null;
}
