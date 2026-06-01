import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@app/store/store";
import { AuthProvider } from "@app/providers/AuthContext";
import { CartProvider } from "@app/providers/CartContext";
import { SettingsProvider } from "@app/providers/settings";
import { ErrorBoundary } from "@app/ErrorBoundary";
import "@styles/global.css";
import { App } from "@app/App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <AuthProvider>
            <SettingsProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </SettingsProvider>
          </AuthProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
