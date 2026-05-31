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
    variants: [
      { id: "lumina-s", label: "S", priceDelta: 0, inStock: true },
      { id: "lumina-m", label: "M", priceDelta: 0, inStock: true },
      { id: "lumina-l", label: "L", priceDelta: 0, inStock: true },
      { id: "lumina-xl", label: "XL", priceDelta: 0, inStock: true }
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
    variants: [
      { id: "nova-s", label: "S", priceDelta: 0, inStock: true },
      { id: "nova-m", label: "M", priceDelta: 0, inStock: true },
      { id: "nova-l", label: "L", priceDelta: 0, inStock: true },
      { id: "nova-xl", label: "XL", priceDelta: 0, inStock: false }
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
    variants: [
      { id: "orbit-s", label: "S", priceDelta: 0, inStock: true },
      { id: "orbit-m", label: "M", priceDelta: 0, inStock: true },
      { id: "orbit-l", label: "L", priceDelta: 0, inStock: true },
      { id: "orbit-xl", label: "XL", priceDelta: 0, inStock: true }
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
    variants: [
      { id: "vector-m", label: "M", priceDelta: 0, inStock: true },
      { id: "vector-l", label: "L", priceDelta: 0, inStock: true },
      { id: "vector-xl", label: "XL", priceDelta: 0, inStock: true }
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
    variants: [
      { id: "zenith-s", label: "S", priceDelta: 0, inStock: true },
      { id: "zenith-m", label: "M", priceDelta: 0, inStock: true },
      { id: "zenith-l", label: "L", priceDelta: 0, inStock: true }
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
    variants: [
      { id: "helix-s", label: "S", priceDelta: 0, inStock: true },
      { id: "helix-m", label: "M", priceDelta: 0, inStock: true },
      { id: "helix-l", label: "L", priceDelta: 0, inStock: true },
      { id: "helix-xl", label: "XL", priceDelta: 0, inStock: true }
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
    variants: [
      { id: "chrono-s", label: "S", priceDelta: 0, inStock: true },
      { id: "chrono-m", label: "M", priceDelta: 0, inStock: true },
      { id: "chrono-l", label: "L", priceDelta: 0, inStock: true }
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
    variants: [
      { id: "matrix-m", label: "M", priceDelta: 0, inStock: true },
      { id: "matrix-l", label: "L", priceDelta: 0, inStock: true },
      { id: "matrix-xl", label: "XL", priceDelta: 0, inStock: true }
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
    variants: [
      { id: "apex-s", label: "S", priceDelta: 0, inStock: true },
      { id: "apex-m", label: "M", priceDelta: 0, inStock: true },
      { id: "apex-l", label: "L", priceDelta: 0, inStock: true }
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
