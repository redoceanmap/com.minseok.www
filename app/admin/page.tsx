"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ship, HeartPulse, Skull, Ticket, ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";
import type { Passenger } from "@/lib/api";
import { RingChart, BarChart, AreaChart, DonutChart } from "@/components/admin/Charts";

const PORT_COLORS: Record<string, string> = {
  S: "#722F37",
  C: "#A85761",
  Q: "#D7B3B8",
  "미상": "#E8E2D9",
};

export default function AdminDashboard() {
  const [state, setState] = useState<{
    passengers: Passenger[];
    loading: boolean;
    error: string | null;
  }>({ passengers: [], loading: true, error: null });

  useEffect(() => {
    api
      .passengers()
      .then((data) => setState({ passengers: data, loading: false, error: null }))
      .catch((e: Error) => setState({ passengers: [], loading: false, error: e.message }));
  }, []);

  const { passengers, loading, error } = state;

  // === 실제 데이터로 통계 계산 ===
  const total = passengers.length;
  const survived = passengers.filter((p) => p.Survived === 1).length;
  const died = total - survived;
  const survivalRate = total ? (survived / total) * 100 : 0;
  const female = passengers.filter((p) => p.Sex?.toLowerCase() === "female").length;
  const femaleRate = total ? (female / total) * 100 : 0;
  const firstClass = passengers.filter((p) => p.Pclass === 1).length;
  const firstClassRate = total ? (firstClass / total) * 100 : 0;
  const avgFare = total
    ? passengers.reduce((s, p) => s + (Number(p.Fare) || 0), 0) / total
    : 0;

  // 등급별 생존율 (영역 라인 차트용 추세 + 막대용)
  const byClass = [1, 2, 3].map((cls) => {
    const group = passengers.filter((p) => p.Pclass === cls);
    const alive = group.filter((p) => p.Survived === 1).length;
    return {
      label: `${cls}등급`,
      total: group.length,
      rate: group.length ? Math.round((alive / group.length) * 100) : 0,
    };
  });

  // 탑승 항구 분포
  const ports = ["S", "C", "Q"].map((code) => ({
    label: { S: "사우샘프턴", C: "셰르부르", Q: "퀸스타운" }[code] as string,
    value: passengers.filter((p) => p.Embarked === code).length,
    color: PORT_COLORS[code],
  }));
  const unknownPort = passengers.filter((p) => !p.Embarked).length;
  if (unknownPort > 0)
    ports.push({ label: "미상", value: unknownPort, color: PORT_COLORS["미상"] });

  const recent = passengers.slice(0, 6);

  const stats = [
    { label: "전체 승객", value: total, icon: Ship, ring: 100, ringLabel: "기준" },
    { label: "생존자", value: survived, icon: HeartPulse, ring: survivalRate, ringLabel: "생존" },
    { label: "사망자", value: died, icon: Skull, ring: total ? (died / total) * 100 : 0, ringLabel: "사망" },
    { label: "평균 요금", value: `£${avgFare.toFixed(1)}`, icon: Ticket, ring: firstClassRate, ringLabel: "1등급" },
  ];

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">대시보드</h1>
          <p className="text-sm text-foreground-muted mt-0.5">타이타닉 승객 데이터 한눈에 보기</p>
        </div>
        <Link
          href="/titanic/passengers"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand hover:gap-1.5 transition-all"
        >
          전체 보기 <ArrowUpRight size={15} />
        </Link>
      </div>

      {loading && (
        <div className="grid place-items-center h-40 text-sm text-foreground-muted">
          불러오는 중...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-border bg-surface p-6 text-center">
          <p className="text-sm font-medium text-foreground">데이터를 불러오지 못했어요</p>
          <p className="text-xs text-foreground-muted mt-1">{error}</p>
          <Link
            href="/titanic/predict"
            className="inline-block mt-4 text-sm font-medium text-white bg-brand px-4 py-2 rounded-full hover:bg-brand-deep transition-colors"
          >
            CSV 업로드하기
          </Link>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* 스탯 카드 — 모바일 2열 → 데스크톱 4열 */}
          <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            {stats.map(({ label, value, icon: Icon, ring, ringLabel }) => (
              <div
                key={label}
                className="rounded-2xl border border-border bg-surface p-4 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-foreground-muted">
                    <Icon size={15} className="text-brand shrink-0" />
                    <span className="text-xs truncate">{label}</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground mt-2 tabular-nums truncate">
                    {value}
                  </p>
                </div>
                <RingChart value={ring} label={ringLabel} size={56} />
              </div>
            ))}
          </section>

          {/* 차트 영역 — 모바일 1열 → 데스크톱 3열(2+1) */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">등급별 생존율</h2>
                  <p className="text-xs text-foreground-muted">선실 등급에 따른 생존 추세</p>
                </div>
                <span className="text-2xl font-bold text-brand tabular-nums">
                  {Math.round(survivalRate)}%
                </span>
              </div>
              <AreaChart data={byClass.map((c) => c.rate)} height={120} />
              <BarChart
                data={byClass.map((c) => ({ label: c.label, value: c.rate }))}
                height={120}
              />
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="text-sm font-semibold text-foreground mb-1">탑승 항구 분포</h2>
              <p className="text-xs text-foreground-muted mb-5">승선항별 승객 수</p>
              <DonutChart segments={ports} />
            </div>
          </section>

          {/* 보조 지표 + 최근 승객 */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
              <h2 className="text-sm font-semibold text-foreground">인구 통계</h2>
              <MetricBar label="여성 비율" pct={femaleRate} />
              <MetricBar label="1등급 비율" pct={firstClassRate} />
              <MetricBar label="생존율" pct={survivalRate} />
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">최근 승객</h2>
                <Link href="/titanic/passengers" className="text-xs font-medium text-brand">
                  더 보기
                </Link>
              </div>
              <ul className="divide-y divide-border">
                {recent.map((p) => (
                  <li key={p.PassengerId} className="flex items-center gap-3 px-5 py-3">
                    <span className="grid place-items-center w-9 h-9 rounded-full bg-background text-xs font-semibold text-brand shrink-0">
                      {p.Name?.charAt(0) ?? "?"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{p.Name}</p>
                      <p className="text-xs text-foreground-muted">
                        {p.Pclass}등급 · {p.Sex === "female" ? "여" : "남"} · {p.Age ?? "?"}세
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2 py-1 rounded-full shrink-0 ${
                        p.Survived === 1
                          ? "bg-brand/10 text-brand"
                          : "bg-black/5 text-foreground-muted"
                      }`}
                    >
                      {p.Survived === 1 ? "생존" : "사망"}
                    </span>
                  </li>
                ))}
                {recent.length === 0 && (
                  <li className="px-5 py-8 text-center text-sm text-foreground-muted">
                    표시할 승객이 없어요
                  </li>
                )}
              </ul>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function MetricBar({ label, pct }: { label: string; pct: number }) {
  const v = Math.max(0, Math.min(100, pct));
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-foreground-muted">{label}</span>
        <span className="font-semibold text-foreground tabular-nums">{Math.round(v)}%</span>
      </div>
      <div className="h-2 rounded-full bg-background overflow-hidden">
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
