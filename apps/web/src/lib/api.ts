"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type LoginResponse = {
  token: string;
  user: { id: string; email: string; name?: string | null };
};

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Login failed");
  }

  return res.json();
}

export async function apiRegister(email: string, password: string, name?: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Registration failed");
  }

  return res.json();
}

export type MeResponse = { user: { id: string; email: string; name?: string | null; role?: string | null } };

export async function apiMe(token: string): Promise<MeResponse> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Failed to fetch user");
  }

  return res.json();
}
