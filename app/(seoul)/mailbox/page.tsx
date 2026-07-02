"use client";

import { useState, useEffect, useCallback } from "react";
import { Inbox, RefreshCw, Mail } from "lucide-react";
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
    <div className="flex-1 flex justify-center items-start px-4 md:px-6 py-8 md:py-12">
      <div className="w-full max-w-3xl flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2.5">
            <Inbox size={26} strokeWidth={2} className="text-brand" />
            받은 메일함
          </h1>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border bg-surface/60 text-sm text-foreground hover:bg-surface hover:border-foreground-muted/40 transition-colors"
          >
            <RefreshCw size={15} strokeWidth={1.75} className="text-brand" />
            새로고침
          </button>
        </div>

        <p className="text-sm text-foreground-muted mb-6">
          {loading ? "불러오는 중…" : `총 ${mails.length}건`}
        </p>

        {loading ? (
          <div className="py-20 text-center text-sm text-foreground-muted">불러오는 중…</div>
        ) : mails.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
              <Inbox size={26} strokeWidth={1.75} className="text-foreground-muted" />
            </div>
            <p className="text-base font-medium mb-1">받은 메일이 없어요</p>
            <p className="text-sm text-foreground-muted">Gmail로 메일이 오면 여기에 표시돼요.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {mails.map((m) => (
              <li
                key={m.id}
                className="bg-surface border border-border rounded-xl p-4 hover:border-brand/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="text-base font-semibold truncate">
                    {m.subject || "(제목 없음)"}
                  </h3>
                  <span className="text-xs text-foreground-muted whitespace-nowrap shrink-0">
                    {formatTime(m.received_at)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-foreground-muted mb-2">
                  <Mail size={12} strokeWidth={1.75} />
                  <span className="truncate">{m.sender || "-"}</span>
                </div>
                <p className="text-sm text-foreground/80 leading-snug line-clamp-2">
                  {m.preview || ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
