import axios from "axios";
import { z } from "zod";
import { productSchema, contactFormSchema, trackOrderSchema, settingsSchema, categorySchema } from "./schemas";

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

export async function fetchProducts() {
  const response = await clientApi.get("/products");
  const data = response.data.data;
  if (!Array.isArray(data)) return [];

  return data.map(item => {
      try {
          return productSchema.parse(item);
      } catch (e) {
          console.warn("Skipping invalid product:", item?._id, e);
          return null;
      }
  }).filter(Boolean);
}

export async function fetchFeaturedProducts() {
  const response = await clientApi.get("/products/featured");
  const data = response.data.data;
  if (!Array.isArray(data)) return [];

  return data.map(item => {
    try {
        return productSchema.parse(item);
    } catch (e) {
        console.warn("Skipping invalid featured product:", item?._id, e);
        return null;
    }
  }).filter(Boolean);
}

export async function fetchCategories() {
  const response = await clientApi.get("/categories");
  const data = response.data.data;
  if (!Array.isArray(data)) return [];

  return data.map(item => {
    try {
        return categorySchema.parse(item);
    } catch (e) {
        console.warn("Skipping invalid category:", item?._id, e);
        return null;
    }
  }).filter(Boolean);
}

export async function submitContactForm(payload) {
  return clientApi.post("/contact", contactFormSchema.parse(payload));
}

export async function trackOrder(payload) {
  return clientApi.post("/orders/track", trackOrderSchema.parse(payload));
}

export async function fetchReviews() {
  const response = await clientApi.get("/reviews");
  return response.data.data;
}

export async function placeOrder(payload) {
  const response = await clientApi.post("/orders", payload);
  return response.data;
}

export async function loginUser(credentials) {
  const response = await clientApi.post("/auth/login", credentials);
  return response.data;
}

export async function registerUser(payload) {
  const response = await clientApi.post("/auth/register", payload);
  return response.data;
}

export async function fetchMyOrders(token) {
  const response = await clientApi.get("/orders/my-orders", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function fetchSettings() {
  const response = await clientApi.get("/settings");
  return settingsSchema.parse(response.data.data);
}

export async function fetchHeroSlides() {
  const response = await clientApi.get("/hero");
  return response.data.data;
}

export async function submitContact(payload) {
  const response = await clientApi.post("/contact", payload);
  return response.data;
}

export async function fetchProductReviews(productId) {
  const response = await clientApi.get(`/reviews/product/${productId}`);
  return response.data.data;
}

export async function submitReview(payload) {
  const response = await clientApi.post("/reviews", payload);
  return response.data;
}

export async function validateCouponCode(code, totalAmount) {
  const response = await clientApi.post("/coupons/validate", { code, totalAmount });
  return response.data;
}

export async function updateProfile(payload, token) {
  const isFormData = payload instanceof FormData;
  const headers = {
    "Content-Type": isFormData ? "multipart/form-data" : "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await clientApi.put("/users/profile", payload, { headers });
  return response.data;
}

export async function fetchCategories() {
  const response = await clientApi.get("/categories");
  return z.array(categorySchema).parse(response.data.data);
}

export async function subscribeNewsletter(email) {
  const response = await clientApi.post("/newsletter/subscribe", { email });
  return response.data;
}
