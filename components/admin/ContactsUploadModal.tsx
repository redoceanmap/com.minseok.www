"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileSpreadsheet, X, Info } from "lucide-react";

type Props = { open: boolean; onClose: () => void };

export default function ContactsUploadModal({ open, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<{
    file: File | null;
    error: string | null;
    info: string | null;
    dragOver: boolean;
  }>({ file: null, error: null, info: null, dragOver: false });

  const { file, error, info, dragOver } = state;

  if (!open) return null;

  const pickFile = (f: File | null) => {
    if (f && !f.name.toLowerCase().endsWith(".csv")) {
      setState((s) => ({ ...s, error: "CSV 파일만 업로드할 수 있어요.", file: null }));
      return;
    }
    setState((s) => ({ ...s, file: f, error: null, info: null }));
  };

  const reset = () =>
    setState({ file: null, error: null, info: null, dragOver: false });

  const handleClose = () => {
    reset();
    onClose();
  };

  const upload = () => {
    if (!file) return;
    // 주소록 업로드 API(백엔드)는 다음 단계에서 연결합니다. 현재는 프론트 UI만.
    setState((s) => ({
      ...s,
      info: "파일이 선택됐어요. 주소록 저장은 백엔드 연동 후 동작합니다.",
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm grid place-items-center px-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-surface rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="닫기"
          className="absolute top-4 right-4 w-8 h-8 grid place-items-center rounded-full text-foreground-muted hover:bg-black/5"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold tracking-tight text-foreground mb-1">
          주소록 등록
        </h2>
        <p className="text-sm text-foreground-muted mb-5">
          CSV 파일을 올려 주소록을 추가합니다.
        </p>

        {/* 드롭존 (타이타닉 데이터 업로드와 동일) */}
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
          className={`rounded-2xl border-2 border-dashed bg-background p-8 text-center transition-colors ${
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
            <div className="inline-flex items-center gap-2 rounded-full bg-surface border border-border px-3 py-1.5 text-sm">
              <FileSpreadsheet size={15} className="text-brand" />
              <span className="font-medium text-foreground truncate max-w-[180px]">
                {file.name}
              </span>
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
              <p className="text-sm font-medium text-foreground">
                CSV 파일을 끌어다 놓거나 선택하세요
              </p>
              <p className="text-xs text-foreground-muted mt-1">주소록 (.csv)</p>
            </>
          )}
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-border bg-background px-4 py-3 text-sm text-brand">
            {error}
          </p>
        )}
        {info && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground-muted">
            <Info size={15} className="mt-0.5 shrink-0" />
            {info}
          </p>
        )}

        <div className="mt-5 flex items-center justify-end gap-2">
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
            disabled={!file}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-brand px-4 py-2 rounded-full hover:bg-brand-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            업로드
          </button>
        </div>
      </div>
    </div>
  );
}
