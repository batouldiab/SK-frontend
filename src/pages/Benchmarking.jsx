// src/pages/Benchmarking.jsx
import React from "react";
import BenchmarkingFig1Fig2 from "../components/BenchmarkingFig1Fig2";
import BenchmarkingFig3 from "../components/BenchmarkingFig3";
import BenchmarkingFig4 from "../components/BenchmarkingFig4";
import BenchmarkingFig5_1 from "../components/BenchmarkingFig5_1";
import BenchmarkingFig5_2 from "../components/BenchmarkingFig5_2";
import BenchmarkingFig6 from "../components/BenchmarkingFig6";
import BenchmarkingFig8 from "../components/BenchmarkingFig8";

const Benchmarking = () => {
  return (
    <div className="page-grid">
      <header className="page-hero">
        <div className="page-hero__eyebrow">
          <i className="pi pi-sliders-h text-xs" />
          Benchmarking
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
          <div>
            <h1 className="page-hero__title">Benchmarking labour market signals</h1>
            <p className="page-hero__meta">
              A consolidated view of occupational demand, skill similarity, and shared-skill patterns across UAE and US markets.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="badge-soft">
              <i className="pi pi-chart-line" />
              Demand
            </span>
            <span className="badge-soft">
              <i className="pi pi-verified" />
              Skill similarity
            </span>
            <span className="badge-soft">
              <i className="pi pi-share-alt" />
              Shared skills
            </span>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:gap-7">
        {/* Occupational demand radar (Fig 1 & Fig 2) */}
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
                  <i className="pi pi-chart-line text-[0.55rem]" />
                </span>
                <span>Section 1 : Job Title Distribution</span>
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
                Standardized Occupational Demands
              </h2>
              <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
                A comparative radar chart showing the <strong>standardized distribution</strong> of top unique occupations in the labor market versus the United States.
              </p>
            </div>

            <div className="flex justify-content-center">
              <div className="min-h-[420px] min-w-0 flex w-full">
                <BenchmarkingFig1Fig2 />
              </div>
            </div>
          </div>
        </section>

        {/* Skill similarity: Soft skills (Fig 3) */}
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
                <span>Section 2 : Quantifying skill similarity across markets</span>
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
                Soft skills: shared foundations and frontier gaps
              </h2>
              <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
                Country-specific soft skills demanded among the soft skills.
              </p>
            </div>

            <div className="flex justify-content-center">
              <div className="min-h-[420px] min-w-0 flex w-full">
                <BenchmarkingFig3 />
              </div>
            </div>
          </div>
        </section>

        {/* Skill similarity: Hard skills (Fig 4) */}
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
                <span>Section 3 : Quantifying skill similarity across markets</span>
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
                Hard skills: shared foundations and frontier gaps
              </h2>
              <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
                Country-specific hard skills demanded among the hard skills.
              </p>
            </div>

            <div className="flex justify-content-center">
              <div className="min-h-[420px] min-w-0 flex w-full">
                <BenchmarkingFig4 />
              </div>
            </div>
          </div>
        </section>

        {/* Soft skill categories distribution (Fig 5_1) */}
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
                <span>Section 4 : Soft Skills Categories Distribution</span>
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
                Comparative breakdown of unique soft skill demand
              </h2>
              <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
                Distribution of Soft Skills Categories in Demand.
              </p>
            </div>

            <div className="flex justify-content-center">
              <div className="min-h-[420px] min-w-0 flex w-full">
                <BenchmarkingFig5_1 />
              </div>
            </div>
          </div>
        </section>

        {/* Hard skill categories distribution (Fig 5_2) */}
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
                <span>Section 5 : Hard Skills Categories Distribution</span>
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
                Comparative breakdown of unique hard skill demand
              </h2>
              <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
                Distribution of Hard Skills Categories in Demand.
              </p>
            </div>

            <div className="flex justify-content-center">
              <div className="min-h-[420px] min-w-0 flex w-full">
                <BenchmarkingFig5_2 />
              </div>
            </div>
          </div>
        </section>

        {/* Shared skills: Top job titles (Fig 6) */}
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
                <span>Section 6 : Top Job Titles for Shared Skills</span>
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
                Top Job Titles: UAE vs US
              </h2>
              <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
                Standardized count distribution of top job titles for selected skill across UAE and US markets.
              </p>
            </div>

            <div className="flex justify-content-center">
              <div className="min-h-[420px] min-w-0 flex w-full">
                <BenchmarkingFig6 />
              </div>
            </div>
          </div>
        </section>

        {/* Shared skills: Hierarchy level distribution (Fig 8) */}
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
                <span>Section 7 : Skill Distribution by Hierarchy Level</span>
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
                Skill Distribution by Hierarchy Level: UAE vs US
              </h2>
              <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
                Standardized count distribution of Hierarchy Level for selected skill across UAE and US markets.
              </p>
            </div>

            <div className="flex justify-content-center">
              <div className="min-h-[420px] min-w-0 flex w-full">
                <BenchmarkingFig8 />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Benchmarking;
