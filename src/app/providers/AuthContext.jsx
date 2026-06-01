import { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login as loginAction, register as registerAction, logout as logoutAction } from "../store/authSlice";
import { loginUser, registerUser as apiRegisterUser } from "../../api/queries";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      if (response.success) {
        dispatch(loginAction(response.data));
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: "Login failed" };
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      const response = await apiRegisterUser({ name, email, phone, password });
      if (response.success) {
        // Automatically login after register if backend returns token
        if (response.data.token) {
          dispatch(registerAction(response.data));
        }
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: "Registration failed" };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
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
