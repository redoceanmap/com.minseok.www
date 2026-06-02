"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import PixelTitanic from "@/components/PixelTitanic";
import PixelIceberg from "@/components/PixelIceberg";
import { api } from "@/lib/api";

export default function TitanicPage() {
  const [state, setState] = useState<{
    file: File | null;
    error: string | null;
    dragOver: boolean;
    loading: boolean;
    result: { count: number } | null;
  }>({
    file: null,
    error: null,
    dragOver: false,
    loading: false,
    result: null,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    setState(prev => ({ ...prev, error: null }));
    if (!files || files.length === 0) return;
    const f = files[0];
    const isCsv =
      f.type === "text/csv" || f.name.toLowerCase().endsWith(".csv");
    if (!isCsv) {
      setState(prev => ({ ...prev, error: "CSV 파일만 올릴 수 있어요" }));
      return;
    }
    setState(prev => ({ ...prev, file: f }));
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setState(prev => ({ ...prev, dragOver: false }));
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setState(prev => ({ ...prev, dragOver: true }));
  };

  const onDragLeave = () => setState(prev => ({ ...prev, dragOver: false }));

  const handleUpload = async () => {
    if (!state.file) return;
    setState(prev => ({ ...prev, loading: true, error: null, result: null }));
    try {
      const result = await api.uploadCsv(state.file);
      setState(prev => ({ ...prev, loading: false, result }));
    } catch (e) {
      const message = e instanceof Error ? e.message : "서버 연결 실패";
      setState(prev => ({ ...prev, loading: false, error: message }));
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <main className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center px-4 sm:px-6 pt-10 sm:pt-12 pb-32 sm:pb-48 overflow-hidden starfield">
      {/* 별 */}
      <span className="absolute top-[8%] left-[10%] w-1 h-1 bg-star animate-twinkle" style={{ boxShadow: "0 0 6px #FFE873" }} />
      <span className="absolute top-[14%] right-[12%] w-1 h-1 bg-star animate-twinkle" style={{ animationDelay: "0.8s", boxShadow: "0 0 6px #FFE873" }} />
      <span className="absolute top-[22%] left-[40%] w-1 h-1 bg-star animate-twinkle" style={{ animationDelay: "1.5s", boxShadow: "0 0 6px #FFE873" }} />

      <h1 className="relative pixel-text text-2xl sm:text-4xl text-ink text-center text-shadow-pixel">
        TITANIC
      </h1>
      <h2 className="pixel-text text-xs sm:text-sm text-accent mt-3 animate-flicker">
        - SURVIVOR PREDICTION -
      </h2>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative w-full max-w-2xl mt-10 border-4 cursor-pointer transition-all shadow-pixel-lg ${
          state.dragOver ? "border-glow bg-night-mid" : "border-accent bg-hull hover:bg-night-mid"
        }`}
      >
        {/* 콘솔 헤더 */}
        <div className="bg-accent px-3 py-2 border-b-4 border-black flex items-center justify-between">
          <span className="pixel-text text-[10px] text-hull">▼ CARGO HOLD · CSV</span>
          <span className="pixel-text text-[10px] text-hull">[ DRAG / CLICK ]</span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="px-5 sm:px-8 py-10 sm:py-12 text-center">
          {!state.file ? (
            <>
              <div className="pixel-text text-2xl mb-4 text-accent">[ + ]</div>
              <p className="pixel-text text-xs text-accent">DROP CSV HERE</p>
              <p className="text-muted text-sm mt-3">
                클릭해서 파일을 골라도 돼요
              </p>
            </>
          ) : (
            <>
              <div className="pixel-text text-2xl mb-4 text-glow">[ OK ]</div>
              <p className="pixel-text text-xs text-accent break-all">{state.file.name}</p>
              <p className="text-muted text-sm mt-2">{formatSize(state.file.size)}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setState(prev => ({ ...prev, file: null }));
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="mt-4 px-4 py-2 pixel-text text-[10px] bg-glow text-hull border-4 border-black shadow-pixel-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                REMOVE
              </button>
            </>
          )}
        </div>
      </div>

      {state.file && !state.result && (
        <button
          onClick={handleUpload}
          disabled={state.loading}
          className="mt-6 px-8 py-3 pixel-text text-sm bg-accent text-hull border-4 border-black shadow-pixel-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.loading ? "UPLOADING..." : "UPLOAD"}
        </button>
      )}

      {state.result && (
        <div className="mt-4 flex flex-col items-center gap-3">
          <p className="pixel-text text-[10px] text-glow border-4 border-glow px-4 py-2 shadow-pixel-sm">
            LOADED {state.result.count} PASSENGERS
          </p>
          <Link
            href="/titanic/passengers"
            className="pixel-text text-[10px] text-hull bg-accent px-4 py-2 border-4 border-black shadow-pixel-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            VIEW MANIFEST →
          </Link>
        </div>
      )}

      {state.error && (
        <p className="mt-4 pixel-text text-[10px] text-hull bg-glow border-4 border-black px-4 py-2 shadow-pixel-sm">
          ! {state.error}
        </p>
      )}

      {/* 빙산 */}
      <div className="absolute bottom-32 left-4 sm:left-12 w-20 sm:w-24 z-0 opacity-90">
        <PixelIceberg className="w-full" />
      </div>

      {/* 타이타닉 (살짝 기울어진 정적 모습) */}
      <div className="absolute bottom-28 right-2 sm:right-12 w-64 sm:w-96 z-0 opacity-95 rotate-[-10deg] origin-bottom-right">
        <PixelTitanic className="w-full" />
      </div>

      {/* 바다 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 moonlight-water border-t-4 border-black overflow-hidden">
        <div className="absolute inset-0 ocean opacity-60 animate-wave" />
        <div className="absolute top-2 left-0 right-0 h-1 bg-ocean-foam opacity-30" />
        <div className="absolute top-6 left-0 right-0 h-1 bg-ocean-foam opacity-20" />
      </div>
    </main>
  );
}
