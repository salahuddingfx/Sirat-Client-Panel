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

clientApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      try {
        localStorage.removeItem("sirat_user");
        localStorage.removeItem("sirat_token");
        localStorage.removeItem("sirat_isLoggedIn");
      } catch (e) {
        console.error("Failed to clear localStorage on 401", e);
      }
    }
    return Promise.reject(error);
  }
);

// --- Product Queries ---

export async function fetchProducts() {
  try {
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
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return [];
  }
}

export async function fetchFeaturedProducts() {
  try {
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
  } catch (err) {
    console.error("Failed to fetch featured products:", err);
    return [];
  }
}

export async function fetchBestSellerProduct() {
  try {
    const response = await clientApi.get("/products/best-seller");
    return productSchema.parse(response.data.data);
  } catch (e) {
    console.error("Failed to parse best seller product:", e);
    return null;
  }
}

export async function fetchProductBySlug(slug) {
  try {
    const response = await clientApi.get(`/products/${slug}`);
    return productSchema.parse(response.data.data);
  } catch (e) {
    console.error("Failed to parse product by slug:", slug, e);
    return null;
  }
}

// --- Category Queries ---

export async function fetchCategories() {
  try {
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
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    return [];
  }
}

// --- Order Queries ---

export async function placeOrder(payload) {
  const response = await clientApi.post("/orders", payload);
  return response.data;
}

export async function trackOrder(payload) {
  return clientApi.post("/orders/track", trackOrderSchema.parse(payload));
}

export async function fetchMyOrders(token) {
  try {
    const response = await clientApi.get("/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch my orders:", err);
    return { success: false, message: err.response?.data?.message || "Failed to fetch orders." };
  }
}

// --- Auth Queries ---

export async function loginUser(credentials) {
  const response = await clientApi.post("/auth/login", credentials);
  return response.data;
}

export async function registerUser(payload) {
  const response = await clientApi.post("/auth/register", payload);
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

export async function changePassword(payload, token) {
  const response = await clientApi.put("/users/change-password", payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

// --- Review Queries ---

export async function fetchReviews() {
  try {
    const response = await clientApi.get("/reviews");
    const data = response.data.data;
    if (!Array.isArray(data)) return [];
    return data;
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    return [];
  }
}

export async function fetchProductReviews(productId) {
  try {
    const response = await clientApi.get(`/reviews/product/${productId}`);
    return response.data.data;
  } catch (err) {
    console.error("Failed to fetch product reviews:", err);
    return [];
  }
}

export async function submitReview(payload) {
  const response = await clientApi.post("/reviews", payload);
  return response.data;
}

// --- Misc Queries ---

export async function fetchSettings() {
  try {
    const response = await clientApi.get("/settings");
    return settingsSchema.parse(response.data.data);
  } catch (e) {
    console.error("Failed to parse settings:", e);
    return null;
  }
}

export async function fetchHeroSlides() {
  try {
    const response = await clientApi.get("/hero");
    return response.data.data;
  } catch (err) {
    console.error("Failed to fetch hero slides:", err);
    return [];
  }
}

export async function submitContact(payload) {
  const response = await clientApi.post("/contact", payload);
  return response.data;
}

export async function validateCouponCode(code, totalAmount) {
  const response = await clientApi.post("/coupons/validate", { code, totalAmount });
  return response.data;
}

export async function forgotPassword(email) {
  const response = await clientApi.post("/password/forgot", { email });
  return response.data;
}

export async function verifyResetOtp(email, otp) {
  const response = await clientApi.post("/password/verify-otp", { email, otp });
  return response.data;
}

export async function resetPassword(email, otp, newPassword) {
  const response = await clientApi.post("/password/reset", { email, otp, newPassword });
  return response.data;
}

export async function fetchServerCart(token) {
  const response = await clientApi.get("/cart", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function saveServerCart(items, token) {
  const response = await clientApi.put("/cart", { items }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function clearServerCart(token) {
  const response = await clientApi.delete("/cart", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function fetchWishlist(token) {
  const response = await clientApi.get("/wishlist", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function addToWishlistApi(productId, token) {
  const response = await clientApi.post("/wishlist", { productId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function removeFromWishlistApi(productId, token) {
  const response = await clientApi.delete(`/wishlist/${productId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function fetchTeamMembers() {
  try {
    const response = await clientApi.get("/team");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch team members:", err);
    return { success: false, data: [] };
  }
}

export async function checkWishlistApi(productId, token) {
  const response = await clientApi.get(`/wishlist/check/${productId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function subscribeNewsletter(email) {
  const response = await clientApi.post("/newsletter/subscribe", { email });
  return response.data;
}

export async function fetchActiveFlashSale() {
  try {
    const response = await clientApi.get("/flash-sale/active");
    const data = response.data;
    if (data && data.success && data.data && Array.isArray(data.data.products)) {
      data.data.products = data.data.products.map(item => {
        try {
          return productSchema.parse(item);
        } catch (e) {
          console.warn("Skipping invalid flash sale product:", item?.id, e);
          return null;
        }
      }).filter(Boolean);
    }
    return data;
  } catch (err) {
    console.error("Failed to fetch active flash sale:", err);
    return { success: false, data: null };
  }
}
