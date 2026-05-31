import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
  try {
    const savedUser = localStorage.getItem("sirat_user");
    const savedToken = localStorage.getItem("sirat_token");
    
    if (savedToken && savedUser) {
      return {
        isLoggedIn: true,
        user: JSON.parse(savedUser),
        token: savedToken
      };
    }
  } catch (e) {
    console.error("Failed to load initial auth state from localStorage", e);
  }
  return {
    isLoggedIn: false,
    user: null,
    token: null
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    login: (state, action) => {
      const { user, token } = action.payload;
      state.isLoggedIn = true;
      state.user = user;
      state.token = token;
      
      try {
        localStorage.setItem("sirat_user", JSON.stringify(user));
        localStorage.setItem("sirat_token", token);
        localStorage.setItem("sirat_isLoggedIn", "true");
      } catch (e) {
        console.error("Failed to save auth state to localStorage", e);
      }
    },
    register: (state, action) => {
      const { user, token } = action.payload;
      state.isLoggedIn = true;
      state.user = user;
      state.token = token;
      
      try {
        localStorage.setItem("sirat_user", JSON.stringify(user));
        localStorage.setItem("sirat_token", token);
        localStorage.setItem("sirat_isLoggedIn", "true");
      } catch (e) {
        console.error("Failed to save auth state to localStorage", e);
      }
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      
      try {
        localStorage.removeItem("sirat_user");
        localStorage.removeItem("sirat_token");
        localStorage.removeItem("sirat_isLoggedIn");
      } catch (e) {
        console.error("Failed to clear auth state from localStorage", e);
      }
    }
  }
});

export const { login, register, logout } = authSlice.actions;
export default authSlice.reducer;
