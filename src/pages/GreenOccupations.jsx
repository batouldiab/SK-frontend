// src/pages/GreenOverview.jsx
import React from "react";
import GreenFig3 from "../components/GreenFig3";
import GreenFig4 from "../components/GreenFig4";

const GreenOverview = () => {
  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="bg-white/70 dark:bg-slate-900/70 border border-surface-200 dark:border-surface-800 rounded-2xl px-4 py-3 shadow-sm">
        <h1 className="text-lg md:text-xl font-semibold mb-1">
          Green Occupations in the Arab Region
        </h1>
        <p className="text-xs md:text-sm text-color-secondary m-0">
          Overview of occupations labelled as green across ESCWA countries.
        </p>
      </div>

      {/* Charts grid */}
      <div className="flex flex-row flex-wrap gap-4">
        <GreenFig3 />
        <GreenFig4 />
        {/* <GreenFig4 /> */}
      </div>
    </div>
  );
};

export default GreenOverview;
