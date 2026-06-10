"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function SmithPage() {
  const [state, setState] = useState({
    input: "",
    messages: [] as { role: "user" | "captain"; text: string }[],
    loading: false,
  });

  const handleSubmit = async () => {
    const msg = state.input.trim();
    if (!msg || state.loading) return;

    setState((s) => ({
      ...s,
      loading: true,
      input: "",
      messages: [...s.messages, { role: "user", text: msg }],
    }));

    try {
      const res = await api.chat(msg);
      setState((s) => ({
        ...s,
        loading: false,
        messages: [...s.messages, { role: "captain", text: res.reply ?? res.error ?? "..." }],
      }));
    } catch {
      setState((s) => ({
        ...s,
        loading: false,
        messages: [...s.messages, { role: "captain", text: "무선 통신이 끊겼습니다. 다시 시도해 주세요." }],
      }));
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 sm:px-8 pt-10 pb-20 starfield">
      <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="pixel-text text-xl sm:text-2xl text-accent">
            CAPT. SMITH
          </h1>
          <Link
            href="/titanic/passengers"
            className="pixel-text text-[10px] text-hull bg-accent px-3 py-1.5 border-2 border-black hover:opacity-80 transition"
          >
            ← 승객 명단
          </Link>
        </div>

        <div className="bg-hull border-4 border-accent shadow-pixel-lg mb-3 px-3 py-2">
          <p className="pixel-text text-[9px] text-accent/60">
            ▼ CAPTAIN&apos;S BRIDGE — EDWARD JOHN SMITH
          </p>
        </div>

        <div className="flex-1 overflow-y-auto border-4 border-accent/60 bg-hull px-4 py-4 flex flex-col gap-3 mb-4">
          {state.messages.length === 0 && (
            <p className="pixel-text text-[10px] text-accent/40 text-center mt-8">
              스미스 선장에게 무엇이든 물어보세요.
            </p>
          )}
          {state.messages.map((m, i) => (
            <div key={i} className={`flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}>
              <span className="pixel-text text-[8px] text-accent/50">
                {m.role === "user" ? "YOU" : "CAPT. SMITH"}
              </span>
              <div className={`max-w-[80%] px-3 py-2 border-2 border-black text-sm font-sans leading-relaxed ${
                m.role === "user" ? "bg-accent text-hull" : "bg-night-mid text-ink"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {state.loading && (
            <div className="flex flex-col items-start gap-1">
              <span className="pixel-text text-[8px] text-accent/50">CAPT. SMITH</span>
              <div className="px-3 py-2 border-2 border-black bg-night-mid">
                <span className="pixel-text text-[10px] text-accent animate-flicker">...</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-hull border-4 border-accent shadow-pixel-lg">
          <div className="bg-accent px-3 py-1 border-b-4 border-black">
            <span className="pixel-text text-[10px] text-hull">▼ WIRELESS</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="pixel-text text-xs text-accent">&gt;</span>
            <input
              type="text"
              value={state.input}
              onChange={(e) => setState((s) => ({ ...s, input: e.target.value }))}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(); } }}
              placeholder={state.loading ? "전송 중..." : "선장에게 메시지 전송..."}
              disabled={state.loading}
              className="flex-1 bg-transparent outline-none text-ink placeholder:text-muted text-sm font-sans disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={state.loading || !state.input.trim()}
              className="pixel-text text-[10px] text-hull bg-accent px-3 py-1.5 border-2 border-black hover:opacity-80 disabled:opacity-40 transition"
            >
              {state.loading ? "..." : "SEND"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
