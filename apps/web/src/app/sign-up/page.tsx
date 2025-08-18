"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function SignUpPage() {
  const { signUp, error, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      await signUp(email, password, name || undefined);
      router.push("/");
    } catch (e: any) {
      setFormError(e?.message || "Registration failed");
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Create your account</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="name">Name (optional)</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-0 focus:border-accent"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-0 focus:border-accent"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-0 focus:border-accent"
          />
        </div>
        {(formError || error) && (
          <p className="text-sm text-red-600">{formError || error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account? <Link href="/sign-in" className="underline">Sign in</Link>
      </p>
    </main>
  );
}
