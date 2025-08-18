"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const { signIn, error, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams?.get("next") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      await signIn(email, password);
      router.push(next);
    } catch (e: any) {
      setFormError(e?.message || "Invalid credentials");
    }
  }

  const signUpHref = `/sign-up${next && next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none ring-0 placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none ring-0 placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        {(formError || error) && (
          <p className="text-sm text-destructive">{formError || error}</p>
        )}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        Don&apos;t have an account? <Link href={signUpHref} className="underline">Register</Link>
      </p>
    </main>
  );
}
