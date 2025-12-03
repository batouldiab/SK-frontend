// src/components/BenchmarkingFig6.jsx
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
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

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
        ...uaeTop10.map((row) => row.title),
        ...usTop10.map((row) => row.title),
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

      const sortedTitles = titlesWithTotal.map((item) => item.title);
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
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color");
      const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
      const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

      const data = {
        labels: sortedTitles,
        datasets: [
          {
            label: "UAE",
            backgroundColor: documentStyle.getPropertyValue("--blue-500"),
            borderColor: documentStyle.getPropertyValue("--blue-500"),
            data: sortedUaeData,
          },
          {
            label: "US",
            backgroundColor: documentStyle.getPropertyValue("--pink-500"),
            borderColor: documentStyle.getPropertyValue("--pink-500"),
            data: sortedUsData,
          },
        ],
      };

      const options = {
        indexAxis: "y",
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: {
              color: textColor,
              usePointStyle: true,
              padding: 15,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const percentage = (context.parsed.x * 100).toFixed(2);
                return `${context.dataset.label}: ${percentage}%`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500,
              },
              callback: (value) => `${(value * 100).toFixed(1)}%`,
            },
            grid: {
              display: false,
              drawBorder: false,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
              font: {
                size: 11,
              },
            },
            grid: {
              color: surfaceBorder,
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
    } catch (err) {
      console.error("Error processing chart data:", err);
      setError(err.message || "Error processing chart data");
    }
  }, [selectedSkill, uaeData, usData]);

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
        <p className="m-0 text-sm text-red-500">Error loading chart data: {error}</p>
      </div>
    );
  }

  if (!chartData || commonSkills.length === 0) {
    return (
      <div className="card surface-card shadow-2 border-round-xl p-4 w-full min-h-[420px]">
        <p className="m-0 text-sm text-color-secondary">No common skills found between the two datasets.</p>
      </div>
    );
  }

  return (
    <div className="card surface-card shadow-2 border-round-xl p-4 w-full min-h-[420px] flex flex-col">
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
      </div>

      {/* Chart */}
      <div className="flex-1" style={{ minHeight: "400px" }}>
        <Chart type="bar" data={chartData} options={chartOptions} className="w-full h-full" />
      </div>
    </div>
  );
};

export default BenchmarkingFig6;
