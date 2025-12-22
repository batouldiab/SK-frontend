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
              A consolidated view of occupational demand, skill similarity, and shared-skill patterns across country markets.
            </p>
            <div className="mt-3 p-3 bg-blue-50/60 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg">
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <i className="pi pi-info-circle text-blue-600 dark:text-blue-400 mr-2" />
                This analysis compares labour markets to identify skill gaps and future demand patterns. The United States serves as a reference point representing a more advanced, specialized, and innovation-driven labour market, providing insights into skills likely to gain prominence as economies diversify and modernize.
              </p>
            </div>
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

      <div className="grid gap-3 mb-4">
        <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-900/40">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300 mb-2">
            How to read & interact
          </p>
          <div className="text-xs md:text-sm text-slate-700 dark:text-slate-200 space-y-2">
            <p className="m-0">
              Each chart compares standardized values across the countries you toggle on above. Use the toggles under each chart title to show/hide countries; the legend colors and card accents always match.
            </p>
            <p className="m-0">
              When a section includes a selector (dropdown), pick a single title or skill to focus the comparison. Empty states remind you to select both a country and a title/skill to view the numbers.
            </p>
            <p className="m-0">
              Standardized demand values are expressed per 100 or per 1,000 online job ads (OJA), as indicated in each section subtitle and the drill-down description.
            </p>
          </div>
        </div>
      </div>

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
                Side-by-side country demand for the unified top job titles, expressed as standardized jobs per 1,000.
              </p>
              <div className="mt-2 p-3 bg-slate-100/70 dark:bg-slate-800/40 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <p className="text-[11px] md:text-xs text-slate-700 dark:text-slate-200 leading-relaxed m-0">
                  How to read: each bar/dot is standardized demand per 1,000 OJAs. Use the toggles under the chart to show/hide countries; legend colors match the bar/dot colors. Hover to see exact values.
                </p>
              </div>
              <div className="mt-3 p-3 bg-slate-50/60 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                  <strong className="text-slate-700 dark:text-slate-300">Key insight:</strong> Occupational demand patterns reveal structural differences between labour markets. Some economies show strong demand for digital and technology roles, while others prioritize service-oriented positions.
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Advanced economies typically exhibit higher demand for healthcare and social service professions, driven by aging populations and increased attention to mental health and community support services.
                </p>
              </div>
              <div className="mt-2 p-3 bg-amber-50/80 dark:bg-amber-900/30 rounded-lg border border-amber-200/60 dark:border-amber-800/60">
                <p className="text-xs text-amber-900 dark:text-amber-50 leading-relaxed">
                  <strong className="text-amber-900 dark:text-amber-100">Job title drill-down:</strong> The dedicated section below the chart lets you pick a single title (for example, "Commercial Director") and compare standardized demand per 1,000 jobs across the countries you have toggled on.
                </p>
              </div>
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
                Category count of hard skills in demand
              </h2>
              <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
                Radar view of countries standardized (per 100) demand across all hard-skill categories.
              </p>
              <div className="mt-2 p-3 bg-slate-100/70 dark:bg-slate-800/40 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <p className="text-[11px] md:text-xs text-slate-700 dark:text-slate-200 leading-relaxed m-0">
                  How to read: the toggle switches between Hard Skills Distribution (Top 10, ungrouped categories) and Hard Skills Group Distribution (all grouped categories). Each axis shows standardized demand per 100 OJAs; use the country toggles to add/remove lines and hover a vertex to see exact values.
                </p>
              </div>
              <div className="mt-2 p-3 bg-amber-50/80 dark:bg-amber-900/30 rounded-lg border border-amber-200/60 dark:border-amber-800/60">
                <p className="text-xs text-amber-900 dark:text-amber-50 leading-relaxed">
                  <strong className="text-amber-900 dark:text-amber-100">Category drill-down:</strong> Below this chart, a dedicated section lets you choose a hard-skill category and browse the underlying skills, subcategories, and standardized counts per country.
                </p>
              </div>
              <div className="mt-3 p-3 bg-slate-50/60 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong className="text-slate-700 dark:text-slate-300">Key insight:</strong> Hard skill profiles differ significantly across economies. The US emphasizes digital technologies (Python, SQL, machine learning) and healthcare competencies, while other economies may concentrate on business functions, civil/mechanical engineering for infrastructure projects, and hospitality operations.
                </p>
              </div>
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
                Top hard skills compared for standardized (per 1,000) demand in countries.
              </p>
              <div className="mt-2 p-3 bg-slate-100/70 dark:bg-slate-800/40 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <p className="text-[11px] md:text-xs text-slate-700 dark:text-slate-200 leading-relaxed m-0">
                  How to read: radar lines show standardized demand per 1,000 OJAs for the unified top hard skills. Use the toggles under the title to show/hide countries; hover points for values.
                </p>
              </div>
              <div className="mt-3 p-3 bg-slate-50/60 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                  <strong className="text-slate-700 dark:text-slate-300">Understanding skill similarity:</strong> While business-related skills (marketing, finance, project management, accounting) and basic ICT competencies (data analysis, computer science) appear across markets, the degree of similarity varies. Hard skills typically show more divergence than soft skills, reflecting differences in sectoral demands and economic structures.
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Job postings in advanced markets often list 2x more skills per posting (18+ vs 9+ skills), reflecting more specialized labour markets with granular skill definitions.
                </p>
              </div>
            </div>

            <div className="flex justify-content-center">
              <div className="min-h-[420px] min-w-0 flex w-full">
                <BenchmarkingFig4 selectedCountries={selectedCountries} />
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
                Category count of soft skills in demand
              </h2>
              <p className="text-xs md:text-sm text-slate-600/90 dark:text-slate-300/90 m-0 text-center">
                Radar view of countries standardized (per 100) demand across all soft-skill categories.
              </p>
              <div className="mt-2 p-3 bg-slate-100/70 dark:bg-slate-800/40 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <p className="text-[11px] md:text-xs text-slate-700 dark:text-slate-200 leading-relaxed m-0">
                  How to read: use the toggle to swap between Soft Skills Distribution (Top 5, ungrouped categories) and Soft Skills Group Distribution (all grouped categories). Axes show standardized demand per 100 OJAs; country toggles control which lines appear, and hovering reveals values per category.
                </p>
              </div>
              <div className="mt-2 p-3 bg-amber-50/80 dark:bg-amber-900/30 rounded-lg border border-amber-200/60 dark:border-amber-800/60">
                <p className="text-xs text-amber-900 dark:text-amber-50 leading-relaxed">
                  <strong className="text-amber-900 dark:text-amber-100">Category drill-down:</strong> The section beneath this chart lets you pick a soft-skill category and review its skill list, subcategories, and standardized counts across countries you’ve toggled on.
                </p>
              </div>
              <div className="mt-3 p-3 bg-slate-50/60 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong className="text-slate-700 dark:text-slate-300">Key insight:</strong> Soft skill composition reveals market maturity. While operational competencies (budgeting, administrative support, quality control) are common across markets, advanced economies increasingly prioritize emotional intelligence and higher-order cognitive skills that support innovation and human-centric work.
                </p>
              </div>
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
                Top soft skills compared for standardized (per 1,000) demand in countries.
              </p>
              <div className="mt-2 p-3 bg-slate-100/70 dark:bg-slate-800/40 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <p className="text-[11px] md:text-xs text-slate-700 dark:text-slate-200 leading-relaxed m-0">
                  How to read: radar lines show standardized demand per 1,000 OJAs for the unified top soft skills. Use the toggles under the title to show/hide countries; hover points for the exact standardized counts.
                </p>
              </div>
              <div className="mt-3 p-3 bg-slate-50/60 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                  <strong className="text-slate-700 dark:text-slate-300">Shared foundations with frontier gaps:</strong> Top soft skills usually overlap more between markets than hard skills, showing higher transferability.
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Advanced markets uniquely demand emotional intelligence skills (compassion, empathy, honesty, critical thinking) essential for leadership, teamwork, and resilience—skills that may be underrepresented in operational-focused economies.
                </p>
              </div>
            </div>

            <div className="flex justify-content-center">
              <div className="min-h-[420px] min-w-0 flex w-full">
                <BenchmarkingFig3 selectedCountries={selectedCountries} />
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
              <div className="mt-2 p-3 bg-slate-100/70 dark:bg-slate-800/40 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <p className="text-[11px] md:text-xs text-slate-700 dark:text-slate-200 leading-relaxed m-0">
                  How to read: bars show the count of postings by hierarchy level for the chosen skill. Use the skill selector in the shared-skills section to change the focal skill; toggles control which countries appear.
                </p>
              </div>
              <div className="mt-3 p-3 bg-slate-50/60 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong className="text-slate-700 dark:text-slate-300">Occupational distribution patterns:</strong> Shared skills distribute differently across job hierarchies. Advanced markets spread skills across diverse occupational categories (Managers, Professionals, Technicians, Clerical Workers), while other markets may concentrate skills heavily in business-related managerial and professional roles, reflecting different labour market structures.
                </p>
              </div>
            </div>

            <div className="flex justify-content-center">
              <div className="min-h-[420px] min-w-0 flex w-full">
                <BenchmarkingFig8 selectedCountries={selectedCountries} />
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
              <div className="mt-2 p-3 bg-slate-100/70 dark:bg-slate-800/40 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <p className="text-[11px] md:text-xs text-slate-700 dark:text-slate-200 leading-relaxed m-0">
                  How to read: bars show standardized demand per 100 OJAs for top job titles tied to the selected shared skill. Use the skill selector in the shared-skills section to switch the skill; toggles control which countries display.
                </p>
              </div>
              <div className="mt-3 p-3 bg-slate-50/60 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                  <strong className="text-slate-700 dark:text-slate-300">How shared skills translate into jobs:</strong> Even when countries share core skills, they embed them in different occupational roles.
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Innovation-driven markets associate these skills with specialized technical roles (cloud engineer, software developer, ICT intelligent systems designer), while operational-focused economies tie them to managerial and support positions (audit supervisor, ICT help desk manager, financial manager), reflecting supportive rather than pioneering digital economy roles.
                </p>
              </div>
            </div>

            <div className="flex justify-content-center">
              <div className="min-h-[420px] min-w-0 flex w-full">
                <BenchmarkingFig6 selectedCountries={selectedCountries} />
              </div>
            </div>
          </div>
        </section>

        
      </div>
    </div>
  );
};

export default Benchmarking;
