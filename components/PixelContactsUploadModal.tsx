"use client";

import { useRef, useState, useEffect } from "react";
import { api } from "@/lib/api";

type Props = { open: boolean; onClose: () => void; onUploaded?: () => void };

export default function PixelContactsUploadModal({ open, onClose, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<{
    file: File | null;
    error: string | null;
    dragOver: boolean;
    loading: boolean;
    result: { saved: number } | null;
  }>({ file: null, error: null, dragOver: false, loading: false, result: null });

  const { file, error, dragOver, loading, result } = state;

  useEffect(() => {
    if (open) setState({ file: null, error: null, dragOver: false, loading: false, result: null });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleFiles = (files: FileList | null) => {
    setState((prev) => ({ ...prev, error: null }));
    if (!files || files.length === 0) return;
    const f = files[0];
    const isCsv = f.type === "text/csv" || f.name.toLowerCase().endsWith(".csv");
    if (!isCsv) {
      setState((prev) => ({ ...prev, error: "CSV 파일만 올릴 수 있어요" }));
      return;
    }
    setState((prev) => ({ ...prev, file: f }));
  };

  const handleUpload = async () => {
    if (!file) return;
    setState((prev) => ({ ...prev, loading: true, error: null, result: null }));
    try {
      const res = await api.uploadContacts(file);
      setState((prev) => ({ ...prev, loading: false, result: res }));
      onUploaded?.();
    } catch (e) {
      const message = e instanceof Error ? e.message : "서버 연결 실패";
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 grid place-items-center px-4" onClick={onClose}>
      <div
        className="relative w-full max-w-md bg-hull border-4 border-accent shadow-pixel-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-accent px-3 py-2 border-b-4 border-black flex items-center justify-between">
          <span className="pixel-text text-[10px] text-hull">▼ ADDRESS BOOK · CSV</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="pixel-text text-[10px] text-hull hover:text-hull/70"
          >
            [ X ]
          </button>
        </div>

        <div className="p-6 sm:p-8 flex flex-col items-center">
          <div
            onDrop={(e) => {
              e.preventDefault();
              setState((prev) => ({ ...prev, dragOver: false }));
              handleFiles(e.dataTransfer.files);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setState((prev) => ({ ...prev, dragOver: true }));
            }}
            onDragLeave={() => setState((prev) => ({ ...prev, dragOver: false }))}
            onClick={() => inputRef.current?.click()}
            className={`relative w-full border-4 cursor-pointer transition-all shadow-pixel-sm ${
              dragOver ? "border-glow bg-night-mid" : "border-accent bg-night-deep hover:bg-night-mid"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="px-5 py-8 text-center">
              {!file ? (
                <>
                  <div className="pixel-text text-2xl mb-3 text-accent">[ + ]</div>
                  <p className="pixel-text text-[10px] text-accent">DROP CSV HERE</p>
                  <p className="text-muted text-sm mt-2">클릭해서 파일을 골라도 돼요</p>
                </>
              ) : (
                <>
                  <div className="pixel-text text-2xl mb-3 text-glow">[ OK ]</div>
                  <p className="pixel-text text-[10px] text-accent break-all">{file.name}</p>
                  <p className="text-muted text-sm mt-2">{formatSize(file.size)}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setState((prev) => ({ ...prev, file: null }));
                      if (inputRef.current) inputRef.current.value = "";
                    }}
                    className="mt-3 px-4 py-2 pixel-text text-[10px] bg-glow text-hull border-4 border-black shadow-pixel-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    REMOVE
                  </button>
                </>
              )}
            </div>
          </div>

          {file && !result && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-6 px-8 py-3 pixel-text text-sm bg-accent text-hull border-4 border-black shadow-pixel-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "UPLOADING..." : "UPLOAD"}
            </button>
          )}

          {result && (
            <p className="mt-4 pixel-text text-[10px] text-glow border-4 border-glow px-4 py-2 shadow-pixel-sm">
              LOADED {result.saved} CONTACTS
            </p>
          )}

          {error && (
            <p className="mt-4 pixel-text text-[10px] text-hull bg-glow border-4 border-black px-4 py-2 shadow-pixel-sm">
              ! {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
