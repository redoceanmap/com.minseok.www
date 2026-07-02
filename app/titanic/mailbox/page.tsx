"use client";

import { useState, useEffect, useCallback } from "react";
import { api, type InboundMailItem } from "@/lib/api";

function formatTime(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MailboxPage() {
  const [state, setState] = useState<{
    mails: InboundMailItem[];
    loading: boolean;
  }>({ mails: [], loading: true });
  const { mails, loading } = state;

  const load = useCallback(async () => {
    setState((p) => ({ ...p, loading: true }));
    try {
      const list = await api.listInboundMails();
      setState({ mails: list, loading: false });
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
          <h1 className="pixel-text text-xl sm:text-2xl text-ink text-shadow-pixel">▼ 받은 메일함</h1>
          <button
            type="button"
            onClick={load}
            className="pixel-text text-[10px] sm:text-xs text-hull bg-accent border-4 border-black px-4 py-2.5 shadow-pixel-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            ↻ 새로고침
          </button>
        </div>

        <div className="border-4 border-accent bg-hull shadow-pixel-lg">
          <div className="bg-accent px-3 py-2 border-b-4 border-black flex items-center justify-between">
            <span className="pixel-text text-[10px] text-hull">▼ MAILBOX</span>
            <span className="pixel-text text-[10px] text-hull">
              {loading ? "..." : `${mails.length} 건`}
            </span>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center pixel-text text-[10px] text-accent">LOADING...</div>
          ) : mails.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="pixel-text text-2xl mb-3 text-accent">[ ∅ ]</div>
              <p className="pixel-text text-[10px] text-accent">받은 메일이 없어요</p>
              <p className="text-muted text-sm mt-3">Gmail로 메일이 오면 여기에 표시돼요.</p>
            </div>
          ) : (
            <ul>
              {mails.map((m) => (
                <li key={m.id} className="border-b-2 border-accent/20 last:border-0 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-ink font-bold truncate">{m.subject || "(제목 없음)"}</span>
                    <span className="pixel-text text-[9px] text-accent whitespace-nowrap">
                      {formatTime(m.received_at)}
                    </span>
                  </div>
                  <div className="text-accent text-xs mt-1 truncate">{m.sender || "-"}</div>
                  <p className="text-muted text-sm mt-1 line-clamp-2">{m.preview || ""}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
