import React, { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";

const DefaultLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isGreenRoute = location.pathname.startsWith("/green");
  const isBenchmarkingRoute = location.pathname.startsWith("/benchmarking");
  const isHomeRoute = location.pathname === "/";

  const menuItems = useMemo(
    () => [
      {
        label: "Jobs Across ESCWA Countries",
        icon: "pi pi-fw pi-globe",
        command: () => navigate("/"),
        className: isHomeRoute
          ? "rounded-full bg-emerald-100/90 text-emerald-900 font-semibold shadow-sm shadow-emerald-300/70"
          : "",
      },
      {
        label: "Green Jobs",
        icon: "pi pi-fw pi-leaf",
        className: isGreenRoute
          ? "rounded-full bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-400/70"
          : "",
        items: [
          {
            label: "Overview in Arab Region",
            icon: "pi pi-chart-bar",
            command: () => navigate("/greenOverview"),
          },
          {
            label: "Explore Green Occupations",
            icon: "pi pi-search",
            command: () => navigate("/greenOccupations"),
          },
          {
            label: "Green Jobs in Energy Sector",
            icon: "pi pi-bolt",
            command: () => navigate("/greenInEnergySector"),
          },
        ],
      },

      {
        label: "Benchmarking",
        icon: "pi pi-fw pi-file",
        className: isBenchmarkingRoute
          ? "rounded-full bg-sky-500 text-white font-semibold shadow-sm shadow-sky-300/70"
          : "",
        items: [
          {
            label: "Occupational Demands",
            icon: "pi pi-chart-line",
            command: () => navigate("/benchmarkingOccupationalDemands"),
          },
          {
            label: "Quantifying Skill Similarity",
            icon: "pi pi-chart-pie",
            command: () => navigate("/benchmarSkillSimilarity"),
          },
          {
            label: "Occupational Pattern of Shared Skills",
            icon: "pi pi-chart-scatter",
            command: () => navigate("/benchmarkingOccupationalPattern"),
          }
        ],
      },
    ],
    [isHomeRoute, isGreenRoute, isBenchmarkingRoute, navigate]
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-slate-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col">
      {/* Sticky top bar */}
      <header className="sticky top-0 z-50 w-full border-b border-surface-200/70 dark:border-surface-800/80 bg-gradient-to-r from-emerald-50/95 via-white/95 to-sky-50/95 dark:from-slate-950/98 dark:via-slate-900/98 dark:to-slate-950/98 backdrop-blur">
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className="flex flex-col gap-2 py-2 sm:py-3">
            {/* Brand + context */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 shadow-sm shadow-emerald-500/30">
                  <i className="pi pi-chart-line text-sm" />
                </div>
                <div className="leading-tight">
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-emerald-700/80 dark:text-emerald-200/80 font-semibold">
                    ESCWA Skills Monitor
                  </p>
                  <p className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-50">
                    Green &amp; Energy Labour Insights
                  </p>
                </div>
              </div>

              {/* Route context pill (optional / nice touch) */}
              <div className="hidden sm:flex items-center gap-2 text-[0.7rem]">
                {isHomeRoute && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-emerald-900/70 px-3 py-1 text-emerald-800 dark:text-emerald-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold tracking-wide">
                      Regional jobs overview
                    </span>
                  </span>
                )}
                {isGreenRoute && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/90 px-3 py-1 text-emerald-50 shadow-sm shadow-emerald-500/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-ping" />
                    <span className="font-semibold tracking-wide">
                      Green jobs focus
                    </span>
                  </span>
                )}
                {isBenchmarkingRoute && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/90 px-3 py-1 text-sky-50 shadow-sm shadow-sky-400/60">
                    <i className="pi pi-sliders-h text-xs" />
                    <span className="font-semibold tracking-wide">
                      Benchmarking view
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Menubar */}
            <Menubar
              model={menuItems}
              className="
                app-menubar
                !border-none !rounded-full
                !bg-white/80 dark:!bg-slate-900/90
                shadow-sm shadow-slate-300/70 dark:shadow-black/40
                w-full justify-content-center
              "
            />
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex w-full mt-4 mb-8 px-2 sm:px-4">
        <div className="w-full max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;
