// src/pages/BenchmarkingOccupationalPattern.jsx
import React from "react";
import BenchmarkingFig6 from "../components/BenchmarkingFig6";

const BenchmarkingOccupationalPattern = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Page intro */}
      <header className="mb-1 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 dark:bg-blue-900/70 px-3 py-1 text-[0.7rem] uppercase tracking-[0.22em] font-semibold text-blue-800 dark:text-blue-100">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span>Benchmarking Analysis</span>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/70 border border-surface-200 dark:border-surface-800 rounded-2xl px-4 py-3 shadow-sm">
          <h1 className="text-lg md:text-xl font-semibold mb-1">
            Occupational Pattern of Shared Skills
          </h1>
          <p className="text-xs md:text-sm text-color-secondary m-0">
            Comparative analysis of job titles of shared skills.
          </p>
        </div>
      </header>

      {/* Section 1: Fig 3 */}
      <section
        className="
          relative overflow-hidden
          card surface-card border-round-xl p-4 md:p-5
          bg-gradient-to-br from-blue-50/80 via-white to-pink-50/80
          dark:from-blue-950/60 dark:via-slate-950 dark:to-pink-950/60
          border border-blue-100/80 dark:border-blue-900/70
          shadow-[0_18px_45px_rgba(15,23,42,0.12)]
        "
      >
        {/* soft gradient flare */}
        <div
          className="
            pointer-events-none absolute inset-0 opacity-70
            bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.20),transparent_55%)]
          "
        />
        <div className="relative">
          <div className="pb-3 mb-4 border-b border-surface-200/60 dark:border-surface-800/80 flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 dark:bg-blue-900/70 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] font-semibold text-blue-800 dark:text-blue-100 w-fit">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/80 dark:bg-blue-950">
                <i className="pi pi-chart-bar text-[0.55rem]" />
              </span>
              <span>Section 1 · Top Job Titles for Shared Skills</span>
            </div>

            <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
              Top 10 Job Titles: UAE vs US
            </h2>
            <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
              Standardized count distribution of top 10 job titles for selected skill across UAE and US markets.
            </p>
          </div>

          {/* Figure 3 */}
          <div className="flex justify-content-center">
            <div className="min-h-[420px] min-w-0 flex w-full">
              <BenchmarkingFig6 />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default BenchmarkingOccupationalPattern;