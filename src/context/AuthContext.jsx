import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Load auth state on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("sirat_user");
    const savedLoggedIn = localStorage.getItem("sirat_isLoggedIn");
    
    if (savedLoggedIn === "true" && savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email, password) => {
    // Simulating user login
    const namePrefix = email.split("@")[0];
    const formattedName = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1) + " Ahmed";
    const loggedUser = {
      name: formattedName,
      email: email,
      phone: "+880 1711-223344"
    };
    
    setIsLoggedIn(true);
    setUser(loggedUser);
    localStorage.setItem("sirat_user", JSON.stringify(loggedUser));
    localStorage.setItem("sirat_isLoggedIn", "true");
    return true;
  };

  const register = (name, email, phone, password) => {
    // Simulating registration
    const loggedUser = {
      name: name,
      email: email,
      phone: phone
    };

    setIsLoggedIn(true);
    setUser(loggedUser);
    localStorage.setItem("sirat_user", JSON.stringify(loggedUser));
    localStorage.setItem("sirat_isLoggedIn", "true");
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("sirat_user");
    localStorage.removeItem("sirat_isLoggedIn");
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
