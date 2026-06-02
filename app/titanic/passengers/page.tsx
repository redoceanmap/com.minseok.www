"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Passenger } from "@/lib/api";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export default function PassengersPage() {
  const [state, setState] = useState<{
    passengers: Passenger[];
    loading: boolean;
    error: string | null;
    page: number;
    pageSize: number;
    search: string;
  }>({ passengers: [], loading: true, error: null, page: 1, pageSize: 25, search: "" });

  useEffect(() => {
    api
      .passengers()
      .then((data) => setState((s) => ({ ...s, passengers: data, loading: false, error: null })))
      .catch((e: Error) =>
        setState((s) => ({ ...s, passengers: [], loading: false, error: e.message })),
      );
  }, []);

  const { passengers, loading, error, page, pageSize, search } = state;
  const filtered = search.trim()
    ? passengers.filter((p) =>
        [p.Name, p.Ticket, String(p.PassengerId)]
          .join(" ")
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
      )
    : passengers;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const setPage = (p: number) => setState((s) => ({ ...s, page: p }));
  const setPageSize = (ps: number) => setState((s) => ({ ...s, pageSize: ps, page: 1 }));
  const setSearch = (q: string) => setState((s) => ({ ...s, search: q, page: 1 }));

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 sm:px-8 pt-10 pb-20 starfield">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="pixel-text text-xl sm:text-2xl text-accent">
            PASSENGER MANIFEST
          </h1>
          <Link
            href="/titanic/predict"
            className="pixel-text text-[10px] text-hull bg-accent px-3 py-1.5 border-2 border-black hover:opacity-80 transition"
          >
            ← UPLOAD
          </Link>
        </div>

        {loading && (
          <p className="pixel-text text-xs text-accent animate-flicker">
            LOADING...
          </p>
        )}

        {error && (
          <p className="pixel-text text-[10px] text-hull bg-glow border-4 border-black px-4 py-2 shadow-pixel-sm">
            ! {error}
          </p>
        )}

        {!loading && !error && passengers.length === 0 && (
          <div className="text-center mt-20">
            <p className="pixel-text text-xs text-accent mb-4">NO DATA</p>
            <p className="text-muted text-sm">
              먼저 CSV를 업로드해 주세요.
            </p>
            <Link
              href="/titanic/predict"
              className="inline-block mt-6 pixel-text text-[10px] text-hull bg-accent px-4 py-2 border-2 border-black hover:opacity-80 transition"
            >
              CSV 업로드하기
            </Link>
          </div>
        )}

        {passengers.length > 0 && (
          <>
            <div className="mb-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="이름 / 티켓 / ID 검색..."
                className="w-full bg-hull border-2 border-accent/60 focus:border-accent outline-none px-3 py-1.5 text-ink text-sm placeholder:text-accent/30 font-sans"
              />
            </div>

            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <p className="pixel-text text-[10px] text-accent/60">
                {search.trim() ? `${filtered.length} / ${passengers.length} RECORDS` : `TOTAL: ${passengers.length} RECORDS`}
                &nbsp;|&nbsp; PAGE {safePage}/{totalPages}
              </p>
              <div className="flex items-center gap-2">
                <span className="pixel-text text-[9px] text-accent/60">ROWS:</span>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    onClick={() => setPageSize(size)}
                    className={`pixel-text text-[9px] px-2 py-1 border-2 border-black transition ${
                      pageSize === size
                        ? "bg-accent text-hull"
                        : "bg-hull text-accent hover:bg-accent/20"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto border-4 border-accent shadow-pixel-lg">
              <table className="w-full text-sm font-sans border-collapse">
                <thead>
                  <tr className="bg-accent text-hull">
                    {["ID", "생존", "등급", "이름", "성별", "나이", "SibSp", "Parch", "티켓", "요금", "선실", "승선항"].map(
                      (h) => (
                        <th
                          key={h}
                          className="pixel-text text-[9px] px-2 py-2 border-r-2 border-black text-left whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((p, i) => (
                    <tr
                      key={`${p.PassengerId}-${i}`}
                      className={`border-b-2 border-accent/30 ${i % 2 === 0 ? "bg-hull" : "bg-night-mid"}`}
                    >
                      <td className="px-2 py-1.5 text-accent/80">{p.PassengerId}</td>
                      <td className="px-2 py-1.5">
                        <span
                          className={`pixel-text text-[9px] px-1.5 py-0.5 border-2 border-black ${
                            p.Survived === 1
                              ? "bg-glow text-hull"
                              : "bg-hull text-accent/50"
                          }`}
                        >
                          {p.Survived === 1 ? "LIVE" : "DEAD"}
                        </span>
                      </td>
                      <td className="px-2 py-1.5 text-ink">{p.Pclass}</td>
                      <td className="px-2 py-1.5 text-ink max-w-[160px] truncate">{p.Name}</td>
                      <td className="px-2 py-1.5 text-ink capitalize">{p.Sex}</td>
                      <td className="px-2 py-1.5 text-ink">{p.Age ?? "-"}</td>
                      <td className="px-2 py-1.5 text-ink">{p.SibSp}</td>
                      <td className="px-2 py-1.5 text-ink">{p.Parch}</td>
                      <td className="px-2 py-1.5 text-ink">{p.Ticket}</td>
                      <td className="px-2 py-1.5 text-ink">{p.Fare}</td>
                      <td className="px-2 py-1.5 text-ink">{p.Cabin ?? "-"}</td>
                      <td className="px-2 py-1.5 text-ink">{p.Embarked ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
                <button
                  onClick={() => setPage(1)}
                  disabled={safePage === 1}
                  className="pixel-text text-[9px] px-2 py-1 border-2 border-black bg-hull text-accent disabled:opacity-30 hover:bg-accent/20 transition"
                >
                  «
                </button>
                <button
                  onClick={() => setPage(safePage - 1)}
                  disabled={safePage === 1}
                  className="pixel-text text-[9px] px-2 py-1 border-2 border-black bg-hull text-accent disabled:opacity-30 hover:bg-accent/20 transition"
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2)
                  .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "…" ? (
                      <span key={`ellipsis-${idx}`} className="pixel-text text-[9px] text-accent/40 px-1">
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item as number)}
                        className={`pixel-text text-[9px] px-2 py-1 border-2 border-black transition ${
                          safePage === item
                            ? "bg-accent text-hull"
                            : "bg-hull text-accent hover:bg-accent/20"
                        }`}
                      >
                        {item}
                      </button>
                    ),
                  )}

                <button
                  onClick={() => setPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="pixel-text text-[9px] px-2 py-1 border-2 border-black bg-hull text-accent disabled:opacity-30 hover:bg-accent/20 transition"
                >
                  ›
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={safePage === totalPages}
                  className="pixel-text text-[9px] px-2 py-1 border-2 border-black bg-hull text-accent disabled:opacity-30 hover:bg-accent/20 transition"
                >
                  »
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
