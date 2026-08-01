import { useEffect, useState } from "react";
import { api, authToken } from "@/lib/api";

const USER_KEY = "admin_user";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer";
}

const getStoredUser = (): AdminUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const storeSession = (token: string, user: AdminUser) => {
  authToken.set(token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("admin-auth-change"));
};

export const adminAuth = {
  async signIn(email: string, password: string) {
    const res = await api.post<{ token: string; user: AdminUser }>("/auth/login", { email, password });
    storeSession(res.token, res.user);
    return res.user;
  },
  async signUp(email: string, password: string) {
    const res = await api.post<{ token: string; user: AdminUser }>("/auth/signup", { email, password, role: "admin" });
    storeSession(res.token, res.user);
    return res.user;
  },
  signOut() {
    authToken.clear();
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("admin-auth-change"));
  },
  current(): AdminUser | null {
    if (!authToken.get()) return null;
    return getStoredUser();
  },
};

export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(adminAuth.current());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = () => setUser(adminAuth.current());
    window.addEventListener("admin-auth-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("admin-auth-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return { user, isAdmin: user?.role === "admin", loading };
};
