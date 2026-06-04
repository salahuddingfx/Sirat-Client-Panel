import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

// Expose Redux Toolkit / react-redux hooks for browser tooling
// (Redux DevTools extension, Wappalyzer, and other detectors).
// These are no-ops when the actual extension isn't installed.
if (typeof window !== "undefined") {
  window.__REDUX_DEVTOOLS_EXTENSION__ = window.__REDUX_DEVTOOLS_EXTENSION__ || (() => undefined);
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
    ((...fns) => fns.find((f) => typeof f === "function") || ((x) => x));
  window.__REDUX_STORE__ = store;
  window.__REDUX__ = { toolkit: true, reactRedux: true, version: 2 };
}
