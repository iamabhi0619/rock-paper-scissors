import { toast } from "sonner";
import { create } from "zustand";
import api from "@/lib/api";

export const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  login: async (Credentials) => {
    const { email, password } = Credentials;

    if (!email) {
      toast.error("Please enter your email address");
      set({ error: "Please enter your email address" });
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      set({ error: "Please enter your password" });
      return;
    }

    try {
      set({ loading: true, error: null });
      const response = await api.post("/auth/login", Credentials);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      set({ user, isAuthenticated: true });
      toast.success(response.data.message || "Login successful!");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      set({
        error:
          error.response?.data?.message || "Login failed. Please try again.",
      });
      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      set({ loading: false });
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
    toast.success("Logout successful!");
  },
  register: async (userData) => {
    const { name, email, password } = userData;

    if (!name) {
      toast.error("Please enter your name");
      set({ error: "Please enter your name" });
      return;
    }
    if (!email) {
      toast.error("Please enter your email address");
      set({ error: "Please enter your email address" });
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      set({ error: "Please enter your password" });
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Weak password: must include 1 uppercase, 1 lowercase, 1 number, and 1 special character, with at least 8 characters.",
      );
      set({
        error:
          "Weak password: must include 1 uppercase, 1 lowercase, 1 number, and 1 special character, with at least 8 characters.",
      });
      return;
    }

    try {
      set({ loading: true, error: null });
      const response = await api.post("/auth/signup", userData);
      toast.success(response.data.message || "Registration successful!");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      set({ error: error.response?.data?.message || "Registration failed" });
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      set({ loading: false });
    }
  },
  fetchUser: async () => {
    if (!localStorage.getItem("token")) {
      set({ user: null, isAuthenticated: false });
      return;
    }
    try {
      set({ loading: true, error: null });
      if (!localStorage.getItem("token")) {
        set({ user: null, isAuthenticated: false });
        return;
      }
      const response = await api.get("/user/me");
      set({ user: response.data.user, isAuthenticated: true });
    } catch (error) {
      console.error("Fetch user error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        set({ user: null, isAuthenticated: false });
        return;
      }
      set({ error: error.response?.data?.message || "Failed to fetch user" });
    } finally {
      set({ loading: false });
    }
  },
  forgotPassword: async (email) => {
    if (!email) {
      toast.error("Please enter your email address");
      set({ error: "Please enter your email address" });
      return;
    }
    try {
      set({ loading: true, error: null });
      const response = await api.post("/auth/forgot-password", { email });
      toast.success(
        response.data.message || "Password reset link sent to your email!",
      );
    } catch (error) {
      console.error("Forgot password error:", error);
      set({
        error:
          error.response?.data?.message || "Failed to send password reset link",
      });
      toast.error(
        error.response?.data?.message ||
          "Failed to send password reset link. Please try again.",
      );
    } finally {
      set({ loading: false });
    }
  },
}));
