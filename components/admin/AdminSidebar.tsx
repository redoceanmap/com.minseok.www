"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Ship,
  MessageSquare,
  Upload,
  Settings,
  Anchor,
  BookUser,
} from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "대시보드", href: "/admin" },
  { icon: Ship, label: "승객", href: "/admin/passengers" },
  { icon: Users, label: "사용자", href: "/admin/users" },
  { icon: MessageSquare, label: "채팅 로그", href: "/admin/chats" },
  { icon: Upload, label: "데이터", href: "/admin/data" },
] as const;

const MAIL_NAV = [
  { icon: BookUser, label: "주소록", href: "/admin/contacts" },
] as const;

/**
 * 모바일 퍼스트 네비게이션.
 * - 기본(모바일): 화면 하단 고정 탭바
 * - lg 이상: 좌측 고정 사이드 레일
 */
export default function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      {/* 데스크톱 좌측 레일 */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col border-r border-border bg-surface px-4 py-6 z-30">
        <Link href="/admin" className="flex items-center gap-2 px-2 mb-8">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-brand text-white">
            <Anchor size={16} strokeWidth={2} />
          </span>
          <span className="font-bold text-foreground tracking-tight">RAG Admin</span>
        </Link>

        <nav className="flex flex-col gap-1">
          {NAV.map(({ icon: Icon, label, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand text-white"
                    : "text-foreground-muted hover:bg-black/5 hover:text-foreground"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </Link>
            );
          })}

          <p className="px-3 pt-5 pb-1 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
            메일관리
          </p>
          {MAIL_NAV.map(({ icon: Icon, label, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand text-white"
                    : "text-foreground-muted hover:bg-black/5 hover:text-foreground"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/admin/settings"
          className="mt-auto flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground-muted hover:bg-black/5 hover:text-foreground transition-colors"
        >
          <Settings size={18} strokeWidth={1.8} />
          설정
        </Link>
      </aside>

      {/* 모바일 하단 탭바 */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch border-t border-border bg-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        {[...NAV, ...MAIL_NAV].map(({ icon: Icon, label, href }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                active ? "text-brand" : "text-foreground-muted"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
