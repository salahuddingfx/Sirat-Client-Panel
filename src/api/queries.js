import axios from "axios";
import { z } from "zod";
import { productSchema, contactFormSchema, trackOrderSchema } from "./schemas";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().or(z.literal(""))
});

let env = { VITE_API_BASE_URL: "" };
try {
  env = envSchema.parse(import.meta.env);
} catch (e) {
  console.warn("Vite API environment variables validation failed", e);
}

export const clientApi = axios.create({
  baseURL: env.VITE_API_BASE_URL || undefined,
  headers: {
    "Content-Type": "application/json"
  }
});

export async function fetchFeaturedProducts() {
  const response = await clientApi.get("/products/featured");
  return z.array(productSchema).parse(response.data);
}

export async function fetchProducts() {
  const response = await clientApi.get("/products");
  return z.array(productSchema).parse(response.data);
}

export async function fetchProductBySlug(slug) {
  const response = await clientApi.get(`/products/${slug}`);
  return productSchema.parse(response.data);
}

export async function submitContactForm(payload) {
  return clientApi.post("/contact", contactFormSchema.parse(payload));
}

export async function trackOrder(payload) {
  return clientApi.post("/orders/track", trackOrderSchema.parse(payload));
}

export async function fetchReviews() {
  const response = await clientApi.get("/reviews");
  return response.data;
}

export async function placeOrder(payload) {
  const response = await clientApi.post("/orders", payload);
  return response.data;
}
