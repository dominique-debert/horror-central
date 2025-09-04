"use client";

import { useTheme } from "@/context/theme-context";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="
        relative inline-flex h-8 w-20 items-center rounded-full overflow-hidden
        border border-border bg-toggle-track shadow-inner
        transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
      "
    >
      {/* Knob (render first) */}
      <span
        aria-hidden
        className="
          pointer-events-none absolute top-1.5 h-5 w-5 rounded-full z-0
          bg-toggle-knob shadow
          transition-all duration-300 ease-out
          left-1.5 dark:left-auto dark:right-1.5
        "
      />

      {/* Icons (render after knob to ensure on top) */}
      <Sun
        aria-hidden
        size={18}
        strokeWidth={2}
        className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 z-20
                   text-toggle-icon transition-opacity duration-200 dark:opacity-0"
      />
      <Moon
        aria-hidden
        size={18}
        strokeWidth={2}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 z-20
                   text-toggle-icon opacity-0 transition-opacity duration-200 dark:opacity-100"
      />
    </button>
  );
}