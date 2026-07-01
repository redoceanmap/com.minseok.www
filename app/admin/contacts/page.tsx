"use client";

import { useState } from "react";
import { Plus, BookUser } from "lucide-react";
import ContactsUploadModal from "@/components/admin/ContactsUploadModal";

export default function ContactsPage() {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            주소록
          </h1>
          <p className="text-sm text-foreground-muted mt-0.5">메일 수신자 주소록 관리</p>
        </div>
        <button
          type="button"
          onClick={() => setUploadOpen(true)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-brand px-4 py-2 rounded-full hover:bg-brand-deep transition-colors"
        >
          <Plus size={16} strokeWidth={2} />
          등록
        </button>
      </div>

      {/* 목록 (백엔드 연동 전: 빈 상태) */}
      <section className="rounded-2xl border border-border bg-surface">
        <div className="grid place-items-center gap-3 px-6 py-16 text-center">
          <span className="grid place-items-center w-12 h-12 rounded-2xl bg-brand/10 text-brand">
            <BookUser size={22} />
          </span>
          <p className="text-sm font-medium text-foreground">아직 등록된 주소록이 없어요</p>
          <p className="text-xs text-foreground-muted">
            상단 ‘등록’ 버튼으로 CSV 파일을 올려 주소록을 추가하세요.
          </p>
        </div>
      </section>

      <ContactsUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
