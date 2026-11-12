import { request } from "./httpClient";

// Maps to src/routes/authroutes.js on the API (mounted at /api/auth).
export const authService = {
  async login({ email, password }) {
    const res = await request("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    });
    return res.data; // { user, token }
  },

  async register({ name, email, password }) {
    const res = await request("/auth/register", {
      method: "POST",
      body: { name, email, password },
      auth: false,
    });
    return res.user;
  },
};
