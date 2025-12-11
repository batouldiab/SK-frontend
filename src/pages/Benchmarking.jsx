// src/pages/Benchmarking.jsx
import React, { useState } from "react";
import BenchmarkingFig1Fig2 from "../components/BenchmarkingFig1Fig2";
import BenchmarkingFig3 from "../components/BenchmarkingFig3";
import BenchmarkingFig4 from "../components/BenchmarkingFig4";
import BenchmarkingFig5_1 from "../components/BenchmarkingFig5_1";
import BenchmarkingFig5_2 from "../components/BenchmarkingFig5_2";
import BenchmarkingFig6 from "../components/BenchmarkingFig6";
import BenchmarkingFig8 from "../components/BenchmarkingFig8";

const COUNTRY_OPTIONS = [
  "United States",
  "Algeria",
  "Bahrain",
  "Djibouti",
  "Egypt",
  "Iraq",
  "Jordan",
  "Kuwait",
  "Lebanon",
  "Libya",
  "Mauritania",
  "Morocco",
  "Oman",
  "Palestine",
  "Qatar",
  "Saudi Arabia",
  "Somalia",
  "Sudan",
  "Syria",
  "Tunisia",
  "United Arab Emirates",
  "Yemen",
];

const DEFAULT_COUNTRY = "United States";

const Benchmarking = () => {
  const [selectedCountries, setSelectedCountries] = useState([DEFAULT_COUNTRY]);

  const toggleCountry = (country) => {
    if (country === DEFAULT_COUNTRY) {
      return;
    }

    setSelectedCountries((prev) => {
      if (prev.includes(country)) {
        return prev.filter((item) => item !== country);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, country];
    });
  };

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
              A consolidated view of occupational demand, skill similarity, and shared-skill patterns across countries markets.
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
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-[0.2em]">
            <i className="pi pi-globe text-[0.8rem]" />
            Select up to 2 countries
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <div className="flex flex-wrap gap-2">
              {COUNTRY_OPTIONS.map((country) => {
                const isSelected = selectedCountries.includes(country);
                const isLocked = country === DEFAULT_COUNTRY;
                const limitReached = selectedCountries.length >= 3 && !isSelected;
                return (
                  <button
                    key={country}
                    type="button"
                    onClick={() => toggleCountry(country)}
                    disabled={limitReached}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                        : "bg-white/80 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:border-blue-300 hover:text-blue-700"
                    } ${limitReached ? "opacity-50 cursor-not-allowed" : ""} ${isLocked ? "cursor-default" : ""}`}
                  >
                    <i className={isSelected ? "pi pi-check" : "pi pi-circle"} />
                    {country}
                  </button>
                );
              })}
            </div>
            {selectedCountries.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedCountries.map((country) => (
                  <span
                    key={country}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-100 px-3 py-1 text-xs font-medium border border-blue-200/70 dark:border-blue-800/80"
                  >
                    <i className="pi pi-map-marker text-[0.75rem]" />
                    {country}
                  </span>
                ))}
              </div>
            )}
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
                <span>Section 1 · Occupational demand</span>
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
                Job title intensity per 1,000 jobs
              </h2>
              <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
                Side-by-side Countries demand for the unified top job titles, expressed as standardized jobs per 1,000.
              </p>
            </div>

            <div className="flex justify-content-center">
              <div className="min-h-[420px] min-w-0 flex w-full">
                <BenchmarkingFig1Fig2 selectedCountries={selectedCountries} />
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
                <span>Section 2 · Hard skill mix</span>
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
                Category share of hard skills in demand
              </h2>
              <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
                Radar view of countries standardized (per 100) demand across all hard-skill categories.
              </p>
            </div>

            <div className="flex justify-content-center">
              <div className="min-h-[420px] min-w-0 flex w-full">
                <BenchmarkingFig5_2 selectedCountries={selectedCountries} />
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
                <span>Section 3 · Hard skill similarity</span>
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
                Hard skills: overlap and differentiation
              </h2>
              <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
                Top hard skills compared for standardized (per 100) demand in Counties.
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
                <span>Section 4 · Soft skill mix</span>
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
                Category share of soft skills in demand
              </h2>
              <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
                Radar view of countries standardized (per 100) demand across all soft-skill categories.
              </p>
            </div>

            <div className="flex justify-content-center">
              <div className="min-h-[420px] min-w-0 flex w-full">
                <BenchmarkingFig5_1 selectedCountries={selectedCountries} />
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
                <span>Section 5 · Soft skill similarity</span>
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
                Soft skills: overlap and differentiation
              </h2>
              <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
                Top soft skills compared for standardized (per 100) demand in countries.
              </p>
            </div>

            <div className="flex justify-content-center">
              <div className="min-h-[420px] min-w-0 flex w-full">
                <BenchmarkingFig3 />
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
                <span>Section 6 · Seniority pattern</span>
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
                Skill demand by hierarchy level
              </h2>
              <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
                Compare countries distribution of job hierarchy levels for the selected skill.
              </p>
            </div>

            <div className="flex justify-content-center">
              <div className="min-h-[420px] min-w-0 flex w-full">
                <BenchmarkingFig8 />
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
                <span>Section 7 · Shared-skill job titles</span>
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 text-center">
                Top titles linked to a shared skill
              </h2>
              <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
                Countries standardized (per 100) demand for the leading job titles associated with the chosen skill.
              </p>
            </div>

            <div className="flex justify-content-center">
              <div className="min-h-[420px] min-w-0 flex w-full">
                <BenchmarkingFig6 />
              </div>
            </div>
          </div>
        </section>

        
      </div>
    </div>
  );
};

export default Benchmarking;
