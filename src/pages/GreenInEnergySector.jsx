// src/pages/GreenInEnergySector.jsx
import React from "react";
import GreenFig6 from "../components/GreenFig6";
import GreenFig7 from "../components/GreenFig7";
import GreenFig8 from "../components/GreenFig8";
import GreenFig9 from "../components/GreenFig9";

const GreenInEnergySector = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Page intro */}
      <header className="mb-1 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 dark:bg-emerald-900/70 px-3 py-1 text-[0.7rem] uppercase tracking-[0.22em] font-semibold text-emerald-800 dark:text-emerald-100">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Energy sector focus</span>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/70 border border-surface-200 dark:border-surface-800 rounded-2xl px-4 py-3 shadow-sm">
        <h1 className="text-lg md:text-xl font-semibold mb-1">
          Green Occupations in the Arab Region
        </h1>
        <p className="text-xs md:text-sm text-color-secondary m-0">
          Overview of occupations labelled as green across ESCWA countries.
        </p>
      </div>
      </header>

      {/* Section 1: Fig 6 + Fig 7 */}
      {/* You can reuse this section wrapper on other pages */}
      <section
        className="
          relative overflow-hidden
          card surface-card border-round-xl p-4 md:p-5
          bg-gradient-to-br from-emerald-50/80 via-white to-sky-50/80
          dark:from-emerald-950/60 dark:via-slate-950 dark:to-sky-950
          border border-emerald-100/80 dark:border-emerald-900/70
          shadow-[0_18px_45px_rgba(15,23,42,0.12)]
        "
      >
        {/* soft gradient flare */}
        <div
          className="
            pointer-events-none absolute inset-0 opacity-70
            bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.20),transparent_55%)]
          "
        />
        <div className="relative">
          <div className="pb-3 mb-4 border-b border-surface-200/60 dark:border-surface-800/80 flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 dark:bg-emerald-900/70 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] font-semibold text-emerald-800 dark:text-emerald-100 w-fit">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/80 dark:bg-emerald-950">
                <i className="pi pi-bolt text-[0.55rem]" />
              </span>
              <span>Section 1 · Occupations</span>
            </div>

            <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
              Green Occupations in the Energy Sector
            </h2>
            <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
              How the share of <strong>green-labelled occupations</strong> in
              energy has evolved, and how green vs non-green shares compare
              across key energy occupations.
            </p>
          </div>

          {/* 2-column grid: Fig 6 | Fig 7 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
            <div className="min-h-[420px] min-w-0 flex">
              <GreenFig6 />
            </div>
            <div className="min-h-[420px] min-w-0 flex">
              <GreenFig7 />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Fig 8 + Fig 9 */}
      <section
        className="
          relative overflow-hidden
          card surface-card border-round-xl p-4 md:p-5
          bg-gradient-to-br from-sky-50/80 via-white to-emerald-50/80
          dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/70
          border border-sky-100/80 dark:border-sky-900/60
          shadow-[0_18px_45px_rgba(15,23,42,0.12)]
        "
      >
        {/* soft gradient flare */}
        <div
          className="
            pointer-events-none absolute inset-0 opacity-70
            bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.20),transparent_55%)]
          "
        />
        <div className="relative">
          <div className="pb-3 mb-4 border-b border-surface-200/60 dark:border-surface-800/80 flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100/85 dark:bg-sky-900/70 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] font-semibold text-sky-800 dark:text-sky-100 w-fit">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/80 dark:bg-sky-950">
                <i className="pi pi-globe text-[0.55rem]" />
              </span>
              <span>Section 2 · Countries &amp; O&amp;G</span>
            </div>

            <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50">
              Green Jobs in the Energy Sector Across ESCWA Countries
            </h2>
            <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
              The balance between <strong>green jobs outside O&amp;G</strong>,
              all <strong>O&amp;G jobs</strong>, and{" "}
              <strong>green jobs within O&amp;G</strong>, plus the distribution
              of green O&amp;G jobs across ESCWA countries.
            </p>
          </div>

          {/* 2-column grid: Fig 8 | Fig 9 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
            <div className="min-h-[420px] min-w-0 flex">
              <GreenFig8 />
            </div>
            <div className="min-h-[420px] min-w-0 flex">
              <GreenFig9 />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GreenInEnergySector;
