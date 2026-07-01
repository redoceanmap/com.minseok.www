"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function EmailPage() {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    result: { status: string; detail: string } | null;
  }>({ loading: false, error: null, result: null });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const to = String(formData.get("to") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    if (!to || !content) {
      setState({ loading: false, error: "수신자와 내용을 모두 입력해주세요", result: null });
      return;
    }

    setState({ loading: true, error: null, result: null });
    try {
      const result = await api.requestEmail(to, content);
      setState({ loading: false, error: null, result });
    } catch (e) {
      const message = e instanceof Error ? e.message : "서버 연결 실패";
      setState({ loading: false, error: message, result: null });
    }
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold">이메일 작성 요청</h1>
      <p className="mt-2 text-sm text-gray-500">
        프론트 → star_craft(허브) → 셜록홈즈가 EXAONE 2.4b로 작성·발송합니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">수신자 이메일</span>
          <input
            name="to"
            type="email"
            required
            placeholder="someone@example.com"
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">간단한 내용</span>
          <textarea
            name="content"
            required
            rows={4}
            placeholder="예) 다음 주 화요일 회의를 30분 미뤄도 될지 문의"
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={state.loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {state.loading ? "작성·발송 중…" : "전송"}
        </button>
      </form>

      {state.error && (
        <p className="mt-4 text-sm text-red-600">{state.error}</p>
      )}
      {state.result && (
        <div className="mt-4 rounded border border-green-300 bg-green-50 p-3 text-sm">
          <p className="font-medium text-green-700">상태: {state.result.status}</p>
          <p className="mt-1 whitespace-pre-wrap text-gray-700">{state.result.detail}</p>
        </div>
      )}
    </main>
  );
}
