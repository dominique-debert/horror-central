"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiLogin, apiMe, type LoginResponse, type MeResponse } from "@/lib/api";

const TOKEN_KEY = "hc_token";

type User = LoginResponse["user"] & Partial<MeResponse["user"]>;

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (stored) setToken(stored);
    setLoading(false);
  }, []);

  // Fetch user when token changes
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { user } = await apiMe(token);
        if (!cancelled) setUser(user);
      } catch (e) {
        if (!cancelled) {
          setUser(null);
          setToken(null);
          if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await apiLogin(email, password);
      setUser(user);
      setToken(token);
      if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
    } catch (e: any) {
      setError(e?.message || "Login failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
  }, []);

  const refresh = useCallback(async () => {
    if (!token) return;
    const { user } = await apiMe(token);
    setUser(user);
  }, [token]);

  const value = useMemo<AuthContextValue>(() => ({ user, token, loading, error, signIn, signOut, refresh }), [user, token, loading, error, signIn, signOut, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
