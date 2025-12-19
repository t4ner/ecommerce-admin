import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      // State
      accessToken: null,
      user: null,
      isAuthenticated: false,

      // Actions
      setAccessToken: (token) => {
        set({ accessToken: token });
        // localStorage'a da kaydet (store zaten persist ediyor ama manuel de ekleyelim)
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", token);
        }
      },

      setUser: (userData) => {
        set({ user: userData });
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
        }
      },

      login: (token, userData) => {
        set({
          accessToken: token,
          user: userData,
          isAuthenticated: true,
        });
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", token);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      },

      logout: () => {
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        }
      },

      clearAuth: () => {
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        }
      },
    }),
    {
      name: "auth-storage", // localStorage key
    }
  )
);

export default useAuthStore;
