import type { Metadata } from "next";
import { Search, Bell } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "RAG Admin — 관리자",
  description: "RAG Watson 관리자 대시보드",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      {/* 데스크톱 좌측 레일(w-60) 만큼 밀어준다 */}
      <div className="lg:pl-60">
        {/* 상단 바 — 모바일 퍼스트 */}
        <header className="sticky top-0 z-20 flex items-center gap-3 px-4 sm:px-6 h-14 border-b border-border bg-surface/90 backdrop-blur">
          <label className="flex-1 flex items-center gap-2 max-w-md h-9 px-3 rounded-full bg-background border border-border">
            <Search size={16} className="text-foreground-muted shrink-0" />
            <input
              type="search"
              placeholder="검색..."
              className="w-full bg-transparent outline-none text-sm placeholder:text-foreground-muted"
            />
          </label>
          <ThemeToggle className="grid place-items-center w-9 h-9 rounded-full border border-border text-foreground-muted hover:text-foreground transition-colors" />
          <button
            type="button"
            aria-label="알림"
            className="grid place-items-center w-9 h-9 rounded-full border border-border text-foreground-muted hover:text-foreground transition-colors"
          >
            <Bell size={16} />
          </button>
          <div className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-brand text-white text-sm font-semibold">
              A
            </span>
            <span className="hidden sm:block text-sm font-medium text-foreground">관리자</span>
          </div>
        </header>

        {/* 하단 탭바(모바일)에 가리지 않도록 pb 확보 */}
        <main className="px-4 sm:px-6 py-5 pb-24 lg:pb-8">{children}</main>
      </div>
    </div>
  );
}
