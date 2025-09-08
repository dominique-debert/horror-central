"use client";

import React from "react";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import { QueryClientProvider } from "@/providers/QueryClientProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
