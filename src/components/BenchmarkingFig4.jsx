// src/components/BenchmarkingFig4.jsx
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import Papa from "papaparse";

const dropdownPerfProps = {
  filter: true,
  filterDelay: 120,
  resetFilterOnHide: true,
  virtualScrollerOptions: { itemSize: 38, showLoader: true },
  scrollHeight: "260px",
};

const BenchmarkingFig4 = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data for UAE and US charts (top 10 each)
  const [uaeChartData, setUaeChartData] = useState(null);
  const [usChartData, setUsChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

  // Raw data from CSV
  const [uaeTopSkills, setUaeTopSkills] = useState([]);
  const [usTopSkills, setUsTopSkills] = useState([]);

  // All skills for dropdown
  const [allSkillsData, setAllSkillsData] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Chart visibility toggles
  const [showUAEChart, setShowUAEChart] = useState(true);
  const [showUSChart, setShowUSChart] = useState(true);

  // Load CSV data
  useEffect(() => {
    const loadCsv = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/data/benchmarking_fig4_5.csv");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();

        // Use PapaParse to properly handle CSV with commas in fields
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              if (!results.data || results.data.length === 0) {
                throw new Error("No valid data found in CSV");
              }

              const allSkills = [];

              // Parse all rows
              results.data.forEach((row) => {
                // Get the first column (hard skill name) - adjust column name as needed
                const hardSkill = row["Hard Skill"] || row[Object.keys(row)[0]];
                
                // Get UAE and US standardized counts - adjust column names as needed
                const uaeCount = parseFloat(row["Standardized Count UAE"]);
                const usCount = parseFloat(row["Standardized Count US"]);

                if (!hardSkill || isNaN(uaeCount) || isNaN(usCount)) return;

                allSkills.push({
                  hardSkill: hardSkill.trim(),
                  uaeCount,
                  usCount,
                });
              });

              if (allSkills.length === 0) {
                throw new Error("No valid data found in CSV");
              }

              // Get top 10 for UAE (already sorted in CSV)
              const sortedByUAE = [...allSkills].sort((a, b) => b.uaeCount - a.uaeCount);
              const uaeTop10 = sortedByUAE.slice(0, 10);
              setUaeTopSkills(uaeTop10);

              // Sort by US count to get US top 10
              const sortedByUS = [...allSkills].sort((a, b) => b.usCount - a.usCount);
              const usTop10 = sortedByUS.slice(0, 10);
              setUsTopSkills(usTop10);

              setAllSkillsData(allSkills);
              setSelectedSkill(allSkills[0]);
            } catch (err) {
              console.error("Error processing CSV data:", err);
              setError(err.message || "Error processing data");
            } finally {
              setLoading(false);
            }
          },
          error: (err) => {
            console.error("Error parsing CSV:", err);
            setError(err.message || "Error parsing CSV");
            setLoading(false);
          }
        });

      } catch (err) {
        console.error("Error loading CSV:", err);
        setError(err.message || "Unknown error");
        setLoading(false);
      }
    };

    loadCsv();
  }, []);

  // Update charts when data changes
  useEffect(() => {
    if (uaeTopSkills.length === 0 || usTopSkills.length === 0) return;

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");

    // Color palette for hard skills
    const colors = [
      "#3b82f6", // blue
      "#8b5cf6", // purple
      "#ec4899", // pink
      "#f59e0b", // amber
      "#10b981", // emerald
      "#06b6d4", // cyan
      "#f97316", // orange
      "#6366f1", // indigo
      "#14b8a6", // teal
      "#a855f7", // violet
    ];

    // UAE Chart Data
    const uaeData = {
      labels: uaeTopSkills.map((s) => s.hardSkill),
      datasets: [
        {
          label: "UAE Standardized Count",
          data: uaeTopSkills.map((s) => s.uaeCount),
          backgroundColor: colors.map(c => c + "CC"),
          borderColor: colors,
          borderWidth: 2,
        },
      ],
    };

    // US Chart Data
    const usData = {
      labels: usTopSkills.map((s) => s.hardSkill),
      datasets: [
        {
          label: "US Standardized Count",
          data: usTopSkills.map((s) => s.usCount),
          backgroundColor: colors.map(c => c + "CC"),
          borderColor: colors,
          borderWidth: 2,
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.parsed.r.toFixed(4)}`;
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
            callback: (value) => value.toFixed(4),
          },
          grid: {
            color: textColorSecondary + "40",
          },
          pointLabels: {
            color: textColorSecondary,
            font: {
              size: 10,
            },
          },
        },
      },
      animation: {
        duration: 800,
        easing: "easeOutQuart",
      },
    };

    setUaeChartData(uaeData);
    setUsChartData(usData);
    setChartOptions(options);
  }, [uaeTopSkills, usTopSkills]);

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
          Top 10 Hard Skills: UAE vs US
        </h2>
        <p className="m-0 text-sm text-red-500">
          Error loading chart data: {error}
        </p>
      </div>
    );
  }

  if (!uaeChartData || !usChartData) return null;

  const uaeTotal = uaeTopSkills.reduce((sum, s) => sum + s.uaeCount, 0);
  const usTotal = usTopSkills.reduce((sum, s) => sum + s.usCount, 0);
  const uaeAvg = uaeTotal / uaeTopSkills.length;
  const usAvg = usTotal / usTopSkills.length;

  return (
    <div className="card surface-card shadow-2 border-round-xl p-4 w-full min-h-[420px] flex flex-col">
      <div className="justify-content-between align-items-start mb-3 gap-3 w-full">
        <div>
          {/* Statistics cards */}
          <div className="flex gap-2 flex-wrap justify-content-start align-items-center mt-3">
            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Total Skills
              </span>
              <span className="block text-sm font-semibold">
                {allSkillsData.length}
              </span>
            </div>
            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Avg. UAE Standardized Count
              </span>
              <span className="block text-sm font-semibold">
                {uaeAvg.toFixed(4)}
              </span>
            </div>
            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Avg. US Standardized Count
              </span>
              <span className="block text-sm font-semibold">
                {usAvg.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Chart toggles */}
          <div className="flex gap-4 mt-4 align-items-center">
            <span className="text-sm font-semibold text-color-secondary">
              Show charts:
            </span>
            <div className="flex align-items-center gap-2">
              <Checkbox
                inputId="toggle-uae-chart"
                checked={showUAEChart}
                onChange={(e) => setShowUAEChart(e.checked)}
              />
              <label
                htmlFor="toggle-uae-chart"
                className="text-sm cursor-pointer select-none"
                style={{ color: "var(--blue-500)" }}
              >
                UAE
              </label>
            </div>
            <div className="flex align-items-center gap-2">
              <Checkbox
                inputId="toggle-us-chart"
                checked={showUSChart}
                onChange={(e) => setShowUSChart(e.checked)}
              />
              <label
                htmlFor="toggle-us-chart"
                className="text-sm cursor-pointer select-none"
                style={{ color: "var(--pink-500)" }}
              >
                US
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Charts area - two adjacent polar area charts */}
      <div className="w-full mt-3 flex flex-column md:flex-row gap-4 justify-content-center align-items-center">
        {/* UAE Chart */}
        {showUAEChart && (
          <div className="flex flex-column align-items-center" style={{ flex: 1, minWidth: "300px", maxWidth: "500px" }}>
            <h3 className="text-md font-semibold mb-2" style={{ color: "var(--blue-500)" }}>
              UAE Top 10 Hard Skills
            </h3>
            <div style={{ width: "100%", height: "400px" }}>
              <Chart
                type="polarArea"
                data={uaeChartData}
                options={chartOptions}
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* US Chart */}
        {showUSChart && (
          <div className="flex flex-column align-items-center" style={{ flex: 1, minWidth: "300px", maxWidth: "500px" }}>
            <h3 className="text-md font-semibold mb-2" style={{ color: "var(--pink-500)" }}>
              US Top 10 Hard Skills
            </h3>
            <div style={{ width: "100%", height: "400px" }}>
              <Chart
                type="polarArea"
                data={usChartData}
                options={chartOptions}
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Skill selector & details */}
      <div className="w-full mt-4 pt-3 border-top-1 surface-border">
        <h3 className="text-sm font-semibold mb-2">
          Inspect standardized count for any hard skill
        </h3>
        <div className="flex flex-column md:flex-row gap-3 align-items-start md:align-items-center">
          <div className="flex-1">
            <Dropdown
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.value)}
              options={allSkillsData}
              optionLabel="hardSkill"
              placeholder="Select a hard skill"
              className="w-full md:w-20rem"
              showClear
              {...dropdownPerfProps}
            />
          </div>

          {selectedSkill && (
            <div className="flex gap-4 text-sm flex-wrap">
              <div>
                <span className="block text-color-secondary text-xs">
                  UAE
                </span>
                <span className="block font-semibold">
                  {selectedSkill.uaeCount.toFixed(4)}
                </span>
              </div>
              <div>
                <span className="block text-color-secondary text-xs">
                  US
                </span>
                <span className="block font-semibold">
                  {selectedSkill.usCount.toFixed(4)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BenchmarkingFig4;
