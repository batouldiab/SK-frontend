// src/components/BenchmarkingFig8.jsx
import React, { useEffect, useMemo, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import Papa from "papaparse";
import { AgCharts } from "ag-charts-react";
import "ag-charts-enterprise";

const COUNTRY_ALIASES = {
  "United States": "US",
  US: "US",
  "United Arab Emirates": "United_Arab_Emirates",
  UAE: "United_Arab_Emirates",
};

const DISPLAY_ALIASES = {
  US: "United States",
  United_Arab_Emirates: "United Arab Emirates",
};

const toCsvKey = (name) => COUNTRY_ALIASES[name] || name.replace(/\s+/g, "_");
const toDisplayName = (name) => DISPLAY_ALIASES[name] || name.replace(/_/g, " ");

const fallbackPalette = ["#3b82f6", "#ec4899", "#22c55e", "#f97316", "#a855f7"];
const baseColors = ["--blue-500", "--pink-500", "--green-500", "--orange-500", "--purple-500", "--cyan-500"];

const dropdownPerfProps = {
  filter: true,
  filterDelay: 120,
  resetFilterOnHide: true,
  virtualScrollerOptions: { itemSize: 38, showLoader: true },
  scrollHeight: "260px",
};

const BenchmarkingFig8 = ({ selectedCountries = ["United States", "United Arab Emirates"] }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Raw data from CSV
  const [data, setData] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);

  // Hard-skill categories and top skills per category (from Fig 4/5 dataset)
  const [categorySkillData, setCategorySkillData] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categorySkillOptions, setCategorySkillOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Skills available in the heatmap (filtered by category)
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [datasetVisibility, setDatasetVisibility] = useState({});

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

        const response = await fetch("/data/benchmarking_fig8_9.csv");
        if (!response.ok) {
          throw new Error(`HTTP error loading data! status: ${response.status}`);
        }
        const text = await response.text();

        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              const metaFields = results.meta?.fields || [];
              const countColumns = metaFields
                .filter((field) => /^count_in_/i.test(field))
                .map((field) => ({
                  fieldName: field,
                  country: field.replace(/^count_in_/i, ""),
                }));

              if (!countColumns.length) {
                throw new Error("No country count columns found");
              }

              setAvailableCountries(countColumns.map((c) => c.country));

              const processed = results.data
                .map((row) => {
                  const skill = row["Skill"]?.trim() || row[metaFields[0]]?.trim() || "";
                  const hierarchyLevel = row["hierarchy_level_1"]?.trim() || "";
                  if (!skill || !hierarchyLevel) return null;

                  const values = {};
                  countColumns.forEach((col) => {
                    const val = parseFloat(row[col.fieldName]);
                    if (!Number.isNaN(val)) {
                      values[col.country] = val;
                    }
                  });

                  return {
                    skill,
                    hierarchyLevel,
                    values,
                  };
                })
                .filter(Boolean);

              if (!processed.length) {
                throw new Error("No valid data found in CSV file");
              }

              setData(processed);

              setLoading(false);
            } catch (err) {
              console.error("Error processing CSV:", err);
              setError(err.message || "Error processing data");
              setLoading(false);
            }
          },
          error: (err) => {
            console.error("Error parsing CSV:", err);
            setError(err.message || "Error parsing CSV");
            setLoading(false);
          },
        });
      } catch (err) {
        console.error("Error loading CSV file:", err);
        setError(err.message || "Unknown error loading data");
        setLoading(false);
      }
    };

    loadCsvFile();
  }, []);

  // Load hard-skill categories & standardized counts (Fig 4/5) to build top-skill lists
  useEffect(() => {
    const loadCategorySkills = async () => {
      try {
        const response = await fetch("/data/benchmarking_fig4_5.csv");
        if (!response.ok) return;

        const text = await response.text();

        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              const metaFields = results.meta?.fields || [];
              const standardizedColumns = metaFields
                .filter((field) => /^Standardized Count /i.test(field))
                .map((field) => {
                  const countryName = field.replace(/^Standardized Count\s*/i, "").trim();
                  return {
                    fieldName: field,
                    country: toCsvKey(countryName),
                  };
                });

              if (!standardizedColumns.length) return;

              const processed = [];
              const categoriesSet = new Set();

              results.data.forEach((row) => {
                const skill = row["Hard Skill"]?.trim();
                const category = row["Category"]?.trim();
                if (!skill || !category || category === "Uncategorized") return;

                const values = {};
                standardizedColumns.forEach((col) => {
                  const val = parseFloat(row[col.fieldName]);
                  if (!Number.isNaN(val)) {
                    values[col.country] = val;
                  }
                });

                processed.push({ skill, category, values });
                categoriesSet.add(category);
              });

              if (!processed.length) return;

              setCategorySkillData(processed);
              const sortedCategories = [...categoriesSet].sort().map((cat) => ({ label: cat, value: cat }));
              setCategoryOptions([{ label: "ALL", value: "ALL" }, ...sortedCategories]);
            } catch (err) {
              console.error("Error processing category skill data:", err);
            }
          },
          error: (err) => {
            console.error("Error parsing category skill CSV:", err);
          },
        });
      } catch (err) {
        console.error("Error loading category skill CSV:", err);
      }
    };

    loadCategorySkills();
  }, []);

  // Determine which country datasets are available from selectedCountries
  const selectedCountryConfigs = useMemo(
    () =>
      selectedCountries
        .map((name) => ({
          displayName: toDisplayName(name),
          csvKey: toCsvKey(name),
        }))
        .filter((cfg) => availableCountries.includes(cfg.csvKey)),
    [selectedCountries, availableCountries]
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

  const visibleCountryConfigs = useMemo(
    () => selectedCountryConfigs.filter((cfg) => datasetVisibility[cfg.csvKey]),
    [selectedCountryConfigs, datasetVisibility]
  );

  const heatmapSkillsSet = useMemo(() => new Set(data.map((row) => row.skill)), [data]);
  const skillsByCountry = useMemo(() => {
    const map = new Map();
    data.forEach((row) => {
      Object.keys(row.values || {}).forEach((country) => {
        if (!map.has(country)) {
          map.set(country, new Set());
        }
        map.get(country).add(row.skill);
      });
    });
    return map;
  }, [data]);

  // Build unified top skills for the selected category based on standardized counts per country
  useEffect(() => {
    if (!selectedCategory) {
      setCategorySkillOptions([]);
      setSelectedSkills([]);
      return;
    }

    const pool =
      selectedCategory === "ALL"
        ? categorySkillData
        : categorySkillData.filter((item) => item.category === selectedCategory);

    const filtered = pool.filter((item) => heatmapSkillsSet.has(item.skill));

    if (!filtered.length) {
      setCategorySkillOptions([]);
      setSelectedSkills([]);
      return;
    }

    const countryOrder = (visibleCountryConfigs.length ? visibleCountryConfigs : selectedCountryConfigs).slice(0, 3);
    if (!countryOrder.length) {
      setCategorySkillOptions([]);
      setSelectedSkills([]);
      return;
    }

    const seen = new Set();
    const unified = [];

    const countrySkillRequirement = (skill) =>
      countryOrder.every((cfg) => skillsByCountry.get(cfg.csvKey)?.has(skill));

    countryOrder.forEach((cfg) => {
      const sorted = [...filtered].sort(
        (a, b) => (b.values[cfg.csvKey] || 0) - (a.values[cfg.csvKey] || 0)
      );

      sorted.slice(0, 10).forEach((skillEntry) => {
        if (!seen.has(skillEntry.skill) && countrySkillRequirement(skillEntry.skill)) {
          seen.add(skillEntry.skill);
          unified.push(skillEntry);
        }
      });
    });

    const primaryKey = countryOrder[0]?.csvKey;
    if (primaryKey) {
      unified.sort((a, b) => (b.values[primaryKey] || 0) - (a.values[primaryKey] || 0));
    }

    const options = unified.map((entry) => ({ label: entry.skill, value: entry.skill }));
    setCategorySkillOptions(options);
    setSelectedSkills((prev) => {
      const stillValid = prev.filter((skill) => options.some((opt) => opt.value === skill));
      if (stillValid.length) return stillValid;
      return options.slice(0, Math.min(3, options.length)).map((opt) => opt.value);
    });
  }, [
    selectedCategory,
    categorySkillData,
    heatmapSkillsSet,
    visibleCountryConfigs,
    selectedCountryConfigs,
    skillsByCountry,
  ]);

  // Update chart when selected skills or visibility changes
  useEffect(() => {
    if (
      selectedSkills.length === 0 ||
      data.length === 0 ||
      !selectedCountryConfigs.length ||
      !selectedCategory
    ) {
      setHeatmapOptions(null);
      setStats({
        totalHierarchyLevels: 0,
        selectedSkillCount: selectedSkills.length,
      });
      return;
    }

    try {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color") || "#111827";
      const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary") || "#6b7280";
      const palette = baseColors.map((cssVar) => documentStyle.getPropertyValue(cssVar) || "");
      const getColor = (index) => {
        const resolved = palette[index % palette.length];
        return resolved && resolved.trim() ? resolved.trim() : fallbackPalette[index % fallbackPalette.length];
      };

      const visibleConfigs = selectedCountryConfigs.filter((cfg) => datasetVisibility[cfg.csvKey]);
      if (!visibleConfigs.length) {
        setHeatmapOptions(null);
        setStats({
          totalHierarchyLevels: 0,
          selectedSkillCount: selectedSkills.length,
        });
        return;
      }

      const allHierarchyLevels = [...new Set(data.map((row) => row.hierarchyLevel))].sort();
      const heatmapData = [];

      selectedSkills.forEach((skill) => {
        const skillData = data.filter((row) => row.skill === skill);

        visibleConfigs.forEach((cfg) => {
          const totalCount = skillData.reduce((sum, row) => sum + (row.values[cfg.csvKey] || 0), 0);

          allHierarchyLevels.forEach((level) => {
            const match = skillData.find((row) => row.hierarchyLevel === level);
            const percentage =
              totalCount > 0 && match ? ((match.values[cfg.csvKey] || 0) / totalCount) * 100 : 0;

            heatmapData.push({
              skill,
              hierarchyLevel: level,
              rowLabel: `${skill} - ${cfg.displayName}`,
              country: cfg.displayName,
              percentage,
              absolute: match?.values[cfg.csvKey] ?? 0,
              color: getColor(visibleConfigs.indexOf(cfg)),
            });
          });
        });
      });

      const maxValue = Math.max(...heatmapData.map((d) => d.percentage), 0);

      setStats({
        totalHierarchyLevels: allHierarchyLevels.length,
        selectedSkillCount: selectedSkills.length,
      });

      setHeatmapOptions({
        data: heatmapData,
        padding: {
          top: 80,
          right: 50,
          bottom: 50,
          left: 12,
        },
        footnote: {
          text: "Count of hierarchy levels by skill and country",
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
              color: textColorSecondary,
              rotation: -35,
              autoRotate: false,
              autoWrap: true,
              avoidCollisions: false,
              maxWidth: 120,
              padding: 4,
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
          padding: { top: 120},
        },
      });
    } catch (err) {
      console.error("Error processing chart data:", err);
      setError(err.message || "Error processing chart data");
    }
  }, [selectedSkills, data, selectedCountryConfigs, datasetVisibility, selectedCategory]);

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
        <p className="m-0 text-sm text-red-500">Error loading chart data: {error}</p>
      </div>
    );
  }

  if (!selectedCountryConfigs.length || data.length === 0) {
    return (
      <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 w-full">
        <p className="text-blue-700">No skills found in the dataset.</p>
      </div>
    );
  }

  const documentStyle = getComputedStyle(document.documentElement);
  const palette = baseColors.map((cssVar) => documentStyle.getPropertyValue(cssVar) || "");
  const getColor = (index) => {
    const resolved = palette[index % palette.length];
    return resolved && resolved.trim() ? resolved.trim() : fallbackPalette[index % fallbackPalette.length];
  };

  return (
     <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-full min-h-[420px] flex flex-col">
      {/* Header with skill selector */}
      <div className="mb-3">
        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <p className="m-0">
            Pick a <strong>category</strong> to load its top skills; choose <strong>ALL</strong> to use the unified top distinct skills across all categories (section 2 logic). The skill list shows the deduplicated top skills ranked by the first visible country; toggling country visibility reshapes this list.
          </p>
          <p className="mt-2 mb-0">
            Select one or more skills to see a heatmap of their share across hierarchy levels and countries you have toggled on. Darker cells indicate a higher count of postings for that hierarchy level within the skill/country.
          </p>
        </div>

        {/* Category selector */}
        <div className="mb-3">
          <label htmlFor="category-select" className="block text-sm font-semibold mb-2 text-color-secondary">
            Select Category
          </label>
          <Dropdown
            inputId="category-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.value);
              setSelectedSkills([]);
            }}
            options={categoryOptions}
            placeholder="Choose a category"
            className="w-full md:w-20rem"
            showClear
            {...dropdownPerfProps}
          />
        </div>

        {/* Skill selector */}
        <div className="mb-3">
          <label htmlFor="skill-select" className="block text-sm font-semibold mb-2 text-color-secondary">
            Select Skills{" "}
            {selectedCategory === "ALL"
              ? "(Unified Top Distinct Skills from Fig 4 logic)"
              : "(top skills for chosen category)"}
          </label>
          <MultiSelect
            inputId="skill-select"
            value={selectedSkills}
            onChange={(e) => setSelectedSkills(e.value)}
            options={categorySkillOptions}
            placeholder={selectedCategory ? "Choose one or more skills" : "Pick a category first"}
            className="w-full md:w-20rem"
            display="chip"
            showClear
            showSelectAll={false}
            disabled={!selectedCategory || categorySkillOptions.length === 0}
            {...dropdownPerfProps}
          />
          {!selectedCategory && (
            <p className="text-xs text-color-secondary mt-1">
              Select a category to load the unified top skills list for the selected countries.
            </p>
          )}
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 mb-2">
          <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
              Hierarchy Levels
            </p>
            <p className="text-2xl font-bold text-slate-800">
              {stats.totalHierarchyLevels}
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
              Skills Selected
            </p>
            <p className="text-2xl font-bold text-blue-700">
              {stats.selectedSkillCount}
            </p>
          </div>
        </div>

        {/* Chart toggles */}
        <div className="flex gap-4 mt-4 align-items-center flex-wrap">
          <span className="text-sm font-semibold text-color-secondary">
            Show datasets:
          </span>
          {selectedCountryConfigs.map((country, index) => {
            const id = `toggle-${country.csvKey}`.replace(/\s+/g, "-").toLowerCase();
            const color = getColor(index);
            return (
              <div className="flex align-items-center gap-2" key={country.csvKey}>
                <Checkbox
                  inputId={id}
                  checked={!!datasetVisibility[country.csvKey]}
                  onChange={(e) =>
                    setDatasetVisibility((prev) => ({
                      ...prev,
                      [country.csvKey]: e.checked,
                    }))
                  }
                />
                <label
                  htmlFor={id}
                  className="text-sm cursor-pointer select-none"
                  style={{ color }}
                >
                  {country.displayName}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1" style={{ minHeight: "400px" }}>
        {heatmapOptions ? (
          <AgCharts options={heatmapOptions} className="w-full h-full" />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-color-secondary">
            Select a category, pick at least one skill, and toggle a dataset to view the heatmap.
          </div>
        )}
      </div>
    </div>
  );
};

export default BenchmarkingFig8;
