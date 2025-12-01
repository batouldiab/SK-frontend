// src/pages/BenchmarkSkillSimilarity.jsx
import React from "react";
import BenchmarkingFig3 from "../components/BenchmarkingFig3";
// import BenchmarkingFig4 from "../components/BenchmarkingFig4";
// import BenchmarkingFig5 from "../components/BenchmarkingFig5";

const BenchmarkSkillSimilarity = () => {
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
            Skill Similarity: UAE vs US Comparison
          </h1>
          <p className="text-xs md:text-sm text-color-secondary m-0">
            Comparative analysis of skill similarity and distributions across labor markets.
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
              <span>Section 1 · Skill Similarity Analysis</span>
            </div>

            <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
              Top 10 Soft Skills: UAE vs US
            </h2>
            <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
              Standardized count distribution of top 10 soft skills across UAE and US markets.
            </p>
          </div>

          {/* Figure 3 */}
          <div className="flex justify-content-center">
            <div className="min-h-[420px] min-w-0 flex w-full">
              <BenchmarkingFig3 />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Fig 4 */}
      <section
        className="
          relative overflow-hidden
          card surface-card border-round-xl p-4 md:p-5
          bg-gradient-to-br from-purple-50/80 via-white to-blue-50/80
          dark:from-purple-950/60 dark:via-slate-950 dark:to-blue-950/60
          border border-purple-100/80 dark:border-purple-900/70
          shadow-[0_18px_45px_rgba(15,23,42,0.12)]
        "
      >
        {/* soft gradient flare */}
        <div
          className="
            pointer-events-none absolute inset-0 opacity-70
            bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.20),transparent_55%)]
          "
        />
        <div className="relative">
          <div className="pb-3 mb-4 border-b border-surface-200/60 dark:border-surface-800/80 flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100/80 dark:bg-purple-900/70 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] font-semibold text-purple-800 dark:text-purple-100 w-fit">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/80 dark:bg-purple-950">
                <i className="pi pi-chart-pie text-[0.55rem]" />
              </span>
              <span>Section 2 · Skill Distribution</span>
            </div>

            <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
              Comparative Skill Distribution Patterns
            </h2>
            <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
              Examining the distribution of key skills across different occupational categories.
            </p>
          </div>

          {/* Figure 4 */}
          <div className="flex justify-content-center">
            <div className="min-h-[420px] min-w-0 flex w-full">
              {/* <BenchmarkingFig4 /> */}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Fig 5 */}
      <section
        className="
          relative overflow-hidden
          card surface-card border-round-xl p-4 md:p-5
          bg-gradient-to-br from-emerald-50/80 via-white to-cyan-50/80
          dark:from-emerald-950/60 dark:via-slate-950 dark:to-cyan-950/60
          border border-emerald-100/80 dark:border-emerald-900/70
          shadow-[0_18px_45px_rgba(15,23,42,0.12)]
        "
      >
        {/* soft gradient flare */}
        <div
          className="
            pointer-events-none absolute inset-0 opacity-70
            bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.20),transparent_55%)]
          "
        />
        <div className="relative">
          <div className="pb-3 mb-4 border-b border-surface-200/60 dark:border-surface-800/80 flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 dark:bg-emerald-900/70 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] font-semibold text-emerald-800 dark:text-emerald-100 w-fit">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/80 dark:bg-emerald-950">
                <i className="pi pi-sitemap text-[0.55rem]" />
              </span>
              <span>Section 3 · Advanced Analysis</span>
            </div>

            <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
              Cross-Market Skill Relationships
            </h2>
            <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
              In-depth visualization of skill relationships and connections between UAE and US markets.
            </p>
          </div>

          {/* Figure 5 */}
          <div className="flex justify-content-center">
            <div className="min-h-[420px] min-w-0 flex w-full">
              {/* <BenchmarkingFig5 /> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BenchmarkSkillSimilarity;