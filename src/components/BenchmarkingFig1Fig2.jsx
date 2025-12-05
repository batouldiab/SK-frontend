// src/components/BenchmarkingFig1Fig2.jsx
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";

const dropdownPerfProps = {
  filter: true,
  filterDelay: 120,
  resetFilterOnHide: true,
  virtualScrollerOptions: { itemSize: 38, showLoader: true },
  scrollHeight: "260px",
};

const DISPLAY_SCALE = 10; // show values per 1000 jobs

const BenchmarkingFig1Fig2 = () => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data for the chart (unified top jobs)
  const [rawData, setRawData] = useState(null);
  const [unifiedTopJobs, setUnifiedTopJobs] = useState([]);

  // Data for ALL job titles (for the selector)
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

        // Parse ALL rows for selector
        rows.forEach((line) => {
          if (!line.trim()) return;

          const cols = line.split(delimiter);
          if (cols.length < 5) return;

          const jobTitle = cols[0].trim();
          const uaePercent = parseFloat(cols[2].trim()); // UAE standardized %
          const usPercent = parseFloat(cols[4].trim());  // US standardized %
          const uaeCount = parseFloat(cols[1].trim()); // UAE standardized %
          const usCount = parseFloat(cols[3].trim());  // US standardized %

          if (!jobTitle || isNaN(uaePercent) || isNaN(usPercent) || isNaN(uaeCount) || isNaN(usCount) ) return;

          allJobData.push({
            jobTitle,
            uaePercent,
            usPercent,
            uaeCount,
            usCount
          });
        });

        if (allJobData.length === 0) {
          throw new Error("No valid data found in CSV");
        }

        // Build unified top jobs (top 10 per market, combined unique list) - US driven first
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
        setSelectedJob(allJobData[0]); // default selection

      } catch (err) {
        console.error("Error loading CSV:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadCsv();
  }, []);

  // Update chart when data or toggles change
  useEffect(() => {
    if (!rawData) return;

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");

    const primaryBlue = documentStyle.getPropertyValue("--blue-500") || "#3b82f6";
    const primaryPink = documentStyle.getPropertyValue("--pink-500") || "#ec4899";

    const datasets = [];

    if (showUAE) {
      datasets.push({
        label: "UAE",
        backgroundColor: primaryBlue + "66",
        borderColor: primaryBlue,
        borderWidth: 1,
        data: rawData.uaePercentages.map((v) => v * DISPLAY_SCALE),
      });
    }

    if (showUS) {
      datasets.push({
        label: "US",
        backgroundColor: primaryPink + "66",
        borderColor: primaryPink,
        borderWidth: 1,
        data: rawData.usPercentages.map((v) => v * DISPLAY_SCALE),
      });
    }

    const maxValue = Math.max(
      ...(rawData.uaePercentages.map((v) => v * DISPLAY_SCALE)),
      ...(rawData.usPercentages.map((v) => v * DISPLAY_SCALE))
    );
    const yMax = Math.ceil(maxValue * 1.1);

    const data = {
      labels: rawData.jobTitles,
      datasets: datasets,
    };

    const options = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            boxWidth: 10,
            boxHeight: 10,
            color: textColor,
            padding: 16,
            font: {
              size: 13,
              weight: 500,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            maxRotation: 40,
            minRotation: 0,
            autoSkip: false,
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          beginAtZero: true,
          max: yMax,
          ticks: {
            color: textColorSecondary,
            callback: (value) => value.toFixed(1),
          },
          grid: {
            color: textColorSecondary + "40",
            drawBorder: false,
          },
        },
      },
      animation: {
        duration: 800,
        easing: "easeOutQuart",
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [rawData, showUAE, showUS]);

  if (loading) {
    return (
      <div className="card surface-card shadow-2 border-round-xl p-4 w-full min-h-[420px] flex flex-col">
        <div className="text-sm text-color-secondary mb-2">
          Loading chart data…
        </div>
        <div
          className="mt-2"
          style={{
            height: "100%",
            borderRadius: "1rem",
            opacity: 0.3,
            border: "1px dashed var(--surface-border)",
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card surface-card shadow-2 border-round-xl p-4 w-full min-h-[420px]">
        <h2 className="m-0 mb-2 text-xl">
          Job Title Distribution: UAE vs US
        </h2>
        <p className="m-0 text-sm text-red-500">
          Error loading chart data: {error}
        </p>
      </div>
    );
  }

  if (!chartData || !rawData) return null;

  const uaeAvg = unifiedTopJobs.length
    ? unifiedTopJobs.reduce((sum, job) => sum + job.uaePercent, 0) / unifiedTopJobs.length
    : rawData.uaePercentages.reduce((a, b) => a + b, 0) / rawData.uaePercentages.length;
  const usAvg = unifiedTopJobs.length
    ? unifiedTopJobs.reduce((sum, job) => sum + job.usPercent, 0) / unifiedTopJobs.length
    : rawData.usPercentages.reduce((a, b) => a + b, 0) / rawData.usPercentages.length;
  const totalJobs = unifiedTopJobs.length || rawData.jobTitles.length;

  return (
    <div className="card surface-card shadow-2 border-round-xl p-4 w-full min-h-[420px] flex flex-col">
      <div className="justify-content-between align-items-start mb-3 gap-3 w-full">
        <div>

          {/* Statistics cards */}
          <div className="flex gap-2 flex-wrap justify-content-start align-items-center mt-3">
            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Job Titles (Chart)
              </span>
              <span className="block text-sm font-semibold">
                {totalJobs}
              </span>
            </div>
            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Avg. UAE Job Count per 1000 OJA
              </span>
              <span className="block text-sm font-semibold">
                {(uaeAvg * DISPLAY_SCALE).toFixed(2)}
              </span>
            </div>
            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Avg. US Job Count per 1000 OJA
              </span>
              <span className="block text-sm font-semibold">
                {(usAvg * DISPLAY_SCALE).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Dataset toggles */}
          <div className="flex gap-4 mt-4 align-items-center">
            <span className="text-sm font-semibold text-color-secondary">
              Show datasets:
            </span>
            <div className="flex align-items-center gap-2">
              <Checkbox
                inputId="toggle-uae"
                checked={showUAE}
                onChange={(e) => setShowUAE(e.checked)}
              />
              <label
                htmlFor="toggle-uae"
                className="text-sm cursor-pointer select-none"
                style={{ color: "var(--blue-500)" }}
              >
                UAE
              </label>
            </div>
            <div className="flex align-items-center gap-2">
              <Checkbox
                inputId="toggle-us"
                checked={showUS}
                onChange={(e) => setShowUS(e.checked)}
              />
              <label
                htmlFor="toggle-us"
                className="text-sm cursor-pointer select-none"
                style={{ color: "var(--pink-500)" }}
              >
                US
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div
        className="w-full mt-3 flex justify-content-center"
        style={{ minHeight: "400px" }}
      >
        <Chart
          type="bar"
          data={chartData}
          options={chartOptions}
          className="w-full"
          style={{ maxWidth: "900px", height: "460px" }}
        />
      </div>
      <div className="flex justify-content-end mt-2">
        <span
          className="inline-flex items-center gap-2 px-3 py-2 border-round-lg text-xs font-semibold"
          style={{
            background: "var(--surface-50, rgba(255,255,255,0.08))",
            border: "1px solid var(--surface-border, rgba(255,255,255,0.12))",
            color: "var(--text-color-secondary)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
          }}
        >
          <i className="pi pi-info-circle text-xs" style={{ color: "var(--blue-500)" }} />
          Values shown: jobs per 1000 in the market
        </span>
      </div>

      {/* Job selector & textual standardized percentages */}
      <div className="w-full mt-4 pt-3 border-top-1 surface-border">
        <h3 className="text-sm font-semibold mb-2">
          Compare standardized demand for a selected job title (per 1000 job in the country market)
        </h3>
        <div className="flex flex-col md:flex-row gap-3 align-items-start md:align-items-center">
          <div className="flex-1">
            <Dropdown
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.value)}
              options={allJobsData}
              optionLabel="jobTitle"
              placeholder="Select a job title"
              className="w-full md:w-20rem"
              showClear
              {...dropdownPerfProps}
            />
          </div>

          {selectedJob && (
            <div className="flex gap-4 text-sm flex-wrap">
              <div>
                <span className="block text-color-secondary text-xs">
                  UAE standardized
                </span>
                <span className="block font-semibold">
                  {(selectedJob.uaePercent * DISPLAY_SCALE).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="block text-color-secondary text-xs">
                  US standardized
                </span>
                <span className="block font-semibold">
                  {(selectedJob.usPercent * DISPLAY_SCALE).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BenchmarkingFig1Fig2;
