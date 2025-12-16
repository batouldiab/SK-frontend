// BenchmarkingFig1Fig2.jsx - AgCharts combination chart driven by selected countries
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AgCharts } from "ag-charts-react";
import { Dropdown } from "primereact/dropdown";

const DISPLAY_SCALE = 10; // show values per 1000 jobs
const COUNTRY_ALIASES = { "United States": "US" };
const EXCLUDED_TITLE_PATTERN = /r\u00e9p\u00e9titeur/i;

const COUNTRY_COLORS = {
  US: "#1a1a2e",
  "United Arab Emirates": "#1E88E5",
  Qatar: "#0f3460",
  "Saudi Arabia": "#16c79a",
};

const FALLBACK_COLORS = [
  "#1E88E5",
  "#16c79a",
  "#8e24aa",
  "#fb8c00",
  "#43a047",
  "#3949ab",
  "#e53935",
  "#00897b",
];

const dropdownPerfProps = {
  filter: true,
  filterDelay: 120,
  resetFilterOnHide: true,
  virtualScrollerOptions: { itemSize: 38, showLoader: true },
  scrollHeight: "260px",
};

const toCsvKey = (displayName) => COUNTRY_ALIASES[displayName] || displayName;

// Minimal delimiter-aware CSV line parser that respects quoted fields
const parseDelimitedLine = (line, delimiter) => {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      // Toggle quote state unless escaped by another quote
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
};

const BenchmarkingFig1Fig2 = ({ selectedCountries = [] }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countryColumns, setCountryColumns] = useState([]);
  const [allJobsData, setAllJobsData] = useState([]);
  const [unifiedTopJobs, setUnifiedTopJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [datasetVisibility, setDatasetVisibility] = useState({});

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
        const headers = parseDelimitedLine(headerLine, delimiter).map((h) => h.trim());

        const countryCols = [];
        for (let i = 1; i < headers.length; i += 2) {
          const countHeader = headers[i];
          const percentHeader = headers[i + 1];
          if (!countHeader || !percentHeader) continue;

          const countCountry = countHeader.replace(/ Count$/i, "").trim();
          const percentCountry = percentHeader
            .replace(/Standardized Percentage\s*/i, "")
            .trim();
          const countryName = percentCountry || countCountry;

          countryCols.push({
            countryName,
            countIndex: i,
            percentIndex: i + 1,
          });
        }

        const allJobData = [];

        rows.forEach((line) => {
          if (!line.trim()) return;
          const cols = parseDelimitedLine(line, delimiter);
          if (cols.length < 2) return;

          const jobTitle = cols[0].trim();
          if (!jobTitle || EXCLUDED_TITLE_PATTERN.test(jobTitle)) return;

          const values = {};
          const counts = {};

          countryCols.forEach((col) => {
            const countVal = parseFloat((cols[col.countIndex] || "").trim());
            const percentVal = parseFloat((cols[col.percentIndex] || "").trim());

            if (!Number.isNaN(countVal)) {
              counts[col.countryName] = countVal;
            }
            if (!Number.isNaN(percentVal)) {
              values[col.countryName] = percentVal;
            }
          });

          allJobData.push({ jobTitle, values, counts });
        });

        if (allJobData.length === 0) {
          throw new Error("No valid data found in CSV");
        }

        setCountryColumns(countryCols);
        setAllJobsData(allJobData);
        setUnifiedTopJobs(allJobData.slice(0, 1)); // initialize to avoid empty state flicker
        setSelectedJob(allJobData[0] || null);
      } catch (err) {
        console.error("Error loading CSV:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadCsv();
  }, []);

  // Map selectedCountries from parent -> CSV keys present in the data
  const selectedCountryConfigs = useMemo(
    () =>
      selectedCountries
        .map((name) => ({
          displayName: name,
          csvKey: toCsvKey(name),
        }))
        .filter((cfg) => countryColumns.some((c) => c.countryName === cfg.csvKey)),
    [selectedCountries, countryColumns]
  );

  const visibleCountries = useMemo(
    () => selectedCountryConfigs.filter((cfg) => datasetVisibility[cfg.csvKey]),
    [selectedCountryConfigs, datasetVisibility]
  );

  // Keep dataset visibility in sync with incoming selections
  useEffect(() => {
    setDatasetVisibility((prev) => {
      const next = {};
      selectedCountryConfigs.forEach((cfg) => {
        next[cfg.csvKey] = prev[cfg.csvKey] ?? true;
      });
      return next;
    });
  }, [selectedCountryConfigs]);

  // Build the unified top jobs union across selected countries (top 10 per country)
  useEffect(() => {
    if (!allJobsData.length || !visibleCountries.length) {
      setUnifiedTopJobs([]);
      return;
    }

    const union = new Map();
    visibleCountries.forEach(({ csvKey }) => {
      const sorted = [...allJobsData]
        .filter((job) => job.values[csvKey] !== undefined)
        .sort((a, b) => (b.values[csvKey] || 0) - (a.values[csvKey] || 0))
        .slice(0, 10);

      sorted.forEach((job) => {
        if (!union.has(job.jobTitle)) {
          union.set(job.jobTitle, job);
        }
      });
    });

    const orderedJobs = Array.from(union.values()).sort((a, b) => {
      for (let i = 0; i < visibleCountries.length; i += 1) {
        const key = visibleCountries[i].csvKey;
        const diff = (b.values[key] || 0) - (a.values[key] || 0);
        if (Math.abs(diff) > 1e-12) return diff;
      }
      return a.jobTitle.localeCompare(b.jobTitle);
    });

    setUnifiedTopJobs(orderedJobs);
  }, [allJobsData, visibleCountries]);

  // Prepare chart data for AgCharts
  const chartData = useMemo(() => {
    if (!unifiedTopJobs.length) return [];

    return unifiedTopJobs.map((job) => {
      const row = { jobTitle: job.jobTitle };
      selectedCountryConfigs.forEach(({ csvKey }) => {
        const value = job.values[csvKey];
        if (typeof value === "number") {
          row[csvKey] = value * DISPLAY_SCALE;
        }
      });
      return row;
    });
  }, [unifiedTopJobs, selectedCountryConfigs]);

  // Calculate max value for axis scaling
const maxValue = useMemo(() => {
    if (!chartData.length) return 10;

    const allValues = [];
    chartData.forEach((row) => {
      visibleCountries.forEach(({ csvKey }) => {
        if (typeof row[csvKey] === "number") {
          allValues.push(row[csvKey]);
        }
      });
    });

    if (!allValues.length) return 10;
    return Math.ceil(Math.max(...allValues) * 1.15);
}, [chartData, visibleCountries]);

  const countryColorMap = useMemo(() => {
    const map = {};
    selectedCountryConfigs.forEach((cfg, index) => {
      map[cfg.csvKey] =
        COUNTRY_COLORS[cfg.csvKey] ||
        COUNTRY_COLORS[cfg.displayName] ||
        FALLBACK_COLORS[index % FALLBACK_COLORS.length];
    });
    return map;
  }, [selectedCountryConfigs]);

  const getCountryColor = useCallback(
    (country) =>
      countryColorMap[country.csvKey] ||
      COUNTRY_COLORS[country.displayName] ||
      FALLBACK_COLORS[
        (selectedCountryConfigs.findIndex((cfg) => cfg.csvKey === country.csvKey) +
          FALLBACK_COLORS.length) %
          FALLBACK_COLORS.length
      ],
    [countryColorMap, selectedCountryConfigs]
  );

  // Build AgCharts options
  const chartOptions = useMemo(() => {
    if (!chartData.length) return {};

    const series = visibleCountries.map((country) => {
      const color = getCountryColor(country);
      const isUS = country.csvKey === "US";

      if (isUS) {
        return {
          type: "scatter",
          xKey: "jobTitle",
          yKey: country.csvKey,
          title: country.displayName,
          marker: {
            fill: color,
            stroke: "#ffffff",
            strokeWidth: 2,
            size: 14,
            shape: "circle",
          },
          tooltip: {
            renderer: ({ datum, yKey }) => ({
              content: `${country.displayName}: ${datum[yKey].toFixed(2)} per 1000 jobs`,
            }),
          },
        };
      }

      return {
        type: "bar",
        xKey: "jobTitle",
        yKey: country.csvKey,
        yName: country.displayName,
        fill: color,
        stroke: color,
        strokeWidth: 0,
        cornerRadius: 4,
        tooltip: {
          renderer: ({ datum, yKey }) => ({
            content: `${country.displayName}: ${datum[yKey].toFixed(2)} per 1000 jobs`,
          }),
        },
      };
    });

    return {
      data: chartData,
      title: {
        text: "Job title distribution",
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 22,
        fontWeight: "bold",
        color: "#2d2d2d",
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
            color: "#2d2d2d",
            formatter: ({ value }) =>
              value.length > 25 ? `${value.substring(0, 22)}...` : value,
          },
          line: {
            stroke: "#e0e0e0",
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
            color: "#2d2d2d",
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
                stroke: "#e0e0e0",
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
            color: "#2d2d2d",
          },
          paddingX: 24,
        },
      },
      background: {
        fill: "#fafafa",
      },
      padding: {
        top: 20,
        right: 30,
        bottom: 20,
        left: 20,
      },
    };
  }, [chartData, visibleCountries, maxValue, getCountryColor]);

  // Statistics calculations
  const stats = useMemo(() => {
    if (!unifiedTopJobs.length) return { averages: [], totalJobs: 0 };

    const averages = visibleCountries.map((country) => {
      const values = unifiedTopJobs
        .map((job) => job.values[country.csvKey])
        .filter((val) => typeof val === "number" && !Number.isNaN(val));

      const avg =
        values.length === 0
          ? 0
          : (values.reduce((sum, val) => sum + val, 0) / values.length) *
            DISPLAY_SCALE;

      return {
        ...country,
        avg,
      };
    });

    return {
      averages,
      totalJobs: unifiedTopJobs.length,
    };
  }, [unifiedTopJobs, visibleCountries]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">Loading chart data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Job title distribution
        </h3>
        <p className="text-blue-600">Error loading chart data: {error}</p>
      </div>
    );
  }

  const hasChartData = chartData.length > 0 && visibleCountries.length > 0;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-full">
      {/* Statistics cards */}
      <div
        className="grid gap-4 mb-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}
      >
        <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            Job titles (chart)
          </p>
          <p className="text-2xl font-bold text-slate-800">{stats.totalJobs}</p>
        </div>
        {stats.averages.map((stat) => {
          const color = getCountryColor(stat);
          return (
            <div
              key={stat.csvKey}
              className="p-4 rounded-xl border"
              style={{
                borderColor: color,
                background:
                  stat.csvKey === "US"
                    ? "linear-gradient(135deg, #1f2937, #111827)"
                    : `${color}20`,
              }}
            >
              <p
                className={`text-xs font-medium uppercase tracking-wide mb-1 ${
                  stat.csvKey === "US" ? "text-slate-200" : "text-slate-700"
                }`}
              >
                Avg. {stat.displayName} per 1000 OJA
              </p>
              <p
                className={`text-2xl font-bold ${
                  stat.csvKey === "US" ? "text-white" : "text-slate-900"
                }`}
              >
                {stat.avg.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Dataset toggles */}
      <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-600">Show datasets:</span>
        {selectedCountryConfigs.map((country) => {
          const color = getCountryColor(country);
          const checked = datasetVisibility[country.csvKey] ?? true;

          return (
            <label
              key={country.csvKey}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) =>
                  setDatasetVisibility((prev) => ({
                    ...prev,
                    [country.csvKey]: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: color }}
                ></span>
                <span className="text-sm text-gray-700">{country.displayName}</span>
              </span>
            </label>
          );
        })}
      </div>

      {/* Chart area */}
      <div className="h-[420px] mb-2">
        {hasChartData ? (
          <AgCharts className="h-full" options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-500">
            Select at least one dataset to display the chart.
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center mb-6">
        Values shown: jobs per 1000 in the market. Bars/dots match the legend.
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
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
          >
            {visibleCountries.map((country) => {
              const value = selectedJob.values?.[country.csvKey];
              if (value === undefined) return null;
              const color = getCountryColor(country);

              return (
                <div
                  key={`${country.csvKey}-${selectedJob.jobTitle}`}
                  className="flex-1 min-w-[200px] p-4 rounded-xl border"
                  style={{ borderColor: color, backgroundColor: `${color}10` }}
                >
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                    {country.displayName} standardized
                  </p>
                  <p className="text-xl font-bold text-slate-800">
                    {(value * DISPLAY_SCALE).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BenchmarkingFig1Fig2;
