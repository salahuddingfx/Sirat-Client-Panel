import { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login as loginAction, register as registerAction, logout as logoutAction } from "../redux/authSlice";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  const login = (email, password) => {
    dispatch(loginAction({ email, password }));
    return true;
  };

  const register = (name, email, phone, password) => {
    dispatch(registerAction({ name, email, phone, password }));
    return true;
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
