"use client";

import { useState, useEffect } from "react";
import { X, Mail, Send } from "lucide-react";
import { useUIStore } from "@/lib/uiStore";
import { api } from "@/lib/api";

export default function AutomationModal() {
  const open = useUIStore((s) => s.automationOpen);
  const close = useUIStore((s) => s.closeAutomation);

  const [state, setState] = useState({
    loading: false,
    error: null as string | null,
    success: null as string | null,
  });
  const { loading, error, success } = state;

  useEffect(() => {
    if (open) setState({ loading: false, error: null, success: null });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { to, topic } = Object.fromEntries(new FormData(e.currentTarget)) as {
      to: string;
      topic: string;
    };
    setState({ loading: true, error: null, success: null });
    try {
      await api.dispatchEmail(to, topic);
      setState({ loading: false, error: null, success: `${to} 로 메일을 발송했어요.` });
    } catch (err) {
      setState({
        loading: false,
        error: err instanceof Error ? err.message : "발송에 실패했어요",
        success: null,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm grid place-items-center px-4"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md bg-surface rounded-2xl shadow-xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="닫기"
          className="absolute top-4 right-4 w-8 h-8 grid place-items-center rounded-full text-foreground-muted hover:bg-black/5"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-11 h-11 rounded-full bg-brand/10 grid place-items-center">
            <Mail size={20} strokeWidth={1.75} className="text-brand" />
          </div>
          <h2 className="mt-3 text-lg font-semibold tracking-tight">
            이메일 자동 작성·발송
          </h2>
          <p className="mt-1 text-sm text-foreground-muted text-center">
            주제를 입력하면 AI가 이메일을 작성해 보냅니다.
          </p>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="email"
            name="to"
            placeholder="받는 사람 이메일"
            required
            className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-brand placeholder:text-foreground-muted"
          />
          <textarea
            name="topic"
            placeholder="이메일 주제 (예: 다음 주 팀 회의 일정 안내)"
            required
            rows={3}
            className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-brand placeholder:text-foreground-muted resize-none"
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 w-full bg-brand text-white py-3 rounded-xl font-medium hover:bg-brand-deep transition-colors disabled:opacity-50"
          >
            <Send size={16} strokeWidth={1.75} />
            {loading ? "작성·발송 중..." : "작성해서 보내기"}
          </button>
        </form>
      </div>
    </div>
  );
}
