import React, { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";

const themeTokens = {
  purple: {
    accent: "#8b5cf6",
    accentStrong: "#6d28d9",
    accentSoft: "rgba(139, 92, 246, 0.14)",
    surface: "rgba(255,255,255,0.9)",
    surfaceBorder: "rgba(139,92,246,0.18)",
    shadow: "0 24px 80px rgba(139,92,246,0.18)",
    veilFrom: "rgba(139,92,246,0.16)",
    veilTo: "rgba(79,70,229,0.14)",
  },
  green: {
    accent: "#0ea36d",
    accentStrong: "#047857",
    accentSoft: "rgba(16,185,129,0.16)",
    surface: "rgba(255,255,255,0.92)",
    surfaceBorder: "rgba(16,185,129,0.16)",
    shadow: "0 24px 80px rgba(16,185,129,0.18)",
    veilFrom: "rgba(16,185,129,0.16)",
    veilTo: "rgba(14,165,233,0.12)",
  },
  blue: {
    accent: "#0ea5e9",
    accentStrong: "#0369a1",
    accentSoft: "rgba(14,165,233,0.14)",
    surface: "rgba(255,255,255,0.9)",
    surfaceBorder: "rgba(14,165,233,0.16)",
    shadow: "0 24px 80px rgba(14,165,233,0.2)",
    veilFrom: "rgba(56,189,248,0.16)",
    veilTo: "rgba(14,165,233,0.12)",
  },
};

const DefaultLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const isGreenRoute = path.includes("green");
  const isBenchmarkingRoute = path.includes("bench");
  const isHomeRoute = path === "/";

  const themeKey = isGreenRoute ? "green" : isBenchmarkingRoute ? "blue" : "purple";
  const theme = themeTokens[themeKey];

  const menuItems = useMemo(
    () => [
      {
        label: "Jobs Across ESCWA Countries",
        icon: "pi pi-fw pi-globe",
        command: () => navigate("/"),
        className: isHomeRoute ? "menu-accent" : "",
      },
      {
        label: "Green Jobs",
        icon: "pi pi-fw pi-leaf",
        className: isGreenRoute ? "menu-accent" : "",
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
        icon: "pi pi-fw pi-sliders-h",
        className: isBenchmarkingRoute ? "menu-accent" : "",
        command: () => navigate("/benchmarking"),
      },
    ],
    [isHomeRoute, isGreenRoute, isBenchmarkingRoute, navigate]
  );

  return (
    <div
      className={`theme-shell theme-${themeKey} w-full flex flex-col`}
      style={{
        "--theme-accent": theme.accent,
        "--theme-accent-strong": theme.accentStrong,
        "--theme-accent-soft": theme.accentSoft,
        "--theme-surface": theme.surface,
        "--theme-surface-border": theme.surfaceBorder,
        "--theme-shadow-soft": theme.shadow,
        "--theme-veil-from": theme.veilFrom,
        "--theme-veil-to": theme.veilTo,
      }}
    >
      <div className="theme-veil" aria-hidden />
      <div className="theme-noise" aria-hidden />

      {/* Sticky top bar */}
      <header className="shell-header sticky top-0 z-50 w-full">
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <div className="flex flex-col gap-2 py-3 sm:py-4">
            {/* Brand + context */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-md"
                  style={{
                    background: theme.accentSoft,
                    color: theme.accentStrong,
                    boxShadow: `0 12px 30px ${theme.accentSoft}`,
                  }}
                >
                  <i className="pi pi-chart-line text-sm" />
                </div>
                <div className="leading-tight">
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] font-semibold text-slate-200/80">
                    ESCWA Skills Monitor
                  </p>
                  <p className="text-sm md:text-base font-semibold text-white">
                    Region-wide labour intelligence
                  </p>
                </div>
              </div>

              {/* Route context pill */}
              <div className="flex items-center gap-2 text-[0.75rem]">
                {(isHomeRoute || isGreenRoute || isBenchmarkingRoute) && (
                  <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 glass-panel text-xs font-semibold" style={{ color: theme.accentStrong }}>
                    <span
                      className="h-1.5 w-1.5 rounded-full animate-pulse"
                      style={{ background: theme.accent }}
                    />
                    {isHomeRoute && "Jobs across ESCWA countries"}
                    {isGreenRoute && "Green jobs focus"}
                    {isBenchmarkingRoute && "Benchmarking view"}
                  </span>
                )}
              </div>
            </div>

            {/* Menubar */}
            <Menubar model={menuItems} className="app-menubar w-full justify-content-center" />
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex w-full mt-4 mb-10 px-3 sm:px-4">
        <div className="w-full max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;
