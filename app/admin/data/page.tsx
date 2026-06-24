"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileSpreadsheet, CheckCircle2, Loader2, X } from "lucide-react";
import { api } from "@/lib/api";
import type { UploadResult } from "@/lib/api";

export default function DataPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<{
    file: File | null;
    uploading: boolean;
    error: string | null;
    result: UploadResult | null;
    dragOver: boolean;
  }>({ file: null, uploading: false, error: null, result: null, dragOver: false });

  const { file, uploading, error, result, dragOver } = state;

  const pickFile = (f: File | null) => {
    if (f && !f.name.toLowerCase().endsWith(".csv")) {
      setState((s) => ({ ...s, error: "CSV 파일만 업로드할 수 있어요.", file: null }));
      return;
    }
    setState((s) => ({ ...s, file: f, error: null, result: null }));
  };

  const upload = async () => {
    if (!file) return;
    setState((s) => ({ ...s, uploading: true, error: null }));
    try {
      const res = await api.uploadCsv(file);
      setState((s) => ({ ...s, uploading: false, result: res }));
    } catch (e) {
      setState((s) => ({ ...s, uploading: false, error: (e as Error).message }));
    }
  };

  const reset = () =>
    setState({ file: null, uploading: false, error: null, result: null, dragOver: false });

  const columns = result?.preview.length ? Object.keys(result.preview[0]) : [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">데이터</h1>
        <p className="text-sm text-foreground-muted mt-0.5">CSV 업로드·데이터셋 관리</p>
      </div>

      {/* 드롭존 */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setState((s) => ({ ...s, dragOver: true }));
        }}
        onDragLeave={() => setState((s) => ({ ...s, dragOver: false }))}
        onDrop={(e) => {
          e.preventDefault();
          setState((s) => ({ ...s, dragOver: false }));
          pickFile(e.dataTransfer.files?.[0] ?? null);
        }}
        className={`rounded-2xl border-2 border-dashed bg-surface p-8 sm:p-12 text-center transition-colors ${
          dragOver ? "border-brand bg-brand/5" : "border-border"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
        />

        <span className="grid place-items-center w-12 h-12 mx-auto rounded-2xl bg-brand/10 text-brand mb-3">
          <UploadCloud size={22} />
        </span>

        {file ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-background border border-border px-3 py-1.5 text-sm">
            <FileSpreadsheet size={15} className="text-brand" />
            <span className="font-medium text-foreground truncate max-w-[180px]">{file.name}</span>
            <button
              type="button"
              onClick={reset}
              aria-label="선택 해제"
              className="text-foreground-muted hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-foreground">CSV 파일을 끌어다 놓거나 선택하세요</p>
            <p className="text-xs text-foreground-muted mt-1">타이타닉 승객 데이터 (.csv)</p>
          </>
        )}

        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-sm font-medium text-foreground border border-border px-4 py-2 rounded-full hover:bg-black/5 transition-colors"
          >
            파일 선택
          </button>
          <button
            type="button"
            onClick={upload}
            disabled={!file || uploading}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-brand px-4 py-2 rounded-full hover:bg-brand-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploading && <Loader2 size={15} className="animate-spin" />}
            {uploading ? "업로드 중..." : "업로드"}
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-brand">
          {error}
        </p>
      )}

      {/* 결과 */}
      {result && (
        <section className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <CheckCircle2 size={18} className="text-brand" />
            <h2 className="text-sm font-semibold text-foreground">업로드 완료</h2>
            <span className="ml-auto text-sm font-bold text-brand tabular-nums">
              {result.count.toLocaleString()}건
            </span>
          </div>

          {columns.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {columns.map((c) => (
                      <th
                        key={c}
                        className="text-left font-medium text-foreground-muted px-4 py-2.5 whitespace-nowrap"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.preview.map((row, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      {columns.map((c) => (
                        <td key={c} className="px-4 py-2.5 text-foreground whitespace-nowrap">
                          {String(row[c] ?? "-")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-foreground-muted">
              미리보기할 데이터가 없어요
            </p>
          )}

          <div className="px-5 py-3 border-t border-border">
            <p className="text-xs text-foreground-muted">
              미리보기는 상위 {result.preview.length}행입니다.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
