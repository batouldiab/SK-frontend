// src/pages/GreenOverview.jsx
import React from "react";
import GreenFig3 from "../components/GreenFig3";
import GreenFig4 from "../components/GreenFig4";

const GreenOverview = () => {
  return (
    <div className="page-grid">
      <div className="page-hero">
        <div className="page-hero__eyebrow">
          <i className="pi pi-briefcase text-xs" />
          Occupations
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
          <div>
            <h1 className="page-hero__title">Green Occupations in the Arab Region</h1>
            <p className="page-hero__meta">
              Overview of occupations labelled as green across ESCWA countries.
            </p>
          </div>
          <span className="badge-soft">
            <i className="pi pi-sparkles" />
            Dual market view
          </span>
        </div>
      </div>

      <div className="page-panel grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GreenFig3 />
        <GreenFig4 />
      </div>
    </div>
  );
};

export default GreenOverview;
