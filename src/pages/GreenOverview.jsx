// src/pages/GreenOverview.jsx
import React from "react";
import GreenFig1 from "../components/GreenFig1";
import GreenFig2 from "../components/GreenFig2";

const GreenOverview = () => {
  return (
    <div className="page-grid">
      <div className="page-hero">
        <div className="page-hero__eyebrow">
          <i className="pi pi-leaf text-xs" />
          Green jobs
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
          <div>
            <h1 className="page-hero__title">Green Jobs in the Arab Region</h1>
            <p className="page-hero__meta">
              Overview of green labour demand over time and across ESCWA countries.
            </p>
          </div>
          <span className="badge-soft">
            <i className="pi pi-bolt" />
            Updated insights
          </span>
        </div>
      </div>

      <div className="page-panel grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GreenFig1 />
        <GreenFig2 />
      </div>
    </div>
  );
};

export default GreenOverview;
