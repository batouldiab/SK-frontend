// src/components/BenchmarkingFig3.jsx
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import Papa from "papaparse";

const dropdownPerfProps = {
  filter: true,
  filterDelay: 120,
  resetFilterOnHide: true,
  virtualScrollerOptions: { itemSize: 38, showLoader: true },
  scrollHeight: "260px",
};

const BenchmarkingFig3 = () => {
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

  // Load CSV data
  useEffect(() => {
    const loadCsv = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/data/benchmarking_fig3_5.csv");
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
                // Get the first column (soft skill name) - adjust column name as needed
                const softSkill = row["Soft Skill"] || row[Object.keys(row)[0]];
                
                // Get UAE and US standardized counts - adjust column names as needed
                const uaeCount = parseFloat(row["Standardized Count UAE"]);
                const usCount = parseFloat(row["Standardized Count US"]);

                if (!softSkill || isNaN(uaeCount) || isNaN(usCount)) return;

                allSkills.push({
                  softSkill: softSkill.trim(),
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
              const unifiedSkillNames = new Set(usTop10.map(s => s.softSkill));
              const unified = [...usTop10];

              uaeTop10.forEach(skill => {
                if (!unifiedSkillNames.has(skill.softSkill)) {
                  unifiedSkillNames.add(skill.softSkill);
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

    // Radar Chart Data with UAE and US datasets
    const radarData = {
      labels: unifiedTopSkills.map((s) => s.softSkill),
      datasets: [
        {
          label: "UAE Standardized Count",
          borderColor: documentStyle.getPropertyValue("--blue-400") || "#3b82f6",
          pointBackgroundColor: documentStyle.getPropertyValue("--blue-400") || "#3b82f6",
          pointBorderColor: documentStyle.getPropertyValue("--blue-400") || "#3b82f6",
          pointHoverBackgroundColor: textColor,
          pointHoverBorderColor: documentStyle.getPropertyValue("--blue-400") || "#3b82f6",
          backgroundColor: (documentStyle.getPropertyValue("--blue-400") || "#3b82f6") + "33",
          data: unifiedTopSkills.map((s) => s.uaeCount),
          fill: true,
        },
        {
          label: "US Standardized Count",
          borderColor: documentStyle.getPropertyValue("--pink-400") || "#ec4899",
          pointBackgroundColor: documentStyle.getPropertyValue("--pink-400") || "#ec4899",
          pointBorderColor: documentStyle.getPropertyValue("--pink-400") || "#ec4899",
          pointHoverBackgroundColor: textColor,
          pointHoverBorderColor: documentStyle.getPropertyValue("--pink-400") || "#ec4899",
          backgroundColor: (documentStyle.getPropertyValue("--pink-400") || "#ec4899") + "33",
          data: unifiedTopSkills.map((s) => s.usCount),
          fill: true,
        },
      ],
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
  }, [unifiedTopSkills]);

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
          Top Soft Skills: UAE vs US
        </h2>
        <p className="m-0 text-sm text-red-500">
          Error loading chart data: {error}
        </p>
      </div>
    );
  }

  if (!radarChartData) return null;

  const uaeTotal = unifiedTopSkills.reduce((sum, s) => sum + s.uaeCount, 0);
  const usTotal = unifiedTopSkills.reduce((sum, s) => sum + s.usCount, 0);
  const uaeAvg = uaeTotal / unifiedTopSkills.length;
  const usAvg = usTotal / unifiedTopSkills.length;

  // ✅ Count only skills where UAE / US count is non-zero
  const totalUaeSkills = allSkillsData.filter((s) => s.uaeCount !== 0).length;
  const totalUsSkills = allSkillsData.filter((s) => s.usCount !== 0).length;

  return (
    <div className="card surface-card shadow-2 border-round-xl p-4 w-full min-h-[420px] flex flex-col">
      <div className="justify-content-between align-items-start mb-3 gap-3 w-full">
        <div>
          {/* Statistics cards */}
          <div className="flex gap-2 flex-wrap justify-content-start align-items-center mt-3">
            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Total Distinct Skills Count in Dataset
              </span>
              <span className="block text-sm font-semibold">
                {allSkillsData.length}
              </span>

              <span className="block text-xs text-color-secondary">
                Total Distinct Skills Count in UAE
              </span>
              <span className="block text-sm font-semibold">
                {totalUaeSkills}
              </span>

              <span className="block text-xs text-color-secondary">
                Total Distinct Skills Count in US
              </span>
              <span className="block text-sm font-semibold">
                {totalUsSkills}
              </span>
            </div>

            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Unified Top Distinct Skills
              </span>
              <span className="block text-sm font-semibold">
                {unifiedTopSkills.length}
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
        </div>
      </div>

      {/* Radar Chart - UAE vs US comparison */}
      <div className="w-full mt-3 flex justify-content-center align-items-center">
        <div className="flex flex-col align-items-center w-full" style={{ maxWidth: "700px" }}>
          <h3 className="text-md font-semibold mb-2 text-color">
            UAE vs US: Unified Top Distinct Skills Comparison
          </h3>
          <div style={{ width: "100%", height: "500px" }}>
            <Chart
              type="radar"
              data={radarChartData}
              options={chartOptions}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Skill selector & details */}
      <div className="w-full mt-4 pt-3 border-top-1 surface-border">
        <h3 className="text-sm font-semibold mb-2">
          Compare standardized demand for a selected soft skill (per 1000 soft skill in the country market)
        </h3>
        <div className="flex flex-col md:flex-row gap-3 align-items-start md:align-items-center">
          <div className="flex-1">
            <Dropdown
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.value)}
              options={allSkillsData}
              optionLabel="softSkill"
              placeholder="Select a soft skill"
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
                <span className="block font-semibold" style={{ color: "var(--blue-500)" }}>
                  {selectedSkill.uaeCount.toFixed(4)}
                </span>
              </div>
              <div>
                <span className="block text-color-secondary text-xs">
                  US
                </span>
                <span className="block font-semibold" style={{ color: "var(--pink-500)" }}>
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

export default BenchmarkingFig3;
