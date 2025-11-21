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
          ? "bg-primary-50 text-primary-700 font-semibold"
          : "",
      },
      {
        label: "Green Jobs",
        icon: "pi pi-fw pi-leaf",
        className: isGreenRoute
          ? "bg-primary-50 text-primary-700 font-semibold"
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
          ? "bg-primary-50 text-primary-700 font-semibold"
          : "",
        items: [
          {
            label: "Reports",
            icon: "pi pi-chart-line",
            command: () => navigate("/benchmarking"),
          },
          {
            label: "Analytics",
            icon: "pi pi-chart-pie",
            command: () => navigate("/benchmarking"),
          },
        ],
      },
    ],
    [isHomeRoute, isGreenRoute, isBenchmarkingRoute, navigate]
  );

  return (
    <div className="min-h-screen w-full bg-surface-50 dark:bg-slate-900 px-2 py-2 flex flex-col">
      {/* Sticky top bar */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-surface-200 dark:border-surface-800 w-full shadow-sm">
        <Menubar
          model={menuItems}
          className="
            !border-none !rounded-none !bg-transparent
            w-full
            justify-content-center
          "
        />
      </header>

      {/* Page content */}
      <main className="flex w-full mt-3">
        <Outlet />
      </main>
    </div>
  );
};

export default DefaultLayout;
