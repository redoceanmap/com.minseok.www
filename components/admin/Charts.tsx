"use client";

/**
 * 의존성 없이 순수 SVG로 그리는 어드민용 차트 모음.
 * 색은 프로젝트 브랜드(와인) 토큰을 기본값으로 쓴다.
 */

const BRAND = "#722F37";
const BRAND_SOFT = "#E8D5D8";

/** 가운데 퍼센트가 들어가는 도넛형 링 (참고 이미지 상단 카드) */
export function RingChart({
  value,
  label,
  color = BRAND,
  track = BRAND_SOFT,
  size = 64,
}: {
  value: number; // 0~100
  label?: string;
  color?: string;
  track?: string;
  size?: number;
}) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c * (1 - pct / 100);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-foreground tabular-nums">{Math.round(pct)}%</span>
        {label && <span className="text-[9px] text-foreground-muted leading-none mt-0.5">{label}</span>}
      </div>
    </div>
  );
}

/** 항목별 세로 막대 그래프 (Hours Logged 스타일) */
export function BarChart({
  data,
  color = BRAND,
  height = 140,
}: {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <span className="text-[10px] font-medium text-foreground tabular-nums">{d.value}</span>
          <div
            className="w-full rounded-md transition-all"
            style={{
              height: `${(d.value / max) * 100}%`,
              minHeight: 4,
              background: color,
            }}
          />
          <span className="text-[10px] text-foreground-muted">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/** 부드러운 영역 라인 차트 (Performance Overview 스타일) */
export function AreaChart({
  data,
  color = BRAND,
  height = 120,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const w = 320;
  const h = height;
  const pad = 6;
  const max = Math.max(1, ...data);
  const min = Math.min(...data);
  const span = Math.max(1, max - min);
  const stepX = (w - pad * 2) / Math.max(1, data.length - 1);
  const pts = data.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (1 - (v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.22} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#areaFill)" />
      <path d={line} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/** 범례가 붙는 도넛 차트 (탑승 항구 분포 등) */
export function DonutChart({
  segments,
  size = 140,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const stroke = 18;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const total = Math.max(1, segments.reduce((s, x) => s + x.value, 0));
  let acc = 0;

  return (
    <div className="flex items-center gap-5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {segments.map((seg) => {
            const frac = seg.value / total;
            const dash = c * frac;
            const gap = c - dash;
            const offset = -acc * c;
            acc += frac;
            return (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={offset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-foreground tabular-nums">{total}</span>
          <span className="text-[10px] text-foreground-muted">전체</span>
        </div>
      </div>
      <ul className="space-y-2">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: seg.color }} />
            <span className="text-foreground-muted">{seg.label}</span>
            <span className="ml-auto font-semibold text-foreground tabular-nums">{seg.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
