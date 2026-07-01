"use client";

import { useState, useEffect, useCallback } from "react";
import PixelContactsUploadModal from "@/components/PixelContactsUploadModal";
import { api, type ContactItem } from "@/lib/api";

export default function ContactsPage() {
  const [state, setState] = useState<{
    uploadOpen: boolean;
    contacts: ContactItem[];
    loading: boolean;
  }>({ uploadOpen: false, contacts: [], loading: true });
  const { uploadOpen, contacts, loading } = state;

  const load = useCallback(async () => {
    try {
      const list = await api.listContacts();
      setState((p) => ({ ...p, contacts: list, loading: false }));
    } catch {
      setState((p) => ({ ...p, loading: false }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="relative min-h-[calc(100vh-4rem)] px-4 sm:px-6 pt-10 sm:pt-12 pb-24 starfield">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="pixel-text text-xl sm:text-2xl text-ink text-shadow-pixel">▼ 주소록</h1>
          <button
            type="button"
            onClick={() => setState((p) => ({ ...p, uploadOpen: true }))}
            className="pixel-text text-[10px] sm:text-xs text-hull bg-accent border-4 border-black px-4 py-2.5 shadow-pixel-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            ＋ 등록
          </button>
        </div>

        <div className="border-4 border-accent bg-hull shadow-pixel-lg">
          <div className="bg-accent px-3 py-2 border-b-4 border-black flex items-center justify-between">
            <span className="pixel-text text-[10px] text-hull">▼ CONTACTS</span>
            <span className="pixel-text text-[10px] text-hull">
              {loading ? "..." : `${contacts.length} 건`}
            </span>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center pixel-text text-[10px] text-accent">LOADING...</div>
          ) : contacts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="pixel-text text-2xl mb-3 text-accent">[ ∅ ]</div>
              <p className="pixel-text text-[10px] text-accent">등록된 주소록이 없어요</p>
              <p className="text-muted text-sm mt-3">상단 ‘등록’ 버튼으로 CSV를 올리세요.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-4 border-accent/40">
                    {["이름", "닉네임", "이메일", "전화"].map((h) => (
                      <th key={h} className="text-left pixel-text text-[9px] text-accent px-4 py-2.5 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id} className="border-b-2 border-accent/20 last:border-0">
                      <td className="px-4 py-2.5 text-ink whitespace-nowrap">{c.name || "-"}</td>
                      <td className="px-4 py-2.5 text-accent whitespace-nowrap">{c.nickname || "-"}</td>
                      <td className="px-4 py-2.5 text-ink whitespace-nowrap">{c.email}</td>
                      <td className="px-4 py-2.5 text-muted whitespace-nowrap">{c.phone || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <PixelContactsUploadModal
        open={uploadOpen}
        onClose={() => setState((p) => ({ ...p, uploadOpen: false }))}
        onUploaded={load}
      />
    </main>
  );
}
