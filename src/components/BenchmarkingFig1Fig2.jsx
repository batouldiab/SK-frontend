// src/components/BenchmarkingFig1Fig2.jsx
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";

const BenchmarkingFig1Fig2 = () => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data for the radar chart (top 10)
  const [rawData, setRawData] = useState(null);

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

        // Prepare top 10 for the radar chart
        const top10 = allJobData.slice(0, 10);
        const jobTitles = top10.map((d) => d.jobTitle);
        const uaePercentages = top10.map((d) => d.uaePercent);
        const usPercentages = top10.map((d) => d.usPercent);

        setRawData({
          jobTitles,
          uaePercentages,
          usPercentages
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
        borderColor: primaryBlue,
        pointBackgroundColor: primaryBlue,
        pointBorderColor: primaryBlue,
        pointHoverBackgroundColor: textColor,
        pointHoverBorderColor: primaryBlue,
        backgroundColor: primaryBlue + "20",
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        data: rawData.uaePercentages,
      });
    }

    if (showUS) {
      datasets.push({
        label: "US",
        borderColor: primaryPink,
        pointBackgroundColor: primaryPink,
        pointBorderColor: primaryPink,
        pointHoverBackgroundColor: textColor,
        pointHoverBorderColor: primaryPink,
        backgroundColor: primaryPink + "20",
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        data: rawData.usPercentages,
      });
    }

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
              return `${context.dataset.label}: ${context.parsed.r.toFixed(2)}%`;
            },
          },
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
            backdropColor: "transparent",
            callback: (value) => value.toFixed(1) + "%",
          },
          grid: {
            color: textColorSecondary + "40",
          },
          pointLabels: {
            color: textColorSecondary,
            font: {
              size: 11,
            },
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
      <div className="card surface-card shadow-2 border-round-xl p-4 w-full min-h-[420px] flex flex-column">
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

  const uaeAvg =
    rawData.uaePercentages.reduce((a, b) => a + b, 0) /
    rawData.uaePercentages.length;
  const usAvg =
    rawData.usPercentages.reduce((a, b) => a + b, 0) /
    rawData.usPercentages.length;
  const totalJobs = rawData.jobTitles.length;

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
                Avg. UAE %
              </span>
              <span className="block text-sm font-semibold">
                {uaeAvg.toFixed(2)}%
              </span>
            </div>
            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Avg. US %
              </span>
              <span className="block text-sm font-semibold">
                {usAvg.toFixed(2)}%
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
          type="radar"
          data={chartData}
          options={chartOptions}
          className="w-full"
          style={{ maxWidth: "600px", height: "400px" }}
        />
      </div>

      {/* Job selector & textual standardized percentages */}
      <div className="w-full mt-4 pt-3 border-top-1 surface-border">
        <h3 className="text-sm font-semibold mb-2">
          Inspect standardized percentage for any job title
        </h3>
        <div className="flex flex-column md:flex-row gap-3 align-items-start md:align-items-center">
          <div className="flex-1">
            <Dropdown
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.value)}
              options={allJobsData}
              optionLabel="jobTitle"
              placeholder="Select a job title"
              className="w-full md:w-20rem"
              filter
              showClear
            />
          </div>

          {selectedJob && (
            <div className="flex gap-4 text-sm flex-wrap">
              <div>
                <span className="block text-color-secondary text-xs">
                  UAE standardized %
                </span>
                <span className="block font-semibold">
                  {selectedJob.uaePercent.toFixed(2)}%
                </span>
              </div>
              <div>
                <span className="block text-color-secondary text-xs">
                  UAE Count
                </span>
                <span className="block font-semibold">
                  {selectedJob.uaeCount}
                </span>
              </div>
              <div>
                <span className="block text-color-secondary text-xs">
                  US standardized %
                </span>
                <span className="block font-semibold">
                  {selectedJob.usPercent.toFixed(2)}%
                </span>
              </div>
              <div>
                <span className="block text-color-secondary text-xs">
                  US Count
                </span>
                <span className="block font-semibold">
                  {selectedJob.usCount}
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
