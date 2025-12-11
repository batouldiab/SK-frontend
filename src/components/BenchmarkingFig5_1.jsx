// src/components/BenchmarkingFig5_1.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Chart } from "primereact/chart";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Papa from "papaparse";

const COUNTRY_ALIASES = {
  "United States": "US",
  US: "US",
  "United Arab Emirates": "United Arab Emirates",
  UAE: "United Arab Emirates",
};

const DISPLAY_ALIASES = {
  US: "United States",
  UAE: "United Arab Emirates",
};

const toCsvKey = (name) => COUNTRY_ALIASES[name] || name;
const toDisplayName = (name) => DISPLAY_ALIASES[name] || name;
const fallbackPalette = ["#3b82f6", "#ec4899", "#22c55e", "#f97316", "#a855f7"];
const baseColors = ["--blue-500", "--pink-500", "--green-500", "--orange-500", "--purple-500", "--cyan-500"];

const dropdownPerfProps = {
  filter: true,
  filterDelay: 120,
  resetFilterOnHide: true,
  virtualScrollerOptions: { itemSize: 38, showLoader: true },
  scrollHeight: "260px",
};

const BenchmarkingFig5_1 = ({ selectedCountries = ["United States", "United Arab Emirates"] }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chart data
  const [radarChartData, setRadarChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

  // Processed data
  const [categoryData, setCategoryData] = useState([]);
  const [allSkillsData, setAllSkillsData] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);

  // UI state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categorySkills, setCategorySkills] = useState([]);
  const [datasetVisibility, setDatasetVisibility] = useState({});

  // Unified subcategory bar chart data
  const [subcategoryChartData, setSubcategoryChartData] = useState(null);
  const [subcategoryChartOptions, setSubcategoryChartOptions] = useState({});

  // Load and process CSV data
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

        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              if (!results.data || results.data.length === 0) {
                throw new Error("No valid data found in CSV");
              }

              const metaFields = results.meta?.fields || [];
              const standardizedColumns = metaFields
                .filter((field) => /^Standardized Count /i.test(field))
                .map((field) => ({
                  fieldName: field,
                  country: field.replace(/^Standardized Count\s*/i, "").trim(),
                }));

              if (!standardizedColumns.length) {
                throw new Error("No standardized count columns found");
              }

              setAvailableCountries(standardizedColumns.map((c) => c.country));

              const skillsData = [];

              results.data.forEach((row) => {
                const softSkill = row["Soft Skill"]?.trim();
                const category = row["Category"]?.trim();
                const subcategory = row["Subcategory"]?.trim();

                if (!softSkill || !category) return;

                const values = {};
                standardizedColumns.forEach((col) => {
                  const val = parseFloat(row[col.fieldName]);
                  if (!Number.isNaN(val)) {
                    values[col.country] = val;
                  }
                });

                skillsData.push({
                  softSkill,
                  category,
                  subcategory: subcategory || "N/A",
                  values,
                });
              });

              if (skillsData.length === 0) {
                throw new Error("No valid data found in CSV");
              }

              setAllSkillsData(skillsData);
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
          },
        });
      } catch (err) {
        console.error("Error loading CSV:", err);
        setError(err.message || "Unknown error");
        setLoading(false);
      }
    };

    loadCsv();
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

  // Aggregate data per category for selected countries
  useEffect(() => {
    if (!allSkillsData.length || !selectedCountryConfigs.length) {
      setCategoryData([]);
      setCategorySkills([]);
      setSelectedCategory(null);
      return;
    }

    const selectedKeys = selectedCountryConfigs.map((c) => c.csvKey);
    const categoryMap = new Map();
    const totalsByCountry = Object.fromEntries(selectedKeys.map((key) => [key, 0]));

    allSkillsData.forEach((skill) => {
      const category = skill.category;
      if (!category || category === "Uncategorized") return;

      if (!categoryMap.has(category)) {
        categoryMap.set(category, { category, totals: {}, skillCount: 0 });
      }

      const catData = categoryMap.get(category);
      catData.skillCount += 1;

      selectedKeys.forEach((key) => {
        const value = skill.values[key] || 0;
        catData.totals[key] = (catData.totals[key] || 0) + value;
        totalsByCountry[key] += value;
      });
    });

    const sortKey = selectedKeys[0];

    const categoriesArray = Array.from(categoryMap.values()).map((cat) => {
      const percentages = {};
      selectedKeys.forEach((key) => {
        const total = totalsByCountry[key] || 0;
        percentages[key] = total ? (cat.totals[key] / total) * 100 : 0;
      });
      return { ...cat, percentages };
    });

    categoriesArray.sort((a, b) => (b.percentages[sortKey] || 0) - (a.percentages[sortKey] || 0));

    setCategoryData(categoriesArray);
    setSelectedCategory((prev) => {
      if (prev && categoriesArray.some((c) => c.category === prev)) return prev;
      return categoriesArray[0]?.category || null;
    });
  }, [allSkillsData, selectedCountryConfigs]);

  // Update charts when category data changes
  useEffect(() => {
    if (categoryData.length === 0 || !selectedCountryConfigs.length) {
      setRadarChartData(null);
      return;
    }

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
    const palette = baseColors.map((cssVar) => documentStyle.getPropertyValue(cssVar) || "");

    const getColor = (index) => {
      const resolved = palette[index % palette.length];
      return resolved && resolved.trim() ? resolved.trim() : fallbackPalette[index % fallbackPalette.length];
    };

    const visibleConfigs = selectedCountryConfigs.filter((cfg) => datasetVisibility[cfg.csvKey]);

    const datasets = visibleConfigs.map((cfg, index) => {
      const color = getColor(index);
      return {
        label: `${cfg.displayName} Percentage`,
        borderColor: color,
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointHoverBackgroundColor: textColor,
        pointHoverBorderColor: color,
        backgroundColor: color + "33",
        data: categoryData.map((c) => c.percentages[cfg.csvKey] || 0),
        fill: true,
      };
    });

    const radarData = {
      labels: categoryData.map((c) => c.category),
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
            callback: (value) => `${value.toFixed(1)}%`,
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
  }, [categoryData, selectedCountryConfigs, datasetVisibility]);

  // Update category skills when selected category changes
  useEffect(() => {
    if (!selectedCategory || allSkillsData.length === 0 || !selectedCountryConfigs.length) {
      setCategorySkills([]);
      setSubcategoryChartData(null);
      return;
    }

    const selectedKeys = selectedCountryConfigs.map((c) => c.csvKey);
    const primaryKey = selectedKeys[0];

    const skills = allSkillsData
      .filter((s) => s.category === selectedCategory)
      .sort((a, b) => (b.values[primaryKey] || 0) - (a.values[primaryKey] || 0));

    setCategorySkills(skills);

    // Calculate subcategory aggregates
    const subcategoryMap = new Map();

    skills.forEach((skill) => {
      const subcategory = skill.subcategory;
      if (!subcategoryMap.has(subcategory)) {
        subcategoryMap.set(subcategory, {
          subcategory,
          totals: {},
        });
      }

      const subData = subcategoryMap.get(subcategory);
      selectedKeys.forEach((key) => {
        subData.totals[key] = (subData.totals[key] || 0) + (skill.values[key] || 0);
      });
    });

    const subcategoriesArray = Array.from(subcategoryMap.values());

    // Calculate totals for percentage
    const totalByCountry = Object.fromEntries(selectedKeys.map((key) => [key, 0]));
    subcategoriesArray.forEach((sub) => {
      selectedKeys.forEach((key) => {
        totalByCountry[key] += sub.totals[key] || 0;
      });
    });

    // Calculate percentages
    const subcategoriesWithPercentages = subcategoriesArray.map((sub) => {
      const percentages = {};
      selectedKeys.forEach((key) => {
        const total = totalByCountry[key] || 0;
        percentages[key] = total ? (sub.totals[key] / total) * 100 : 0;
      });
      return { ...sub, percentages };
    });

    // Build unified top subcategories (up to 10 per country)
    const unifiedNames = new Set();
    const unifiedSubcategories = [];

    selectedKeys.forEach((key) => {
      const topForCountry = [...subcategoriesWithPercentages]
        .sort((a, b) => (b.percentages[key] || 0) - (a.percentages[key] || 0))
        .slice(0, 10);

      topForCountry.forEach((sub) => {
        if (!unifiedNames.has(sub.subcategory)) {
          unifiedNames.add(sub.subcategory);
          unifiedSubcategories.push(sub);
        }
      });
    });

    unifiedSubcategories.sort((a, b) => (b.percentages[primaryKey] || 0) - (a.percentages[primaryKey] || 0));

    // Prepare chart data
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const palette = baseColors.map((cssVar) => documentStyle.getPropertyValue(cssVar) || "");

    const getColor = (index) => {
      const resolved = palette[index % palette.length];
      return resolved && resolved.trim() ? resolved.trim() : fallbackPalette[index % fallbackPalette.length];
    };

    const visibleConfigs = selectedCountryConfigs.filter((cfg) => datasetVisibility[cfg.csvKey]);

    // Unified Subcategory Radar Chart with datasets per visible country
    const labels = unifiedSubcategories.map((s) => s.subcategory);
    const subcategoryDatasets = visibleConfigs.map((cfg, index) => {
      const color = getColor(index);
      return {
        label: `${cfg.displayName} Subcategory %`,
        backgroundColor: color + "33",
        borderColor: color,
        pointBackgroundColor: color,
        pointBorderColor: color,
        borderWidth: 2,
        data: labels.map((label) => {
          const sub = unifiedSubcategories.find((s) => s.subcategory === label);
          return sub?.percentages[cfg.csvKey] || 0;
        }),
        fill: true,
      };
    });

    const allDataPoints = subcategoryDatasets.flatMap((ds) => ds.data);
    const maxPercentage = allDataPoints.length ? Math.max(...allDataPoints) : 0;
    const yAxisMax = Math.ceil((maxPercentage || 0) * 1.1);

    const unifiedSubData = subcategoryDatasets.length
      ? {
          labels,
          datasets: subcategoryDatasets,
        }
      : null;

    const subChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.9,
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
              const value = context.parsed.r || 0;
              return `${context.dataset.label}: ${value.toFixed(2)}%`;
            },
          },
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          suggestedMax: yAxisMax || 10,
          ticks: {
            color: textColorSecondary,
            callback: function (value) {
              return value + "%";
            },
            backdropColor: "transparent",
          },
          grid: {
            color: surfaceBorder,
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

    setSubcategoryChartData(unifiedSubData);
    setSubcategoryChartOptions(subChartOptions);
  }, [selectedCategory, allSkillsData, selectedCountryConfigs, datasetVisibility]);

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
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Category Distribution</h3>
        <p className="text-blue-700">Error loading chart data: {error}</p>
      </div>
    );
  }

  if (!radarChartData) return null;

  const documentStyle = getComputedStyle(document.documentElement);
  const palette = baseColors.map((cssVar) => documentStyle.getPropertyValue(cssVar) || "");
  const getColor = (index) => {
    const resolved = palette[index % palette.length];
    return resolved && resolved.trim() ? resolved.trim() : fallbackPalette[index % fallbackPalette.length];
  };

  const visibleConfigs = selectedCountryConfigs.filter((cfg) => datasetVisibility[cfg.csvKey]);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-full min-h-[420px] flex flex-col">
      <div className="justify-content-between align-items-start mb-3 gap-3 w-full">
        <div>
          {/* Statistics cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 mb-2">
            <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                Total Categories
              </p>
              <p className="text-2xl font-bold text-slate-800">
                {categoryData.length}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
                Total Skills
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {allSkillsData.length}
              </p>
            </div>
          </div>

          {/* Chart toggles */}
          <div className="flex flex-wrap gap-4 mt-4 align-items-center">
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
      </div>
      <h4 className="text-sm font-semibold mb-3">
        Top Soft Skills Category Distribution (%)
      </h4>
      {/* Radar chart for all categories */}
      <div className="w-full mt-3 flex flex-col justify-content-center align-items-center">
        <div style={{ width: "100%", maxWidth: "820px", height: "460px" }}>
          <Chart type="radar" data={radarChartData} options={chartOptions} className="w-full h-full" />
        </div>
      </div>

      {/* Category selector & skills list */}
      <div className="w-full mt-4 pt-3 border-top-1 surface-border">
        <h3 className="text-sm font-semibold mb-2">
          Explore skills by category
        </h3>
        <div className="flex flex-col gap-3">
          <Dropdown
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.value)}
            options={categoryData.map((c) => c.category)}
            placeholder="Select a category"
            className="w-full md:w-20rem"
            showClear
            {...dropdownPerfProps}
          />

          {selectedCategory && categorySkills.length > 0 && (
            <div className="surface-50 border-round-lg p-3">
              <div className="flex justify-content-between align-items-center mb-3">
                <h4 className="text-sm font-semibold m-0">
                  Skills in "{selectedCategory}"
                </h4>
                <span className="text-xs text-color-secondary">
                  {categorySkills.length} skills
                </span>
              </div>

              <DataTable
                value={categorySkills}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                className="text-sm"
                emptyMessage="No skills found"
                stripedRows
                size="small"
              >
                <Column
                  field="softSkill"
                  header="Soft Skill"
                  sortable
                  body={(rowData) => rowData.softSkill.toLocaleString()}
                  style={{ minWidth: "200px" }}
                />
                <Column
                  field="subcategory"
                  header="Subcategory"
                  sortable
                  body={(rowData) => rowData.subcategory.toLocaleString()}
                  style={{ minWidth: "150px" }}
                />
                {selectedCountryConfigs.map((country) => (
                  <Column
                    key={country.csvKey}
                    field={country.csvKey}
                    header={`Standardized Count ${country.displayName}`}
                    sortable
                    body={(rowData) => (rowData.values[country.csvKey] || 0).toLocaleString()}
                    style={{ minWidth: "140px" }}
                  />
                ))}
              </DataTable>

              {/* Unified Subcategory Bar Chart */}
              {subcategoryChartData && visibleConfigs.length > 0 && (
                <div className="mt-4 pt-3 border-top-1 surface-border">
                  <h4 className="text-sm font-semibold mb-3">
                    Top Soft Skills Subcategory Distribution (%)
                  </h4>
                  <div style={{ width: "100%", height: "400px" }}>
                    <Chart
                      type="radar"
                      data={subcategoryChartData}
                      options={subcategoryChartOptions}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BenchmarkingFig5_1;
