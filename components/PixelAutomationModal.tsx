"use client";

import { useState, useEffect } from "react";
import { useUIStore } from "@/lib/uiStore";
import { api, type ContactItem } from "@/lib/api";

export default function PixelAutomationModal() {
  const open = useUIStore((s) => s.automationOpen);
  const close = useUIStore((s) => s.closeAutomation);

  const [state, setState] = useState({
    loading: false,
    error: null as string | null,
    success: null as string | null,
    to: "",
    contacts: [] as ContactItem[],
    showSuggestions: false,
  });
  const { loading, error, success, to, contacts, showSuggestions } = state;

  useEffect(() => {
    if (!open) return;
    setState((s) => ({
      ...s,
      loading: false,
      error: null,
      success: null,
      to: "",
      showSuggestions: false,
    }));
    api
      .listContacts()
      .then((list) => setState((s) => ({ ...s, contacts: list })))
      .catch(() => {});
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

  const q = to.trim().toLowerCase();
  const suggestions = q
    ? contacts
        .filter(
          (c) =>
            c.nickname.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q),
        )
        .slice(0, 8)
    : [];

  const pick = (c: ContactItem) =>
    setState((s) => ({ ...s, to: c.email, showSuggestions: false }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const topic = (new FormData(e.currentTarget).get("topic") as string) ?? "";
    setState((s) => ({ ...s, loading: true, error: null, success: null, showSuggestions: false }));
    try {
      await api.dispatchEmail(to, topic);
      setState((s) => ({ ...s, loading: false, success: `${to} 로 메일을 발송했어요.` }));
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "발송에 실패했어요",
      }));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 grid place-items-center px-4"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md bg-hull border-4 border-accent shadow-pixel-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-accent px-3 py-2 border-b-4 border-black flex items-center justify-between">
          <span className="pixel-text text-[10px] text-hull">
            ▼ MARCONI · EMAIL DISPATCH
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="닫기"
            className="pixel-text text-[10px] text-hull hover:text-hull/70"
          >
            [ X ]
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center mb-6">
            <span className="pixel-text text-base sm:text-lg text-accent text-shadow-glow animate-flicker text-center">
              이메일 자동 작성·발송
            </span>
            <span className="pixel-text text-[8px] text-accent/70 mt-2 text-center">
              주제를 입력하면 AI가 이메일을 작성해 보냅니다.
            </span>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1.5">
              <span className="pixel-text text-[9px] text-accent">TO</span>
              <div className="relative">
                <input
                  type="email"
                  name="to"
                  value={to}
                  onChange={(e) =>
                    setState((s) => ({ ...s, to: e.target.value, showSuggestions: true }))
                  }
                  onFocus={() => setState((s) => ({ ...s, showSuggestions: true }))}
                  onBlur={() =>
                    setTimeout(
                      () => setState((s) => ({ ...s, showSuggestions: false })),
                      120,
                    )
                  }
                  autoComplete="off"
                  placeholder="받는 사람 이메일 (닉네임·이름으로 검색)"
                  required
                  className="w-full bg-night-deep border-4 border-accent px-3 py-2.5 text-ink text-sm font-sans outline-none focus:border-glow placeholder:text-muted"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-10 left-0 right-0 top-full mt-1 bg-night-deep border-4 border-accent shadow-pixel-lg max-h-52 overflow-auto">
                    {suggestions.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            pick(c);
                          }}
                          className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-night-mid border-b-2 border-accent/20 last:border-0"
                        >
                          <span className="pixel-text text-[9px] text-accent whitespace-nowrap">
                            {c.nickname || c.name}
                          </span>
                          <span className="text-muted text-xs truncate">{c.email}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="pixel-text text-[9px] text-accent">TOPIC</span>
              <textarea
                name="topic"
                placeholder="이메일 주제 (예: 다음 주 팀 회의 일정 안내)"
                required
                rows={3}
                className="bg-night-deep border-4 border-accent px-3 py-2.5 text-ink text-sm font-sans outline-none focus:border-glow placeholder:text-muted resize-none"
              />
            </label>

            {error && (
              <p className="pixel-text text-[9px] text-hull bg-glow border-4 border-black px-3 py-2">
                ! {error}
              </p>
            )}
            {success && (
              <p className="pixel-text text-[9px] text-glow bg-night-deep border-4 border-glow px-3 py-2">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 pixel-text text-xs text-hull bg-accent border-4 border-black px-4 py-3 shadow-pixel-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? "TRANSMITTING..." : "▶ 작성해서 보내기"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
