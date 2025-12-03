import React from "react";

const PageHeader = () => (
  <header className="page-hero">
    <div className="page-hero__eyebrow">
      <span className="inline-flex h-2 w-2 rounded-full bg-[var(--theme-accent)] shadow-sm shadow-[var(--theme-accent-soft)]" />
      Jobs across ESCWA countries
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
      <div>
        <h1 className="page-hero__title">Job Posts &amp; Skills Atlas</h1>
        <p className="page-hero__meta">
          Navigate live postings, skills clusters, and coverage across the region.
        </p>
      </div>
      <span className="badge-soft">
        <i className="pi pi-map-marker" />
        Interactive map
      </span>
    </div>
  </header>
);

export default PageHeader;
