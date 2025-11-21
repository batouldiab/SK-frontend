// src/pages/GreenInEnergySector.jsx
import React from "react";
import GreenFig3 from "../components/GreenFig3";
import GreenFig4 from "../components/GreenFig4";
import GreenFig6 from "../components/GreenFig6";
import GreenFig7 from "../components/GreenFig7";

const GreenInEnergySector = () => {
  return (
    <div className="space-y-4">
        <div className="card surface-card shadow-2 border-round-xl p-4">
            <div className="bg-white/70 dark:bg-slate-900/70 border border-surface-200 dark:border-surface-800 rounded-2xl px-4 py-3 shadow-sm">
                <h1 className="text-lg md:text-xl font-semibold mb-1">
                Green Occupations in Energy Sector
                </h1>
                <p className="text-xs md:text-sm text-color-secondary m-0">
                Overview of energy sector occupations labelled as green across ESCWA countries.
                </p>
            </div>

            {/* Charts grid */}
            <div className="flex flex-col flex-wrap gap-4">
                <GreenFig6 className="w-[50%]" />
                <GreenFig7 className="w-[50%]" />
                {/* <GreenFig4 /> */}
            </div>
        </div>
        <div className="card surface-card shadow-2 border-round-xl p-4">
            <div className="bg-white/70 dark:bg-slate-900/70 border border-surface-200 dark:border-surface-800 rounded-2xl px-4 py-3 shadow-sm">
                <h1 className="text-lg md:text-xl font-semibold mb-1">
                Green Jobs in Energy Sector Across ESCWA Countries
                </h1>
                <p className="text-xs md:text-sm text-color-secondary m-0">
                Overview of energy sector jobs labelled as green across ESCWA countries.
                </p>
            </div>

            {/* Charts grid */}
            <div className="flex flex-col flex-wrap gap-4">
                <GreenFig3 />
                <GreenFig4 />
                {/* <GreenFig4 /> */}
            </div>
        </div>
    </div>
  );
};

export default GreenInEnergySector;
