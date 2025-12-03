// src/pages/BenchmarkingOccupationalDemands.jsx
import React from "react";
import BenchmarkingFig1Fig2 from "../components/BenchmarkingFig1Fig2";

const BenchmarkingOccupationalDemands = () => {
  return (
    <div className="page-grid">
      {/* Page intro */}
      <header className="page-hero">
        <div className="page-hero__eyebrow">
          <i className="pi pi-sliders-h text-xs" />
          Benchmarking
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
          <div>
            <h1 className="page-hero__title">
              Occupational Demands: UAE vs US Comparison
            </h1>
            <p className="page-hero__meta">
              Comparative analysis of job market demands across different occupations.
            </p>
          </div>
          <span className="badge-soft">
            <i className="pi pi-compass" />
            Radar view
          </span>
        </div>
      </header>

      {/* Section 1: Fig 1 & Fig 2 (Radar Chart) */}
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
                <i className="pi pi-chart-line text-[0.55rem]" />
              </span>
              <span>Section 1 · Job Title Distribution</span>
            </div>

            <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
              Standardized Occupational Demands: UAE vs US
            </h2>
            <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
              A comparative radar chart showing the{" "}
              <strong>standardized percentage distribution</strong> of top job
              titles in the UAE labor market versus the United States.
            </p>
          </div>

          {/* Single figure centered */}
          <div className="flex justify-content-center">
            <div className="min-h-[420px] min-w-0 flex w-full">
              <BenchmarkingFig1Fig2 />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BenchmarkingOccupationalDemands;
