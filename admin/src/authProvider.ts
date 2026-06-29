import { AuthProvider } from "react-admin";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Erreur de connexion");
    }
    const data = await res.json();
    localStorage.setItem("adminToken", data.token);
  },

  logout: () => {
    localStorage.removeItem("adminToken");
    return Promise.resolve();
  },

  checkAuth: () =>
    localStorage.getItem("adminToken")
      ? Promise.resolve()
      : Promise.reject(),

  checkError: (error) => {
    if (error?.status === 401 || error?.status === 403) {
      localStorage.removeItem("adminToken");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: () => Promise.resolve(),
};
