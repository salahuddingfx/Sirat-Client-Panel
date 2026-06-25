import { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login as loginAction, register as registerAction, logout as logoutAction, updateUser } from "../store/authSlice";
import { setCartItems } from "../store/cartSlice";
import { loginUser, registerUser as apiRegisterUser, updateProfile as apiUpdateProfile, fetchServerCart, saveServerCart } from "../../api/queries";
import track from "@lib/tracker";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const cartItems = useSelector((state) => state.cart.cartItems);

  // On login: load server cart
  useEffect(() => {
    if (isLoggedIn && token) {
      fetchServerCart(token).then(res => {
        if (res.success && res.data?.items?.length > 0) {
          const localCartRaw = localStorage.getItem("sirat_cart");
          let localItems = [];
          if (localCartRaw) {
            try { const parsed = JSON.parse(localCartRaw); localItems = parsed.cartItems || []; } catch {}
          }
          // Merge: prefer server cart if user has no local items, otherwise keep local
          if (localItems.length === 0) {
            dispatch(setCartItems(res.data.items));
          } else {
            saveServerCart(localItems, token).catch(() => {});
          }
        } else if (res.success) {
          const localCartRaw = localStorage.getItem("sirat_cart");
          if (localCartRaw) {
            try {
              const parsed = JSON.parse(localCartRaw);
              if (parsed.cartItems?.length > 0) {
                saveServerCart(parsed.cartItems, token).catch(() => {});
              }
            } catch {}
          }
        }
      }).catch(() => {});
    }
  }, [isLoggedIn, token, dispatch]);

  // On cart change + logged in: sync to server (debounced)
  useEffect(() => {
    if (!isLoggedIn || !token) return;
    const timer = setTimeout(() => {
      saveServerCart(cartItems, token).catch(() => {});
    }, 2000);
    return () => clearTimeout(timer);
  }, [cartItems, isLoggedIn, token]);

  useEffect(() => {
    if (isLoggedIn && user) {
      track.identify({ id: user._id || user.id, email: user.email });
    } else {
      track.identify(null);
    }
  }, [isLoggedIn, user]);

  const login = async (identifier, password) => {
    try {
      const response = await loginUser({ email: identifier, password });
      if (response.success) {
        dispatch(loginAction(response.data));
        track.event("login", { label: identifier });
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiRegisterUser(userData);
      if (response.success) {
        if (response.data.token) {
          dispatch(registerAction(response.data));
        }
        track.event("signup", { label: userData?.email || "" });
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Registration failed" };
    }
  };

  const updateProfile = async (payload) => {
    try {
      const response = await apiUpdateProfile(payload, token);
      if (response.success) {
        dispatch(updateUser(response.data));
        return { success: true, user: response.data };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Update failed" };
    }
  };

  const logout = () => {
    track.event("logout");
    dispatch(logoutAction());
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
