import { createContext, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import track from "@lib/tracker";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  applyPromoCode as applyPromoCodeAction,
  clearCart as clearCartAction,
  setCartDrawerOpen as setCartDrawerOpenAction,
  showToast as showToastAction,
  hideToast as hideToastAction,
  showConfirm as showConfirmAction,
  hideConfirm as hideConfirmAction,
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
  selectCartCount,
  selectConfirm
} from "../store/cartSlice";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const dispatch = useDispatch();
  const [toastTimeout, setToastTimeout] = useState(null);
  const [confirmCallback, setConfirmCallback] = useState(null);

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
  const confirm = useSelector(selectConfirm);

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
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); 
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); 
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.35);
        } else if (type === "error" || type === "warning") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(392.00, ctx.currentTime); 
          osc.frequency.exponentialRampToValueAtTime(196.00, ctx.currentTime + 0.25); 
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.25);
        } else {
            osc.type = "sine";
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.2);
        }
      }
    } catch (e) {
      console.warn("Sound play failed", e);
    }

    dispatch(showToastAction({ message, type }));
    const timeout = setTimeout(() => {
      dispatch(hideToastAction());
    }, 3500);
    setToastTimeout(timeout);
  };

  const triggerConfirm = (message, onConfirm) => {
    setConfirmCallback(() => onConfirm);
    dispatch(showConfirmAction({ message }));
  };

  const handleConfirm = () => {
    if (confirmCallback) confirmCallback();
    dispatch(hideConfirmAction());
    setConfirmCallback(null);
  };

  const handleCancel = () => {
    dispatch(hideConfirmAction());
    setConfirmCallback(null);
  };

  const addToCart = (product, variant, quantity = 1, openDrawer = true) => {
    dispatch(addToCartAction({ product, variant, quantity, openDrawer }));
    track.event("add_to_cart", {
      label: product?.name,
      value: (product?.discountedPrice ?? product?.price ?? 0) * quantity,
      currency: "BDT",
      metadata: {
        productId: product?.id || product?._id,
        slug: product?.slug,
        variant: variant?.label,
        quantity,
      },
    });
    triggerToast(`"${product.name}" (Size: ${variant.label}) ব্যাগ-এ যোগ করা হয়েছে!`, "success");
  };

  const removeFromCart = (productId, variantId) => {
    const item = cartItems.find((i) => (i.product.id === productId || i.product._id === productId) && i.variant.id === variantId);
    dispatch(removeFromCartAction({ productId, variantId }));
    if (item) {
      track.event("remove_from_cart", {
        label: item?.product?.name,
        metadata: { productId, variantId },
      });
      triggerToast(`"${item.product.name}" ব্যাগ থেকে সরানো হয়েছে!`, "info");
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
    track.event("apply_promo", { label: payload?.code || "" });
    dispatch(applyPromoCodeAction(payload));
  };

  const clearCart = () => {
    track.event("clear_cart");
    dispatch(clearCartAction());
    triggerToast("ব্যাগ পুরোপুরি খালি করা হয়েছে।", "info");
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
        confirm,
        triggerConfirm,
        handleConfirm,
        handleCancel,
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
