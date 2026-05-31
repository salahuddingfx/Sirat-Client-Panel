import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
  try {
    const savedUser = localStorage.getItem("sirat_user");
    const savedLoggedIn = localStorage.getItem("sirat_isLoggedIn");
    
    if (savedLoggedIn === "true" && savedUser) {
      return {
        isLoggedIn: true,
        user: JSON.parse(savedUser),
      };
    }
  } catch (e) {
    console.error("Failed to load initial auth state from localStorage", e);
  }
  return {
    isLoggedIn: false,
    user: null,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    login: (state, action) => {
      const { email } = action.payload;
      const namePrefix = email.split("@")[0];
      const formattedName = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1) + " Ahmed";
      const loggedUser = {
        name: formattedName,
        email: email,
        phone: "+880 1711-223344"
      };
      
      state.isLoggedIn = true;
      state.user = loggedUser;
      
      try {
        localStorage.setItem("sirat_user", JSON.stringify(loggedUser));
        localStorage.setItem("sirat_isLoggedIn", "true");
      } catch (e) {
        console.error("Failed to save auth state to localStorage", e);
      }
    },
    register: (state, action) => {
      const { name, email, phone } = action.payload;
      const loggedUser = {
        name,
        email,
        phone
      };
      
      state.isLoggedIn = true;
      state.user = loggedUser;
      
      try {
        localStorage.setItem("sirat_user", JSON.stringify(loggedUser));
        localStorage.setItem("sirat_isLoggedIn", "true");
      } catch (e) {
        console.error("Failed to save auth state to localStorage", e);
      }
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      
      try {
        localStorage.removeItem("sirat_user");
        localStorage.removeItem("sirat_isLoggedIn");
      } catch (e) {
        console.error("Failed to clear auth state from localStorage", e);
      }
    }
  }
});

export const { login, register, logout } = authSlice.actions;
export default authSlice.reducer;
