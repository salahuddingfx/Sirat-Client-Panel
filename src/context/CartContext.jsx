import { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

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
  };

  const removeFromCart = (productId, variantId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.product.id === productId && item.variant.id === variantId))
    );
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
