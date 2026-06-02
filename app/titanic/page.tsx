"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PixelTitanic from "@/components/PixelTitanic";
import PixelIceberg from "@/components/PixelIceberg";
import PixelExplosion from "@/components/PixelExplosion";
import { api } from "@/lib/api";

type Weather = {
  city?: string;
  temp?: number;
  feels_like?: number;
  description?: string;
  icon?: string;
  humidity?: number;
  error?: string;
};

const STARS = [
  { top: "8%", left: "12%", size: 4, delay: "0s" },
  { top: "14%", left: "78%", size: 3, delay: "0.5s" },
  { top: "20%", left: "30%", size: 4, delay: "1s" },
  { top: "10%", left: "55%", size: 3, delay: "1.5s" },
  { top: "26%", left: "88%", size: 4, delay: "0.3s" },
  { top: "32%", left: "8%", size: 3, delay: "0.8s" },
  { top: "18%", left: "42%", size: 2, delay: "1.2s" },
  { top: "30%", left: "65%", size: 3, delay: "0.6s" },
  { top: "12%", left: "20%", size: 2, delay: "1.8s" },
  { top: "24%", left: "70%", size: 2, delay: "0.2s" },
];

const DAYS_KR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const pad2 = (n: number) => String(n).padStart(2, "0");

export default function HomePage() {
  const [state, setState] = useState<{
    input: string;
    reply: string;
    loading: boolean;
    weather: Weather | null;
    now: Date | null;
  }>({ input: "", reply: "", loading: false, weather: null, now: null });

  useEffect(() => {
    setState(s => ({ ...s, now: new Date() }));
    const timer = setInterval(() => setState(s => ({ ...s, now: new Date() })), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        api.weather(coords.latitude, coords.longitude)
          .then(weather => setState(s => ({ ...s, weather })))
          .catch(() => setState(s => ({ ...s, weather: null })));
      },
      () => setState(s => ({ ...s, weather: null })),
    );
  }, []);

  const handleSubmit = async () => {
    const msg = state.input.trim();
    if (!msg || state.loading) return;
    setState(s => ({ ...s, loading: true, reply: "" }));
    try {
      const res = await api.chat(msg);
      setState(s => ({ ...s, reply: res.reply ?? res.error ?? "" }));
    } catch {
      setState(s => ({ ...s, reply: "전송에 실패했어요. 다시 시도해 주세요" }));
    } finally {
      setState(s => ({ ...s, loading: false, input: "" }));
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden starfield">
      {/* 깜빡이는 별들 */}
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute bg-star animate-twinkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            boxShadow: "0 0 6px rgba(255,232,115,0.8)",
          }}
        />
      ))}

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 flex flex-col items-center pt-14 sm:pt-20 pb-32 sm:pb-48 px-4 sm:px-6">
        <h1 className="pixel-text text-5xl sm:text-7xl text-accent text-center leading-relaxed text-shadow-glow animate-flicker">
          TITANIC
        </h1>

        <div className="mt-6 px-4 py-2 bg-hull text-accent pixel-text text-[10px] sm:text-xs border-4 border-accent shadow-glow">
          ★ APRIL 14, 1912 ★
        </div>

        <p className="mt-6 text-muted text-sm sm:text-base text-center max-w-md">
          대화형 AI 에이전트 플랫폼
        </p>

        {/* 픽셀 날씨 위젯 — 검색 박스 위 */}
        {state.weather && !state.weather.error && state.weather.temp !== undefined && (
          <div className="mt-10 w-full max-w-xl bg-hull border-4 border-accent shadow-pixel-lg">
            <div className="bg-accent px-3 py-1 border-b-4 border-black flex items-center justify-between">
              <span className="pixel-text text-[10px] text-hull">
                ▼ WEATHER STATION
              </span>
              <span className="pixel-text text-[10px] text-hull">
                {state.weather.city}
              </span>
            </div>
            <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex flex-col">
                <span className="pixel-text text-[8px] text-accent/70 hidden sm:block">
                  {state.now
                    ? `${state.now.getFullYear()}.${pad2(state.now.getMonth() + 1)}.${pad2(state.now.getDate())} ${DAYS_KR[state.now.getDay()]}`
                    : ""}
                </span>
                <span className="pixel-text text-base sm:text-lg text-accent leading-tight sm:mt-1">
                  {state.now ? `${pad2(state.now.getHours())}:${pad2(state.now.getMinutes())}` : "--:--"}
                </span>
              </div>

              <div className="hidden sm:block w-1 h-10 bg-accent/40" />

              <div className="flex flex-col">
                <span className="pixel-text text-sm sm:text-base text-accent leading-none">
                  {Math.round(state.weather.temp)}°C
                </span>
                <span className="pixel-text text-[8px] text-accent/70 mt-1">
                  FEELS {Math.round(state.weather.feels_like ?? state.weather.temp)}°
                </span>
                <span className="pixel-text text-[8px] text-accent/70">
                  HUM {state.weather.humidity}%
                </span>
              </div>

              <div className="hidden sm:block w-1 h-10 bg-accent/40" />

              <div className="flex items-center gap-1.5 sm:gap-2">
                {state.weather.icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${state.weather.icon}@2x.png`}
                    alt={state.weather.description ?? ""}
                    className="h-9 w-9 sm:h-12 sm:w-12"
                    style={{ imageRendering: "pixelated" }}
                  />
                )}
                <span className="pixel-text text-[10px] text-accent hidden sm:inline max-w-[120px]">
                  {state.weather.description}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 검색 박스 — 무선 통신실 콘솔 느낌 */}
        <div className="mt-4 w-full max-w-xl">
          <div className="bg-hull border-4 border-accent shadow-pixel-lg">
            <div className="bg-accent px-3 py-1 border-b-4 border-black">
              <span className="pixel-text text-[10px] text-hull">
                ▼ MARCONI WIRELESS
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="pixel-text text-xs text-accent cursor-blink">&gt;</span>
              <input
                type="text"
                value={state.input}
                onChange={(e) => setState(s => ({ ...s, input: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder={state.loading ? "전송 중..." : "무엇이 궁금하신가요?"}
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
            {state.reply && (
              <div className="border-t-4 border-black px-4 py-3">
                <p className="pixel-text text-[10px] text-accent/60 mb-1">RECEIVED:</p>
                <p className="text-sm font-sans text-ink/90 leading-relaxed whitespace-pre-wrap">{state.reply}</p>
              </div>
            )}
          </div>
        </div>

        <Link
          href="/titanic/predict"
          className="mt-8 block pixel-text text-[10px] text-accent animate-twinkle-slow transition-colors hover:text-glow"
        >
          - PRESS START -
        </Link>
      </div>

      {/* 항해 + 뱃머리부터 잠기는 타이타닉 */}
      <div className="absolute bottom-16 left-0 right-0 h-56 z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute bottom-0 w-80 sm:w-[32rem] animate-sail-sink"
          style={{ left: 0, transformOrigin: "30% 90%" }}
        >
          <PixelTitanic className="w-full block" />
        </div>
      </div>

      {/* 빙산 (2/3 지점, 충돌 위치) */}
      <div
        className="absolute bottom-20 w-28 sm:w-44 z-20 opacity-95 animate-iceberg-shake"
        style={{ left: "calc(66vw - 5.5rem)" }}
      >
        <PixelIceberg className="w-full" />
      </div>

      {/* 충돌 폭발 효과 (배 ↔ 빙산) */}
      <div
        className="absolute bottom-20 w-24 sm:w-40 z-30 pointer-events-none"
        style={{
          left: "calc(66vw - 5rem)",
          filter:
            "drop-shadow(0 0 18px rgba(255,140,66,0.7)) drop-shadow(0 0 36px rgba(233,69,96,0.4))",
        }}
      >
        <div className="animate-explosion origin-center">
          <PixelExplosion className="w-full" />
        </div>
      </div>

      {/* 폭발 잔광 (붉은 빛 번짐) */}
      <div
        className="absolute bottom-16 w-40 sm:w-56 h-40 sm:h-56 z-10 pointer-events-none animate-explosion-aftershock"
        style={{
          left: "calc(66vw - 7rem)",
          background:
            "radial-gradient(circle, rgba(255,200,87,0.55) 0%, rgba(255,107,53,0.35) 30%, rgba(233,69,96,0.15) 55%, transparent 75%)",
        }}
      />

      {/* 바다 (하단) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 moonlight-water border-t-4 border-black overflow-hidden">
        {/* 픽셀 파도 라인들 */}
        <div className="absolute inset-0 ocean opacity-60 animate-wave" />
        <div className="absolute top-2 left-0 right-0 h-1 bg-ocean-foam opacity-30" />
        <div className="absolute top-6 left-0 right-0 h-1 bg-ocean-foam opacity-20" />
      </div>
    </main>
  );
}
