// src/components/BenchmarkingFig8.jsx
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

const BenchmarkingFig8 = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Raw data from CSV
  const [data, setData] = useState([]);

  // Skills available in the dataset
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Chart data
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

  // Statistics
  const [stats, setStats] = useState({
    totalHierarchyLevels: 0,
    uaeTotal: 0,
    usTotal: 0,
  });

  // Load CSV file
  useEffect(() => {
    const loadCsvFile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load data
        const response = await fetch("/data/benchmarking_fig8_9.csv");
        if (!response.ok) {
          throw new Error(`HTTP error loading data! status: ${response.status}`);
        }
        const text = await response.text();

        // Parse CSV
        const parsePromise = new Promise((resolve, reject) => {
          Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data),
            error: (err) => reject(err),
          });
        });

        const parsed = await parsePromise;

        // Process data
        const processed = parsed
          .map((row) => ({
            skill: row["Skill"]?.trim() || "",
            hierarchyLevel: row["hierarchy_level_1"]?.trim() || "",
            countInUAE: parseFloat(row["count_in_uae"]) || 0,
            countInUS: parseFloat(row["count_in_us"]) || 0,
          }))
          .filter((row) => row.skill && row.hierarchyLevel);

        if (processed.length === 0) {
          throw new Error("No valid data found in CSV file");
        }

        setData(processed);

        // Extract unique skills
        const uniqueSkills = [...new Set(processed.map((row) => row.skill))];
        const skillOptions = uniqueSkills
          .sort()
          .map((skill) => ({ label: skill, value: skill }));

        setSkills(skillOptions);

        if (skillOptions.length > 0) {
          setSelectedSkill(skillOptions[0].value);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading CSV file:", err);
        setError(err.message || "Unknown error loading data");
        setLoading(false);
      }
    };

    loadCsvFile();
  }, []);

  // Update chart when selected skill changes
  useEffect(() => {
    if (!selectedSkill || data.length === 0) return;

    try {
      // Filter data for selected skill
      const skillData = data.filter((row) => row.skill === selectedSkill);

      // Calculate total counts for UAE and US
      const totalSkillCountUAE = skillData.reduce((sum, row) => sum + row.countInUAE, 0);
      const totalSkillCountUS = skillData.reduce((sum, row) => sum + row.countInUS, 0);

      // Get all unique hierarchy levels from entire dataset
      const allHierarchyLevels = [...new Set(data.map((row) => row.hierarchyLevel))].sort();

      // Calculate percentages for each hierarchy level
      const uaeDataset = allHierarchyLevels.map((level) => {
        const match = skillData.find((row) => row.hierarchyLevel === level);
        if (!match || totalSkillCountUAE === 0) return 0;
        return (match.countInUAE / totalSkillCountUAE) * 100;
      });

      const usDataset = allHierarchyLevels.map((level) => {
        const match = skillData.find((row) => row.hierarchyLevel === level);
        if (!match || totalSkillCountUS === 0) return 0;
        return (match.countInUS / totalSkillCountUS) * 100;
      });

      // Calculate statistics
      setStats({
        totalHierarchyLevels: allHierarchyLevels.length,
        uaeTotal: totalSkillCountUAE,
        usTotal: totalSkillCountUS,
      });

      // Configure chart
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color");
      const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
      const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

      const chartDataObj = {
        labels: allHierarchyLevels,
        datasets: [
          {
            label: "UAE",
            backgroundColor: documentStyle.getPropertyValue("--blue-500"),
            borderColor: documentStyle.getPropertyValue("--blue-500"),
            data: uaeDataset,
          },
          {
            label: "US",
            backgroundColor: documentStyle.getPropertyValue("--pink-500"),
            borderColor: documentStyle.getPropertyValue("--pink-500"),
            data: usDataset,
          },
        ],
      };

      const options = {
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
                return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
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
            },
            grid: {
              display: false,
              drawBorder: false,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
              callback: (value) => `${value}%`,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
            beginAtZero: true,
            max: 100,
          },
        },
        animation: {
          duration: 800,
          easing: "easeOutQuart",
        },
      };

      setChartData(chartDataObj);
      setChartOptions(options);
    } catch (err) {
      console.error("Error processing chart data:", err);
      setError(err.message || "Error processing chart data");
    }
  }, [selectedSkill, data]);

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

  if (!chartData || skills.length === 0) {
    return (
      <div className="card surface-card shadow-2 border-round-xl p-4 w-full min-h-[420px]">
        <p className="m-0 text-sm text-color-secondary">No skills found in the dataset.</p>
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
            options={skills}
            placeholder="Choose a skill"
            className="w-full md:w-20rem"
            showClear={false}
            {...dropdownPerfProps}
          />
        </div>

        {/* Statistics cards */}
        <div className="flex gap-2 flex-wrap justify-content-start align-items-center">
          <div className="surface-100 border-round-lg px-3 py-2 text-right">
            <span className="block text-xs text-color-secondary">Hierarchy Levels</span>
            <span className="block text-sm font-semibold">{stats.totalHierarchyLevels}</span>
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

export default BenchmarkingFig8;
