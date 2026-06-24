"use client";

import Link from "next/link";
import { Plus, MessageSquare, MapPin, Bookmark, Anchor } from "lucide-react";
import Wordmark from "./Wordmark";
import ThemeToggle from "@/components/ThemeToggle";
import { useUIStore } from "@/lib/uiStore";

const navItems = [
  { icon: Plus, label: "새로 물어보기", href: "/" },
  { icon: MessageSquare, label: "지난 대화", href: "/" },
  { icon: MapPin, label: "지도", href: "/map" },
  { icon: Bookmark, label: "찜한 곳", href: "/" },
];

export default function TopNav() {
  const openAuth = useUIStore((s) => s.openAuth);

  return (
    <header className="h-14 flex items-center px-4 md:px-6 gap-4 md:gap-8">
      <Wordmark />

      <nav className="hidden md:flex items-center gap-1">
        {navItems.map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-foreground/80 hover:bg-black/5 hover:text-foreground transition-colors"
          >
            <Icon size={15} strokeWidth={1.75} className="text-brand" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/titanic"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 px-3 py-1.5 rounded-full border border-border hover:border-brand/40 hover:text-foreground transition-colors"
        >
          <Anchor size={14} strokeWidth={1.75} className="text-brand" />
          <span className="hidden sm:inline">Titanic</span>
        </Link>
        <button
          type="button"
          onClick={() => openAuth("login")}
          className="text-sm font-medium bg-brand text-white px-4 py-1.5 rounded-full hover:bg-brand-deep transition-colors"
        >
          로그인
        </button>
      </div>
    </header>
  );
}
