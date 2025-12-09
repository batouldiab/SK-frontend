// BenchmarkingFig1Fig2.jsx - AgCharts combination chart with dots (US) and bars (countries)
import React, { useState, useEffect, useMemo } from "react";
import { AgCharts } from "ag-charts-react";
import { Dropdown } from "primereact/dropdown";

const DISPLAY_SCALE = 10; // show values per 1000 jobs

// Color palette - refined and distinctive
const COLORS = {
  us: "#1a1a2e",           // Deep navy for US dots
  uae: "#1E88E5",          // Vibrant blue for UAE bars
  qatar: "#0f3460",        // Deep blue for potential Qatar
  saudiArabia: "#16c79a",  // Teal for potential Saudi Arabia
  background: "#fafafa",
  text: "#2d2d2d",
  gridLine: "#e0e0e0",
};

const dropdownPerfProps = {
  filter: true,
  filterDelay: 120,
  resetFilterOnHide: true,
  virtualScrollerOptions: { itemSize: 38, showLoader: true },
  scrollHeight: "260px",
};

const BenchmarkingFig1Fig2 = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [unifiedTopJobs, setUnifiedTopJobs] = useState([]);
  const [allJobsData, setAllJobsData] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // Dataset visibility toggles
  const [showUAE, setShowUAE] = useState(true);
  const [showUS, setShowUS] = useState(true);

  // Load CSV data once
  useEffect(() => {
    const loadCsv = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/data/benchmarking_fig1_2.csv");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        const lines = text.trim().split(/\r?\n/);

        if (lines.length < 2) {
          throw new Error("CSV file appears to be empty");
        }

        const headerLine = lines[0];
        const delimiter = headerLine.includes("\t") ? "\t" : ",";
        const rows = lines.slice(1);

        const allJobData = [];

        rows.forEach((line) => {
          if (!line.trim()) return;
          const cols = line.split(delimiter);
          if (cols.length < 5) return;

          const jobTitle = cols[0].trim();
          const uaePercent = parseFloat(cols[2].trim());
          const usPercent = parseFloat(cols[4].trim());
          const uaeCount = parseFloat(cols[1].trim());
          const usCount = parseFloat(cols[3].trim());

          if (
            !jobTitle ||
            isNaN(uaePercent) ||
            isNaN(usPercent) ||
            isNaN(uaeCount) ||
            isNaN(usCount)
          )
            return;

          allJobData.push({ jobTitle, uaePercent, usPercent, uaeCount, usCount });
        });

        if (allJobData.length === 0) {
          throw new Error("No valid data found in CSV");
        }

        // Build unified top jobs (US driven first)
        const sortedByUAE = [...allJobData].sort((a, b) => b.uaePercent - a.uaePercent);
        const sortedByUS = [...allJobData].sort((a, b) => b.usPercent - a.usPercent);

        const uaeTop10 = sortedByUAE.slice(0, 10);
        const usTop10 = sortedByUS.slice(0, 10);

        const unified = [...usTop10];
        const unifiedNames = new Set(usTop10.map((item) => item.jobTitle));

        uaeTop10.forEach((job) => {
          if (!unifiedNames.has(job.jobTitle)) {
            unifiedNames.add(job.jobTitle);
            unified.push(job);
          }
        });

        setUnifiedTopJobs(unified);
        setRawData({
          jobTitles: unified.map((d) => d.jobTitle),
          uaePercentages: unified.map((d) => d.uaePercent),
          usPercentages: unified.map((d) => d.usPercent),
        });

        setAllJobsData(allJobData);
        setSelectedJob(allJobData[0]);
      } catch (err) {
        console.error("Error loading CSV:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadCsv();
  }, []);

  // Prepare chart data for AgCharts
  const chartData = useMemo(() => {
    if (!rawData) return [];

    return rawData.jobTitles.map((jobTitle, index) => ({
      jobTitle,
      uaeValue: rawData.uaePercentages[index] * DISPLAY_SCALE,
      usValue: rawData.usPercentages[index] * DISPLAY_SCALE,
      // For scatter positioning, we use the index as x-coordinate
      xIndex: index,
    }));
  }, [rawData]);

  // Calculate max value for axis scaling
  const maxValue = useMemo(() => {
    if (!rawData) return 10;
    const allValues = [
      ...rawData.uaePercentages.map((v) => v * DISPLAY_SCALE),
      ...rawData.usPercentages.map((v) => v * DISPLAY_SCALE),
    ];
    return Math.ceil(Math.max(...allValues) * 1.15);
  }, [rawData]);

  // Build AgCharts options
  const chartOptions = useMemo(() => {
    if (!rawData) return {};

    const series = [];

    // UAE bars (and potentially other countries as additional bar series)
    if (showUAE) {
      series.push({
        type: "bar",
        xKey: "jobTitle",
        yKey: "uaeValue",
        yName: "UAE",
        fill: COLORS.uae,
        stroke: COLORS.uae,
        strokeWidth: 0,
        cornerRadius: 4,
        tooltip: {
          renderer: ({ datum, yKey }) => ({
            content: `UAE: ${datum[yKey].toFixed(2)} per 1000 jobs`,
          }),
        },
      });
    }

    // US scatter points (dots)
    if (showUS) {
      series.push({
        type: "scatter",
        xKey: "jobTitle",
        yKey: "usValue",
        title: "US",
        marker: {
          fill: COLORS.us,
          stroke: "#ffffff",
          strokeWidth: 2,
          size: 14,
          shape: "circle",
        },
        tooltip: {
          renderer: ({ datum }) => ({
            content: `US: ${datum.usValue.toFixed(2)} per 1000 jobs`,
          }),
        },
      });
    }

    return {
      data: chartData,
      title: {
        text: "Job Title Distribution: UAE vs US",
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.text,
      },
      subtitle: {
        text: "Standardized demand per 1,000 online job advertisements",
        fontFamily: "'DM Sans', -apple-system, sans-serif",
        fontSize: 13,
        color: "#666666",
      },
      series,
      axes: [
        {
          type: "category",
          position: "bottom",
          label: {
            rotation: -35,
            fontFamily: "'DM Sans', -apple-system, sans-serif",
            fontSize: 11,
            color: COLORS.text,
            formatter: ({ value }) =>
              value.length > 25 ? value.substring(0, 22) + "..." : value,
          },
          line: {
            stroke: COLORS.gridLine,
          },
          gridLine: {
            enabled: false,
          },
        },
        {
          type: "number",
          position: "left",
          title: {
            text: "Jobs per 1,000 OJA",
            fontFamily: "'DM Sans', -apple-system, sans-serif",
            fontSize: 12,
            color: COLORS.text,
          },
          min: 0,
          max: maxValue,
          label: {
            fontFamily: "'DM Sans', -apple-system, sans-serif",
            fontSize: 11,
            color: "#666666",
            formatter: ({ value }) => value.toFixed(1),
          },
          gridLine: {
            style: [
              {
                stroke: COLORS.gridLine,
                lineDash: [4, 4],
              },
            ],
          },
        },
      ],
      legend: {
        position: "bottom",
        item: {
          marker: {
            shape: "circle",
            size: 10,
          },
          label: {
            fontFamily: "'DM Sans', -apple-system, sans-serif",
            fontSize: 13,
            color: COLORS.text,
          },
          paddingX: 24,
        },
      },
      background: {
        fill: COLORS.background,
      },
      padding: {
        top: 20,
        right: 30,
        bottom: 20,
        left: 20,
      },
    };
  }, [rawData, chartData, maxValue, showUAE, showUS]);

  // Statistics calculations
  const stats = useMemo(() => {
    if (!unifiedTopJobs.length) return { uaeAvg: 0, usAvg: 0, totalJobs: 0 };

    const uaeAvg =
      unifiedTopJobs.reduce((sum, job) => sum + job.uaePercent, 0) /
      unifiedTopJobs.length;
    const usAvg =
      unifiedTopJobs.reduce((sum, job) => sum + job.usPercent, 0) /
      unifiedTopJobs.length;

    return {
      uaeAvg: uaeAvg * DISPLAY_SCALE,
      usAvg: usAvg * DISPLAY_SCALE,
      totalJobs: unifiedTopJobs.length,
    };
  }, [unifiedTopJobs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">Loading chart data…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Job Title Distribution: UAE vs US
        </h3>
        <p className="text-blue-600">Error loading chart data: {error}</p>
      </div>
    );
  }

  if (!rawData) return null;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-full">
      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            Job Titles (Chart)
          </p>
          <p className="text-2xl font-bold text-slate-800">{stats.totalJobs}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
            Avg. UAE Job Count per 1000 OJA
          </p>
          <p className="text-2xl font-bold text-blue-700">
            {stats.uaeAvg.toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl">
          <p className="text-xs font-medium text-slate-300 uppercase tracking-wide mb-1">
            Avg. US Job Count per 1000 OJA
          </p>
          <p className="text-2xl font-bold text-white">{stats.usAvg.toFixed(2)}</p>
        </div>
      </div>

      {/* Dataset toggles */}
      <div className="flex items-center gap-6 mb-4 pb-4 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-600">Show datasets:</span>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showUAE}
            onChange={(e) => setShowUAE(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded"
              style={{ backgroundColor: COLORS.uae }}
            ></span>
            <span className="text-sm text-gray-700">UAE (bars)</span>
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showUS}
            onChange={(e) => setShowUS(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-slate-700 focus:ring-slate-500"
          />
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.us }}
            ></span>
            <span className="text-sm text-gray-700">US (dots)</span>
          </span>
        </label>
      </div>

      {/* Chart area */}
      <div className="h-[420px] mb-2">
        <AgCharts className="h-full" options={chartOptions} />
      </div>

      <p className="text-xs text-gray-400 text-center mb-6">
        Values shown: jobs per 1000 in the market | Bars = UAE | Dots = US
      </p>

      {/* Job selector & comparison */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">
          Compare standardized demand for a selected job title (per 1000 jobs in
          the country market)
        </h4>

        <Dropdown
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.value)}
          options={allJobsData}
          optionLabel="jobTitle"
          placeholder="Select a job title"
          className="w-full md:w-80 mb-4"
          showClear
          {...dropdownPerfProps}
        />

        {selectedJob && (
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
                UAE standardized
              </p>
              <p className="text-xl font-bold text-blue-700">
                {(selectedJob.uaePercent * DISPLAY_SCALE).toFixed(2)}
              </p>
            </div>
            <div className="flex-1 min-w-[200px] p-4 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl">
              <p className="text-xs font-medium text-slate-300 uppercase tracking-wide mb-1">
                US standardized
              </p>
              <p className="text-xl font-bold text-white">
                {(selectedJob.usPercent * DISPLAY_SCALE).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BenchmarkingFig1Fig2;