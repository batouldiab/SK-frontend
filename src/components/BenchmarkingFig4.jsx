// src/components/BenchmarkingFig4.jsx
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
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

  // Radar chart data
  const [radarChartData, setRadarChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

  // Unified top skills list
  const [unifiedTopSkills, setUnifiedTopSkills] = useState([]);

  // All skills for dropdown
  const [allSkillsData, setAllSkillsData] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
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

              // Get top 10 for UAE
              const sortedByUAE = [...allSkills].sort((a, b) => b.uaeCount - a.uaeCount);
              const uaeTop10 = sortedByUAE.slice(0, 10);

              // Get top 10 for US
              const sortedByUS = [...allSkills].sort((a, b) => b.usCount - a.usCount);
              const usTop10 = sortedByUS.slice(0, 10);

              // Create unified top skills list (10-20 skills) - US driven first
              const unifiedSkillNames = new Set(usTop10.map(s => s.hardSkill));
              const unified = [...usTop10];

              uaeTop10.forEach(skill => {
                if (!unifiedSkillNames.has(skill.hardSkill)) {
                  unifiedSkillNames.add(skill.hardSkill);
                  unified.push(skill);
                }
              });

              setUnifiedTopSkills(unified);
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

  // Update radar chart when unified data changes
  useEffect(() => {
    if (unifiedTopSkills.length === 0) return;

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");

    const datasets = [];
    if (showUAEChart) {
      datasets.push({
        label: "UAE Standardized Count",
        borderColor: documentStyle.getPropertyValue("--blue-400") || "#3b82f6",
        pointBackgroundColor: documentStyle.getPropertyValue("--blue-400") || "#3b82f6",
        pointBorderColor: documentStyle.getPropertyValue("--blue-400") || "#3b82f6",
        pointHoverBackgroundColor: textColor,
        pointHoverBorderColor: documentStyle.getPropertyValue("--blue-400") || "#3b82f6",
        backgroundColor: (documentStyle.getPropertyValue("--blue-400") || "#3b82f6") + "33",
        data: unifiedTopSkills.map((s) => s.uaeCount),
        fill: true,
      });
    }

    if (showUSChart) {
      datasets.push({
        label: "US Standardized Count",
        borderColor: documentStyle.getPropertyValue("--pink-400") || "#ec4899",
        pointBackgroundColor: documentStyle.getPropertyValue("--pink-400") || "#ec4899",
        pointBorderColor: documentStyle.getPropertyValue("--pink-400") || "#ec4899",
        pointHoverBackgroundColor: textColor,
        pointHoverBorderColor: documentStyle.getPropertyValue("--pink-400") || "#ec4899",
        backgroundColor: (documentStyle.getPropertyValue("--pink-400") || "#ec4899") + "33",
        data: unifiedTopSkills.map((s) => s.usCount),
        fill: true,
      });
    }

    if (datasets.length === 0) {
      setRadarChartData(null);
      return;
    }

    // Radar Chart Data with UAE and US datasets
    const radarData = {
      labels: unifiedTopSkills.map((s) => s.hardSkill),
      datasets,
    };

    const options = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            color: textColor,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.r.toFixed(4)}`;
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

    setRadarChartData(radarData);
    setChartOptions(options);
  }, [unifiedTopSkills, showUAEChart, showUSChart]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">Loading chart data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 w-full">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Top Hard Skills: UAE vs US
        </h3>
        <p className="text-blue-700">Error loading chart data: {error}</p>
      </div>
    );
  }

  const uaeTotal = unifiedTopSkills.reduce((sum, s) => sum + s.uaeCount, 0);
  const usTotal = unifiedTopSkills.reduce((sum, s) => sum + s.usCount, 0);
  const uaeAvg = uaeTotal / unifiedTopSkills.length;
  const usAvg = usTotal / unifiedTopSkills.length;
  const hasChartData = radarChartData && radarChartData.datasets && radarChartData.datasets.length > 0;

  // ✅ Count only skills where UAE / US count is non-zero
  const totalUaeSkills = allSkillsData.filter((s) => s.uaeCount !== 0).length;
  const totalUsSkills = allSkillsData.filter((s) => s.usCount !== 0).length;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-full min-h-[420px] flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            Total Distinct Skills (Dataset)
          </p>
          <p className="text-2xl font-bold text-slate-800">{allSkillsData.length}</p>
          <div className="mt-3 text-xs text-slate-600 space-y-1">
            <div>UAE: {totalUaeSkills}</div>
            <div>US: {totalUsSkills}</div>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
            Unified Top Distinct Skills
          </p>
          <p className="text-2xl font-bold text-blue-700">{unifiedTopSkills.length}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl">
          <p className="text-xs font-medium text-slate-300 uppercase tracking-wide mb-1">
            Average Standardized Count
          </p>
          <div className="flex gap-4 text-white">
            <div>
              <p className="text-[10px] uppercase text-slate-200 mb-1">UAE</p>
              <p className="text-xl font-semibold">{uaeAvg.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-200 mb-1">US</p>
              <p className="text-xl font-semibold">{usAvg.toFixed(4)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart toggles */}
      <div className="flex gap-4 mt-1 mb-3 items-center">
        <span className="text-sm font-semibold text-gray-600">
          Show datasets:
        </span>
        <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
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

      {/* Radar Chart - UAE vs US comparison */}
      <div className="w-full mt-3 flex justify-center items-center">
        <div className="flex flex-col items-center w-full" style={{ maxWidth: "720px" }}>
          <h3 className="text-md font-semibold mb-2 text-gray-800">
            Top Distinct Hard Skills Comparison: <span className="font-light">Skills count per 100 OJAs</span>
          </h3>
          <div style={{ width: "100%", height: "500px" }}>
            {hasChartData ? (
              <Chart
                type="radar"
                data={radarChartData}
                options={chartOptions}
                className="w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-color-secondary">
                Select at least one dataset to display the chart.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skill selector & details */}
      <div className="w-full mt-4 pt-4 border-t border-gray-100">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">
          Compare standardized demand for a selected hard skill (per 1000 hard skill in the country market)
        </h3>
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <Dropdown
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.value)}
            options={allSkillsData}
            optionLabel="hardSkill"
            placeholder="Select a hard skill"
            className="w-full md:w-80"
            showClear
            {...dropdownPerfProps}
          />

          {selectedSkill && (
            <div className="flex gap-6 text-sm flex-wrap">
              <div>
                <span className="block text-gray-500 text-xs uppercase">UAE</span>
                <span className="block font-semibold text-blue-600">
                  {selectedSkill.uaeCount.toFixed(4)}
                </span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs uppercase">US</span>
                <span className="block font-semibold text-pink-500">
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
