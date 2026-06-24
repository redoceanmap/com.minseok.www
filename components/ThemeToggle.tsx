"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const DEFAULT_CLASS =
  "p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors";

export default function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // hydration 불일치 방지 — 마운트 전엔 동일 크기 자리만 차지
  if (!mounted) {
    return <span className="block w-9 h-9" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="테마 전환"
      className={className ?? DEFAULT_CLASS}
    >
      {isDark ? (
        <Sun size={16} strokeWidth={1.75} />
      ) : (
        <Moon size={16} strokeWidth={1.75} />
      )}
    </button>
  );
}
