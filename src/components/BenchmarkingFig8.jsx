// src/components/BenchmarkingFig8.jsx
import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import Papa from "papaparse";
import { AgCharts } from "ag-charts-react";
import "ag-charts-enterprise";

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
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Chart data
  const [heatmapOptions, setHeatmapOptions] = useState(null);

  // Statistics
  const [stats, setStats] = useState({
    totalHierarchyLevels: 0,
    selectedSkillCount: 0,
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

        // Preselect a small set to render the heatmap immediately
        setSelectedSkills(skillOptions.slice(0, 3).map((s) => s.value));

        setLoading(false);
      } catch (err) {
        console.error("Error loading CSV file:", err);
        setError(err.message || "Unknown error loading data");
        setLoading(false);
      }
    };

    loadCsvFile();
  }, []);

  // Update chart when selected skills change
  useEffect(() => {
    if (selectedSkills.length === 0 || data.length === 0) {
      setHeatmapOptions(null);
      return;
    }

    try {
      // Get all unique hierarchy levels from entire dataset
      const allHierarchyLevels = [...new Set(data.map((row) => row.hierarchyLevel))].sort();

      const heatmapData = [];

      selectedSkills.forEach((skill) => {
        const skillData = data.filter((row) => row.skill === skill);

        // Calculate totals to turn counts into percentages per country
        const totalSkillCountUAE = skillData.reduce((sum, row) => sum + row.countInUAE, 0);
        const totalSkillCountUS = skillData.reduce((sum, row) => sum + row.countInUS, 0);

        allHierarchyLevels.forEach((level) => {
          const match = skillData.find((row) => row.hierarchyLevel === level);
          const uaePercentage =
            totalSkillCountUAE > 0 && match ? (match.countInUAE / totalSkillCountUAE) * 100 : 0;
          const usPercentage =
            totalSkillCountUS > 0 && match ? (match.countInUS / totalSkillCountUS) * 100 : 0;

          heatmapData.push({
            skill,
            hierarchyLevel: level,
            rowLabel: `${skill} - UAE`,
            country: "UAE",
            percentage: uaePercentage,
            absolute: match?.countInUAE ?? 0,
          });

          heatmapData.push({
            skill,
            hierarchyLevel: level,
            rowLabel: `${skill} - US`,
            country: "US",
            percentage: usPercentage,
            absolute: match?.countInUS ?? 0,
          });
        });
      });

      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color") || "#111827";
      const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary") || "#6b7280";

      const maxValue = Math.max(...heatmapData.map((d) => d.percentage), 0);

      setStats({
        totalHierarchyLevels: allHierarchyLevels.length,
        selectedSkillCount: selectedSkills.length,
      });

      setHeatmapOptions({
        data: heatmapData,
        title: {
          text: "Share of hierarchy levels by skill and country",
        },
        series: [
          {
            type: "heatmap",
            xKey: "hierarchyLevel",
            xName: "Hierarchy Level",
            yKey: "rowLabel",
            yName: "Skill / Country",
            colorKey: "percentage",
            colorName: "Share (%)",
            colorRange: ["#e0f2fe", "#1d4ed8"],
            colorDomain: [0, Math.max(100, Math.ceil(maxValue))],
            label: {
              formatter: ({ value }) => `${value.toFixed(1)}%`,
              color: textColor,
            },
            tooltip: {
              renderer: ({ datum }) => {
                return {
                  title: datum.rowLabel,
                  content: `${datum.hierarchyLevel}: ${datum.percentage.toFixed(2)}% (${datum.absolute.toLocaleString()} postings)`,
                };
              },
            },
          },
        ],
        axes: [
          {
            type: "category",
            position: "top",
            label: {
              rotation: -90,
              color: textColorSecondary,
            },
          },
          {
            type: "category",
            position: "left",
            label: {
              color: textColorSecondary,
            },
          },
        ],
        gradientLegend: {
          position: "right",
        },
      });
    } catch (err) {
      console.error("Error processing chart data:", err);
      setError(err.message || "Error processing chart data");
    }
  }, [selectedSkills, data]);

  if (loading) {
    return (
      <div className="card surface-card shadow-2 border-round-xl p-4 w-full min-h-[420px] flex flex-col">
        <div className="text-sm text-color-secondary mb-2">
          Loading chart data...
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

  if (skills.length === 0) {
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
            Select Skills
          </label>
          <MultiSelect
            inputId="skill-select"
            value={selectedSkills}
            onChange={(e) => setSelectedSkills(e.value)}
            options={skills}
            placeholder="Choose one or more skills"
            className="w-full md:w-20rem"
            display="chip"
            showClear
            showSelectAll = {false}
            {...dropdownPerfProps}
          />
        </div>

        {/* Statistics cards */}
        <div className="flex gap-2 flex-wrap justify-content-start align-items-center">
          <div className="surface-100 border-round-lg px-3 py-2 text-right">
            <span className="block text-xs text-color-secondary">Hierarchy Levels</span>
            <span className="block text-sm font-semibold">{stats.totalHierarchyLevels}</span>
          </div>
          <div className="surface-100 border-round-lg px-3 py-2 text-right">
            <span className="block text-xs text-color-secondary">Skills Selected</span>
            <span className="block text-sm font-semibold">{stats.selectedSkillCount}</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1" style={{ minHeight: "400px" }}>
        {heatmapOptions ? (
          <AgCharts options={heatmapOptions} className="w-full h-full" />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-color-secondary">
            Select at least one skill to view the heatmap.
          </div>
        )}
      </div>
    </div>
  );
};

export default BenchmarkingFig8;



