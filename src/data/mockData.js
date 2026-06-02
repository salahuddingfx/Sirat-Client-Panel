import { ShieldCheck, Truck, Sparkles } from "lucide-react";

export const products = [
  {
    id: "lumina-coat",
    name: "Lumina Heavy Oversized Tee",
    slug: "lumina-coat",
    description: "Premium 300 GSM heavy imported cotton with a soft matte texture and high-density chest print.",
    price: 1200,
    oldPrice: 1500,
    currency: "BDT",
    category: "Oversized",
    rating: 4.9,
    featured: true,
    weight: "0.35",
    colors: ["#1E1915", "#FAF7F2", "#7F1D1D"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=600",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600"
    ],
    variants: [
      { id: "lumina-s", label: "S", priceDelta: 0, stock: 10 },
      { id: "lumina-m", label: "M", priceDelta: 0, stock: 10 },
      { id: "lumina-l", label: "L", priceDelta: 0, stock: 10 },
      { id: "lumina-xl", label: "XL", priceDelta: 0, stock: 10 }
    ]
  },
  {
    id: "nova-set",
    name: "Nova Custom Puff Tee",
    slug: "nova-set",
    description: "100% combed cotton, 260 GSM custom puff printed graphic tee. Made for durable everyday streetwear.",
    price: 950,
    oldPrice: 1200,
    currency: "BDT",
    category: "Custom Prints",
    rating: 4.8,
    featured: true,
    bestSeller: true,
    weight: "0.32",
    colors: ["#2C302E", "#FAF7F2"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=600",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600"
    ],
    variants: [
      { id: "nova-s", label: "S", priceDelta: 0, stock: 10 },
      { id: "nova-m", label: "M", priceDelta: 0, stock: 10 },
      { id: "nova-l", label: "L", priceDelta: 0, stock: 10 },
      { id: "nova-xl", label: "XL", priceDelta: 0, stock: false }
    ]
  },
  {
    id: "orbit-tee",
    name: "Orbit Screen Print Tee",
    slug: "orbit-tee",
    description: "Lightweight 220 GSM combed cotton with high-density imported ink graphics. Breathable and premium.",
    price: 850,
    oldPrice: 1100,
    currency: "BDT",
    category: "Screen Prints",
    rating: 4.7,
    featured: true,
    weight: "0.28",
    colors: ["#1E1915", "#FAF7F2", "#7E7873"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600",
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600",
      "https://images.unsplash.com/photo-1608236415052-f1e43c1349ec?q=80&w=600",
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=600"
    ],
    variants: [
      { id: "orbit-s", label: "S", priceDelta: 0, stock: 10 },
      { id: "orbit-m", label: "M", priceDelta: 0, stock: 10 },
      { id: "orbit-l", label: "L", priceDelta: 0, stock: 10 },
      { id: "orbit-xl", label: "XL", priceDelta: 0, stock: 10 }
    ]
  },
  {
    id: "vector-trouser",
    name: "Vector Vintage Acid-Wash Tee",
    slug: "vector-trouser",
    description: "Vintage washed streetwear tee in 280 GSM heavy imported cotton. Hand distressed detailing.",
    price: 1100,
    oldPrice: 1400,
    currency: "BDT",
    category: "Oversized",
    rating: 4.8,
    featured: false,
    weight: "0.34",
    colors: ["#1E1915", "#7E7873"],
    sizes: ["M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600",
      "https://images.unsplash.com/photo-1542125387-c71274bbb9c2?q=80&w=600",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600"
    ],
    variants: [
      { id: "vector-m", label: "M", priceDelta: 0, stock: 10 },
      { id: "vector-l", label: "L", priceDelta: 0, stock: 10 },
      { id: "vector-xl", label: "XL", priceDelta: 0, stock: 10 }
    ]
  },
  {
    id: "zenith-parka",
    name: "Zenith Heavy Hooded Tee",
    slug: "zenith-parka",
    description: "Thick double-knit combed cotton with high-density back print graphic. Designed for street comfort.",
    price: 1350,
    oldPrice: 1650,
    currency: "BDT",
    category: "Custom Prints",
    rating: 4.95,
    featured: true,
    weight: "0.42",
    colors: ["#1E1915", "#7F1D1D"],
    sizes: ["S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=600"
    ],
    variants: [
      { id: "zenith-s", label: "S", priceDelta: 0, stock: 10 },
      { id: "zenith-m", label: "M", priceDelta: 0, stock: 10 },
      { id: "zenith-l", label: "L", priceDelta: 0, stock: 10 }
    ]
  },
  {
    id: "helix-hoodie",
    name: "Helix Typography Tee",
    slug: "helix-hoodie",
    description: "Futuristic puff printed typography on ultra-soft imported combed cotton. Crew neck fit.",
    price: 980,
    oldPrice: 1250,
    currency: "BDT",
    category: "Custom Prints",
    rating: 4.65,
    featured: false,
    weight: "0.30",
    colors: ["#1E1915", "#FAF7F2", "#7E7873"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=600",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=600"
    ],
    variants: [
      { id: "helix-s", label: "S", priceDelta: 0, stock: 10 },
      { id: "helix-m", label: "M", priceDelta: 0, stock: 10 },
      { id: "helix-l", label: "L", priceDelta: 0, stock: 10 },
      { id: "helix-xl", label: "XL", priceDelta: 0, stock: 10 }
    ]
  },
  {
    id: "chrono-cap",
    name: "Chrono Distressed Custom Tee",
    slug: "chrono-cap",
    description: "Heavyweight drop shoulder tee featuring custom embroidery and screen printed back art.",
    price: 890,
    oldPrice: 1150,
    currency: "BDT",
    category: "Oversized",
    rating: 4.5,
    featured: false,
    weight: "0.33",
    colors: ["#1E1915", "#7E7873"],
    sizes: ["S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=600",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600",
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600"
    ],
    variants: [
      { id: "chrono-s", label: "S", priceDelta: 0, stock: 10 },
      { id: "chrono-m", label: "M", priceDelta: 0, stock: 10 },
      { id: "chrono-l", label: "L", priceDelta: 0, stock: 10 }
    ]
  },
  {
    id: "matrix-cargo",
    name: "Matrix Cyberpunk Print Tee",
    slug: "matrix-cargo",
    description: "Bold neon ink printing on imported heavy cotton fabric. Double stitched hems for durability.",
    price: 1050,
    oldPrice: 1300,
    currency: "BDT",
    category: "Screen Prints",
    rating: 4.75,
    featured: false,
    weight: "0.31",
    colors: ["#1E1915"],
    sizes: ["M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600",
      "https://images.unsplash.com/photo-1608236415052-f1e43c1349ec?q=80&w=600",
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=600",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600"
    ],
    variants: [
      { id: "matrix-m", label: "M", priceDelta: 0, stock: 10 },
      { id: "matrix-l", label: "L", priceDelta: 0, stock: 10 },
      { id: "matrix-xl", label: "XL", priceDelta: 0, stock: 10 }
    ]
  },
  {
    id: "apex-blazer",
    name: "Apex Minimal Embroidered Tee",
    slug: "apex-blazer",
    description: "Ultra premium 240 GSM combed cotton with a clean minimal brand chest embroidery details.",
    price: 750,
    oldPrice: 950,
    currency: "BDT",
    category: "Essentials",
    rating: 4.9,
    featured: false,
    weight: "0.27",
    colors: ["#1E1915", "#7E7873"],
    sizes: ["S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=600",
      "https://images.unsplash.com/photo-1542125387-c71274bbb9c2?q=80&w=600",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600"
    ],
    variants: [
      { id: "apex-s", label: "S", priceDelta: 0, stock: 10 },
      { id: "apex-m", label: "M", priceDelta: 0, stock: 10 },
      { id: "apex-l", label: "L", priceDelta: 0, stock: 10 }
    ]
  }
];

export const storyPoints = [
  {
    title: "Premium Craft",
    copy: "Structured cuts, luxury textures, and bold silhouettes made to read high-end on every device.",
    icon: ShieldCheck
  },
  {
    title: "Fast Fulfillment",
    copy: "Tracked orders, shipping updates, and order history are all part of the customer experience.",
    icon: Truck
  },
  {
    title: "Launch Ready",
    copy: "The frontend is wired for product, cart, checkout, and support flows from the start.",
    icon: Sparkles
  }
];
