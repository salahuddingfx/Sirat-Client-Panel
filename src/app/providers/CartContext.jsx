import { createContext, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  applyPromoCode as applyPromoCodeAction,
  clearCart as clearCartAction,
  setCartDrawerOpen as setCartDrawerOpenAction,
  showToast as showToastAction,
  hideToast as hideToastAction,
  selectCartItems,
  selectPromoCode,
  selectPromoError,
  selectDiscountPercent,
  selectDiscountFixed,
  selectCartDrawerOpen,
  selectToast,
  selectCartSubtotal,
  selectDiscountAmount,
  selectCartTotal,
  selectCartCount
} from "../store/cartSlice";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const dispatch = useDispatch();
  const [toastTimeout, setToastTimeout] = useState(null);

  // Redux Selectors
  const cartItems = useSelector(selectCartItems);
  const promoCode = useSelector(selectPromoCode);
  const promoError = useSelector(selectPromoError);
  const discountPercent = useSelector(selectDiscountPercent);
  const discountFixed = useSelector(selectDiscountFixed);
  const cartDrawerOpen = useSelector(selectCartDrawerOpen);
  const toast = useSelector(selectToast);
  const cartSubtotal = useSelector(selectCartSubtotal);
  const discountAmount = useSelector(selectDiscountAmount);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);

  // Sound play and toast scheduling side effect
  const triggerToast = (message, type = "success") => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    
    // Play synthesized chimes using Web Audio API
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        if (type === "success") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.35);
        } else {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(392.00, ctx.currentTime); // G4
          osc.frequency.exponentialRampToValueAtTime(196.00, ctx.currentTime + 0.25); // G3
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.25);
        }
      }
    } catch (e) {
      console.warn("Sound play failed", e);
    }

    dispatch(showToastAction({ message, type }));
    const timeout = setTimeout(() => {
      dispatch(hideToastAction());
    }, 2500);
    setToastTimeout(timeout);
  };

  const addToCart = (product, variant, quantity = 1, openDrawer = true) => {
    dispatch(addToCartAction({ product, variant, quantity, openDrawer }));
    triggerToast(`"${product.name}" (Size: ${variant.label}) ব্যাগ-এ যোগ করা হয়েছে!`, "success");
  };

  const removeFromCart = (productId, variantId) => {
    const item = cartItems.find((i) => i.product.id === productId && i.variant.id === variantId);
    dispatch(removeFromCartAction({ productId, variantId }));
    if (item) {
      triggerToast(`"${item.product.name}" ব্যাগ থেকে সরানো হয়েছে!`, "info");
    }
  };

  const updateQuantity = (productId, variantId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId, variantId);
      return;
    }
    dispatch(updateQuantityAction({ productId, variantId, quantity }));
  };

  const applyPromoCode = (payload) => {
    dispatch(applyPromoCodeAction(payload));
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  const setCartDrawerOpen = (isOpen) => {
    dispatch(setCartDrawerOpenAction(isOpen));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        promoCode,
        promoError,
        discountPercent,
        discountAmount,
        cartSubtotal,
        cartTotal,
        cartCount,
        cartDrawerOpen,
        setCartDrawerOpen,
        toast,
        triggerToast,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyPromoCode,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
