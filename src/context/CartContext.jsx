import { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [toastTimeout, setToastTimeout] = useState(null);

  const triggerToast = (message, type = "success") => {
    // Clear any previous timeout
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

    setToast({ show: true, message, type });
    const timeout = setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 2500);
    setToastTimeout(timeout);
  };

  const addToCart = (product, variant, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.variant.id === variant.id
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      }

      return [...prevItems, { product, variant, quantity }];
    });
    // Auto-open drawer when item is added
    setCartDrawerOpen(true);
    triggerToast(`🛍️ "${product.name}" (Size: ${variant.label}) ব্যাগ-এ যোগ করা হয়েছে!`, "success");
  };

  const removeFromCart = (productId, variantId) => {
    const item = cartItems.find((i) => i.product.id === productId && i.variant.id === variantId);
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.product.id === productId && item.variant.id === variantId))
    );
    if (item) {
      triggerToast(`🗑️ "${item.product.name}" ব্যাগ থেকে সরানো হয়েছে!`, "info");
    }
  };

  const updateQuantity = (productId, variantId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId, variantId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId && item.variant.id === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "SIRAT10") {
      setPromoCode(cleanCode);
      setDiscountPercent(10);
      setPromoError("");
      return true;
    } else if (cleanCode === "LAUNCH15") {
      setPromoCode(cleanCode);
      setDiscountPercent(15);
      setPromoError("");
      return true;
    } else if (cleanCode === "") {
      setPromoCode("");
      setDiscountPercent(0);
      setPromoError("");
      return true;
    } else {
      setPromoError("Invalid code. Try SIRAT10 or LAUNCH15.");
      return false;
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setPromoCode("");
    setDiscountPercent(0);
    setPromoError("");
  };

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.product.price + item.variant.priceDelta) * item.quantity, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    return (cartSubtotal * discountPercent) / 100;
  }, [cartSubtotal, discountPercent]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount);
  }, [cartSubtotal, discountAmount]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

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
