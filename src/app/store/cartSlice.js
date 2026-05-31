import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  promoCode: "",
  promoError: "",
  discountPercent: 0,
  cartDrawerOpen: false,
  toast: { show: false, message: "", type: "success" }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, variant, quantity = 1, openDrawer = true } = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.product.id === product.id && item.variant.id === variant.id
      );

      if (existingItemIndex > -1) {
        state.cartItems[existingItemIndex].quantity += quantity;
      } else {
        state.cartItems.push({ product, variant, quantity });
      }

      if (openDrawer && typeof window !== "undefined" && window.innerWidth >= 768) {
        state.cartDrawerOpen = true;
      }
    },
    removeFromCart: (state, action) => {
      const { productId, variantId } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => !(item.product.id === productId && item.variant.id === variantId)
      );
    },
    updateQuantity: (state, action) => {
      const { productId, variantId, quantity } = action.payload;
      if (quantity < 1) {
        state.cartItems = state.cartItems.filter(
          (item) => !(item.product.id === productId && item.variant.id === variantId)
        );
      } else {
        const item = state.cartItems.find(
          (item) => item.product.id === productId && item.variant.id === variantId
        );
        if (item) {
          item.quantity = quantity;
        }
      }
    },
    applyPromoCode: (state, action) => {
      const code = action.payload.trim().toUpperCase();
      if (code === "SIRAT10") {
        state.promoCode = code;
        state.discountPercent = 10;
        state.promoError = "";
      } else if (code === "LAUNCH15") {
        state.promoCode = code;
        state.discountPercent = 15;
        state.promoError = "";
      } else if (code === "") {
        state.promoCode = "";
        state.discountPercent = 0;
        state.promoError = "";
      } else {
        state.promoError = "Invalid code. Try SIRAT10 or LAUNCH15.";
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.promoCode = "";
      state.discountPercent = 0;
      state.promoError = "";
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
    }
  }
});

// Selectors
export const selectCartItems = (state) => state.cart.cartItems;
export const selectPromoCode = (state) => state.cart.promoCode;
export const selectPromoError = (state) => state.cart.promoError;
export const selectDiscountPercent = (state) => state.cart.discountPercent;
export const selectCartDrawerOpen = (state) => state.cart.cartDrawerOpen;
export const selectToast = (state) => state.cart.toast;

export const selectCartSubtotal = (state) =>
  state.cart.cartItems.reduce(
    (sum, item) => sum + (item.product.price + item.variant.priceDelta) * item.quantity,
    0
  );

export const selectDiscountAmount = (state) => {
  const subtotal = selectCartSubtotal(state);
  return (subtotal * state.cart.discountPercent) / 100;
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
  hideToast
} = cartSlice.actions;

export default cartSlice.reducer;
