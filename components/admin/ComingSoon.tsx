import { Construction } from "lucide-react";

export default function ComingSoon({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-sm text-foreground-muted mt-0.5">{desc}</p>
      </div>
      <div className="grid place-items-center rounded-2xl border border-border bg-surface py-20 text-center">
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-brand/10 text-brand mb-3">
          <Construction size={22} />
        </span>
        <p className="text-sm font-medium text-foreground">준비 중인 화면이에요</p>
        <p className="text-xs text-foreground-muted mt-1">곧 이 영역을 채울 예정입니다.</p>
      </div>
    </div>
  );
}
