"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/sign-in?next=${next}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
