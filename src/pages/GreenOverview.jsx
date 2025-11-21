// src/pages/GreenOverview.jsx
import React from "react";
import GreenFig1 from "../components/GreenFig1";
import GreenFig2 from "../components/GreenFig2";

const GreenOverview = () => {
  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="bg-white/70 dark:bg-slate-900/70 border border-surface-200 dark:border-surface-800 rounded-2xl px-4 py-3 shadow-sm">
        <h1 className="text-lg md:text-xl font-semibold mb-1">
          Green Jobs in the Arab Region
        </h1>
        <p className="text-xs md:text-sm text-color-secondary m-0">
          Overview of green labour demand over time and across ESCWA countries.
        </p>
      </div>

      {/* Charts grid */}
      <div className="flex flex-row flex-wrap gap-4">
        <GreenFig1 />
        <GreenFig2 />
      </div>
    </div>
  );
};

export default GreenOverview;
