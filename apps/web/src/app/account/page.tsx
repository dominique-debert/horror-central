"use client";

import AuthGuard from "@/components/auth-guard";

export default function AccountPage() {
  return (
    <AuthGuard>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-4 text-2xl font-bold">My Account</h1>
        <p className="text-muted-foreground">This page is protected. You can only see it when signed in.</p>
      </main>
    </AuthGuard>
  );
}
