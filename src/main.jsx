import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@app/store/store";
import { AuthProvider } from "@app/providers/AuthContext";
import { CartProvider } from "@app/providers/CartContext";
import "@styles/global.css";
import { App } from "@app/App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
