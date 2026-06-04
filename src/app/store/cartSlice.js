import { createSlice } from "@reduxjs/toolkit";

const CART_KEY = "sirat_cart";

const loadCart = () => {
  try {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};

const saveCart = (state) => {
  try {
    const { cartDrawerOpen, toast, confirm, ...persistable } = state;
    localStorage.setItem(CART_KEY, JSON.stringify(persistable));
  } catch {}
};

const saved = loadCart();

const initialState = saved || {
  cartItems: [],
  promoCode: "",
  promoError: "",
  discountPercent: 0,
  discountFixed: 0,
  cartDrawerOpen: false,
  toast: { show: false, message: "", type: "success" },
  confirm: { show: false, message: "", onConfirm: null }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, variant, quantity = 1, openDrawer = true } = action.payload;
      const pId = product.id || product._id;
      const existingItemIndex = state.cartItems.findIndex(
        (item) => (item.product.id === pId || item.product._id === pId) && item.variant.id === variant.id
      );

      if (existingItemIndex > -1) {
        state.cartItems[existingItemIndex].quantity += quantity;
      } else {
        state.cartItems.push({ product, variant, quantity });
      }

      if (openDrawer && typeof window !== "undefined" && window.innerWidth >= 768) {
        state.cartDrawerOpen = true;
      }
      saveCart(state);
    },
    removeFromCart: (state, action) => {
      const { productId, variantId } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => !((item.product.id === productId || item.product._id === productId) && item.variant.id === variantId)
      );
      saveCart(state);
    },
    updateQuantity: (state, action) => {
      const { productId, variantId, quantity } = action.payload;
      if (quantity < 1) {
        state.cartItems = state.cartItems.filter(
          (item) => !((item.product.id === productId || item.product._id === productId) && item.variant.id === variantId)
        );
      } else {
        const item = state.cartItems.find(
          (item) => (item.product.id === productId || item.product._id === productId) && item.variant.id === variantId
        );
        if (item) {
          item.quantity = quantity;
        }
      }
    },
    applyPromoCode: (state, action) => {
      // If object payload (from API)
      if (typeof action.payload === 'object' && action.payload !== null) {
          const { code, percent = 0, fixed = 0, error = "" } = action.payload;
          state.promoCode = code;
          state.discountPercent = percent;
          state.discountFixed = fixed;
          state.promoError = error;
          return;
      }

      // Legacy string handling (or manual clear)
      const code = (action.payload || "").trim().toUpperCase();
      if (code === "") {
        state.promoCode = "";
        state.discountPercent = 0;
        state.discountFixed = 0;
        state.promoError = "";
      } else {
        // Fallback for manual entry if needed, though usually handled by component + API
        state.promoError = "Please apply a valid code.";
      }
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      saveCart(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.promoCode = "";
      state.discountPercent = 0;
      state.discountFixed = 0;
      state.promoError = "";
      saveCart(state);
    },
    setCartDrawerOpen: (state, action) => {
      state.cartDrawerOpen = action.payload;
    },
    showToast: (state, action) => {
      const { message, type = "success" } = action.payload;
      state.toast = { show: true, message, type };
    },
    hideToast: (state) => {
      state.toast = { show: false, message: "", type: "success" };
    },
    showConfirm: (state, action) => {
      const { message, onConfirm } = action.payload;
      state.confirm = { show: true, message, onConfirm };
    },
    hideConfirm: (state) => {
      state.confirm = { show: false, message: "", onConfirm: null };
    }
  }
});

// Selectors
export const selectCartItems = (state) => state.cart.cartItems;
export const selectPromoCode = (state) => state.cart.promoCode;
export const selectPromoError = (state) => state.cart.promoError;
export const selectDiscountPercent = (state) => state.cart.discountPercent;
export const selectDiscountFixed = (state) => state.cart.discountFixed;
export const selectCartDrawerOpen = (state) => state.cart.cartDrawerOpen;
export const selectToast = (state) => state.cart.toast;
export const selectConfirm = (state) => state.cart.confirm;

export const selectCartSubtotal = (state) =>
  state.cart.cartItems.reduce(
    (sum, item) => sum + (item.product.price + item.variant.priceDelta) * item.quantity,
    0
  );

export const selectDiscountAmount = (state) => {
  const subtotal = selectCartSubtotal(state);
  const percentDiscount = (subtotal * state.cart.discountPercent) / 100;
  return percentDiscount + state.cart.discountFixed;
};

export const selectCartTotal = (state) => {
  const subtotal = selectCartSubtotal(state);
  const discount = selectDiscountAmount(state);
  return Math.max(0, subtotal - discount);
};

export const selectCartCount = (state) =>
  state.cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyPromoCode,
  clearCart,
  setCartDrawerOpen,
  showToast,
  hideToast,
  showConfirm,
  hideConfirm
} = cartSlice.actions;

export default cartSlice.reducer;
