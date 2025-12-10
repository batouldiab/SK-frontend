// src/components/BenchmarkingFig6.jsx
import React, { useState, useEffect } from "react";
import { AgCharts } from "ag-charts-react";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import Papa from "papaparse";

const COLORS = {
  uae: "#1E88E5",
  us: "#1a1a2e",
  background: "#ffffff",
  grid: "#e5e7eb",
  text: "#1f2937",
};

const dropdownPerfProps = {
  filter: true,
  filterDelay: 120,
  resetFilterOnHide: true,
  virtualScrollerOptions: { itemSize: 38, showLoader: true },
  scrollHeight: "260px",
};

const BenchmarkingFig6 = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Raw data from both CSV files
  const [uaeData, setUaeData] = useState([]);
  const [usData, setUsData] = useState([]);

  // Common skills across both files
  const [commonSkills, setCommonSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Chart data
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState(null);
  const [showUAE, setShowUAE] = useState(true);
  const [showUS, setShowUS] = useState(true);

  // Statistics
  const [stats, setStats] = useState({
    totalTitles: 0,
    uaeAvg: 0,
    usAvg: 0,
  });

  // Load both CSV files
  useEffect(() => {
    const loadCsvFiles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load UAE data
        const uaeResponse = await fetch("/data/benchmarking_fig6.csv");
        if (!uaeResponse.ok) {
          throw new Error(`HTTP error loading UAE data! status: ${uaeResponse.status}`);
        }
        const uaeText = await uaeResponse.text();

        // Load US data
        const usResponse = await fetch("/data/benchmarking_fig7.csv");
        if (!usResponse.ok) {
          throw new Error(`HTTP error loading US data! status: ${usResponse.status}`);
        }
        const usText = await usResponse.text();

        // Parse both CSVs
        const parsePromises = [
          new Promise((resolve, reject) => {
            Papa.parse(uaeText, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => resolve(results.data),
              error: (err) => reject(err),
            });
          }),
          new Promise((resolve, reject) => {
            Papa.parse(usText, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => resolve(results.data),
              error: (err) => reject(err),
            });
          }),
        ];

        const [uaeParsed, usParsed] = await Promise.all(parsePromises);

        // Process UAE data
        const uaeProcessed = uaeParsed
          .map((row) => ({
            skill: row["skill"]?.trim() || "",
            title: row["title"]?.trim() || "",
            count: parseFloat(row["count"]) || 0,
            standardizedCount: parseFloat(row["standardized count"]) || 0,
          }))
          .filter((row) => row.skill && row.title && !isNaN(row.standardizedCount));

        // Process US data
        const usProcessed = usParsed
          .map((row) => ({
            skill: row["skill"]?.trim() || "",
            title: row["title"]?.trim() || "",
            count: parseFloat(row["count"]) || 0,
            standardizedCount: parseFloat(row["standardized count"]) || 0,
          }))
          .filter((row) => row.skill && row.title && !isNaN(row.standardizedCount));

        if (uaeProcessed.length === 0 || usProcessed.length === 0) {
          throw new Error("No valid data found in CSV files");
        }

        setUaeData(uaeProcessed);
        setUsData(usProcessed);

        // Find common skills
        const uaeSkills = new Set(uaeProcessed.map((row) => row.skill));
        const usSkills = new Set(usProcessed.map((row) => row.skill));
        const common = [...uaeSkills].filter((skill) => usSkills.has(skill));
        
        const commonSkillsOptions = common
          .sort()
          .map((skill) => ({ label: skill, value: skill }));

        setCommonSkills(commonSkillsOptions);

        if (commonSkillsOptions.length > 0) {
          setSelectedSkill(commonSkillsOptions[0].value);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading CSV files:", err);
        setError(err.message || "Unknown error loading data");
        setLoading(false);
      }
    };

    loadCsvFiles();
  }, []);

  // Update chart when selected skill changes
  useEffect(() => {
    if (!selectedSkill || uaeData.length === 0 || usData.length === 0) return;

    try {
      // Filter data for selected skill
      const uaeSkillData = uaeData.filter((row) => row.skill === selectedSkill);
      const usSkillData = usData.filter((row) => row.skill === selectedSkill);

      // Calculate total count for UAE skill titles
      const uaeTotalCount = uaeSkillData.reduce((sum, row) => sum + row.count, 0);
      
      // Calculate total count for US skill titles
      const usTotalCount = usSkillData.reduce((sum, row) => sum + row.count, 0);

      // Add percentage to UAE data
      const uaeSkillDataWithPercentage = uaeSkillData.map(row => ({
        ...row,
        percentage: uaeTotalCount > 0 ? row.count / uaeTotalCount : 0
      }));

      // Add percentage to US data
      const usSkillDataWithPercentage = usSkillData.map(row => ({
        ...row,
        percentage: usTotalCount > 0 ? row.count / usTotalCount : 0
      }));

      // Get top 10 titles from UAE
      const uaeTop10 = [...uaeSkillDataWithPercentage]
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10);

      // Get top 10 titles from US
      const usTop10 = [...usSkillDataWithPercentage]
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10);

      // Combine and deduplicate titles
      const allTitles = new Set([
        ...usTop10.map((row) => row.title),
        ...uaeTop10.map((row) => row.title),
      ]);

      const uniqueTitles = [...allTitles];

      // Create datasets using percentages
      const uaeDataset = uniqueTitles.map((title) => {
        const match = uaeSkillDataWithPercentage.find((row) => row.title === title);
        return match ? match.percentage : 0;
      });

      const usDataset = uniqueTitles.map((title) => {
        const match = usSkillDataWithPercentage.find((row) => row.title === title);
        return match ? match.percentage : 0;
      });

      // Sort titles by total percentage (UAE + US) for better visualization
      const titlesWithTotal = uniqueTitles.map((title, idx) => ({
        title,
        uaeCount: uaeDataset[idx],
        usCount: usDataset[idx],
        total: uaeDataset[idx] + usDataset[idx],
      }));

      titlesWithTotal.sort((a, b) => b.total - a.total);

      const sortedUaeData = titlesWithTotal.map((item) => item.uaeCount);
      const sortedUsData = titlesWithTotal.map((item) => item.usCount);

      // Calculate statistics
      const uaeAvg = sortedUaeData.reduce((a, b) => a + b, 0) / sortedUaeData.filter(v => v > 0).length || 0;
      const usAvg = sortedUsData.reduce((a, b) => a + b, 0) / sortedUsData.filter(v => v > 0).length || 0;

      setStats({
        totalTitles: uniqueTitles.length,
        uaeAvg,
        usAvg,
      });

      // Configure chart
      const dataForChart = titlesWithTotal.map((item) => ({
        title: item.title,
        uaePercent: item.uaeCount * 100,
        usPercent: item.usCount * 100,
      }));

      const maxValue = Math.max(
        ...dataForChart.flatMap((d) => [d.uaePercent, d.usPercent]),
        0
      );
      const paddedMax = maxValue > 0 ? Math.ceil(maxValue * 1.15) : 1;

      const documentStyle = getComputedStyle(document.documentElement);
      const getCssVar = (name, fallback) => {
        const value = documentStyle.getPropertyValue(name);
        return value && value.trim() ? value.trim() : fallback;
      };

      const textColor = getCssVar("--text-color", COLORS.text);
      const textColorSecondary = getCssVar("--text-color-secondary", "#6b7280");
      const gridColor = getCssVar("--surface-border", COLORS.grid);
      const uaeColor = getCssVar("--blue-500", COLORS.uae);
      const usColor = getCssVar("--pink-500", COLORS.us);

      const series = [];
      if (showUAE) {
        series.push({
          type: "bar",
          xKey: "title",
          yKey: "uaePercent",
          yName: "UAE",
          fill: uaeColor,
          stroke: uaeColor,
          cornerRadius: 5,
          tooltip: {
            renderer: ({ datum }) => ({
              content: `UAE: ${datum.uaePercent.toFixed(2)}%`,
            }),
          },
        });
      }

      if (showUS) {
        series.push({
          type: "scatter",
          xKey: "title",
          yKey: "usPercent",
          title: "US",
          marker: {
            fill: usColor,
            stroke: "#ffffff",
            strokeWidth: 2,
            size: 12,
            shape: "circle",
          },
          tooltip: {
            renderer: ({ datum }) => ({
              content: `US: ${datum.usPercent.toFixed(2)}%`,
            }),
          },
        });
      }

      if (series.length === 0) {
        setChartOptions(null);
        setChartData(dataForChart);
        return;
      }

      const options = {
        data: dataForChart,
        background: { fill: COLORS.background },
        padding: { top: 10, right: 20, bottom: 40, left: 50 },
        series,
        axes: [
          {
            type: "category",
            position: "bottom",
            label: {
              rotation: -35,
              color: textColor,
              fontSize: 11,
              formatter: ({ value }) =>
                value.length > 28 ? `${value.slice(0, 25)}...` : value,
            },
            line: {
              stroke: gridColor,
            },
          },
          {
            type: "number",
            position: "left",
            title: {
              text: "Share of titles (%)",
              fontSize: 12,
              color: textColor,
            },
            min: 0,
            max: paddedMax,
            label: {
              color: textColorSecondary,
              fontSize: 11,
              formatter: ({ value }) => `${value.toFixed(1)}%`,
            },
            gridLine: {
              style: [
                {
                  stroke: gridColor,
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
              fontSize: 13,
              color: textColor,
            },
            paddingX: 24,
          },
        },
      };

      setChartData(dataForChart);
      setChartOptions(options);
    } catch (err) {
      console.error("Error processing chart data:", err);
      setError(err.message || "Error processing chart data");
    }
  }, [selectedSkill, uaeData, usData, showUAE, showUS]);

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
        <p className="text-blue-700">Error loading chart data: {error}</p>
      </div>
    );
  }

  if (!chartOptions || !chartData || chartData.length === 0 || commonSkills.length === 0) {
    return (
      <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 w-full">
        <p className="text-blue-700">No common skills found between the two datasets.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-full min-h-[420px] flex flex-col">
      {/* Header with skill selector */}
      <div className="mb-3">

        {/* Skill selector */}
        <div className="mb-3">
          <label htmlFor="skill-select" className="block text-sm font-semibold mb-2 text-color-secondary">
            Select a Skill
          </label>
          <Dropdown
            inputId="skill-select"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.value)}
            options={commonSkills}
            placeholder="Choose a skill"
            className="w-full md:w-20rem"
            showClear={false}
            {...dropdownPerfProps}
          />
        </div>

        {/* Statistics cards */}
        <div className="flex gap-2 flex-wrap justify-content-start align-items-center">
          <div className="surface-100 border-round-lg px-3 py-2 text-right">
            <span className="block text-xs text-color-secondary">Total Titles</span>
            <span className="block text-sm font-semibold">{stats.totalTitles}</span>
          </div>
          <div className="surface-100 border-round-lg px-3 py-2 text-right">
            <span className="block text-xs text-color-secondary">Avg. UAE %</span>
            <span className="block text-sm font-semibold">{(stats.uaeAvg * 100).toFixed(2)}%</span>
          </div>
          <div className="surface-100 border-round-lg px-3 py-2 text-right">
            <span className="block text-xs text-color-secondary">Avg. US %</span>
            <span className="block text-sm font-semibold">{(stats.usAvg * 100).toFixed(2)}%</span>
          </div>
        </div>

        {/* Chart toggles */}
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

      {/* Chart */}
      <div className="flex-1 min-h-[420px]">
        {chartOptions ? (
          <AgCharts className="w-full h-full" options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-color-secondary">
            Select at least one dataset to display the chart.
          </div>
        )}
      </div>
    </div>
  );
};

export default BenchmarkingFig6;
