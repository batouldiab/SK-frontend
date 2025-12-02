// src/components/BenchmarkingFig5_1.jsx
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Papa from "papaparse";

const BenchmarkingFig5_1 = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chart data
  const [uaeChartData, setUaeChartData] = useState(null);
  const [usChartData, setUsChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

  // Processed data
  const [categoryData, setCategoryData] = useState([]);
  const [allSkillsData, setAllSkillsData] = useState([]);
  
  // UI state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categorySkills, setCategorySkills] = useState([]);
  const [showUAEChart, setShowUAEChart] = useState(true);
  const [showUSChart, setShowUSChart] = useState(true);

  // Subcategory bar chart data
  const [uaeSubcategoryChartData, setUaeSubcategoryChartData] = useState(null);
  const [usSubcategoryChartData, setUsSubcategoryChartData] = useState(null);
  const [subcategoryChartOptions, setSubcategoryChartOptions] = useState({});

  // Color palette for categories
  const colorPalette = [
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
    "#ef4444", // red
    "#84cc16", // lime
    "#0ea5e9", // sky
    "#d946ef", // fuchsia
    "#f43f5e", // rose
  ];

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

              const skillsData = [];
              const categoryMap = new Map();

              // Parse all rows
              results.data.forEach((row) => {
                const softSkill = row["Soft Skill"]?.trim();
                const category = row["Category"]?.trim();
                const subcategory = row["Subcategory"]?.trim();
                const uaeCount = parseFloat(row["Standardized Count UAE"]) || 0;
                const usCount = parseFloat(row["Standardized Count US"]) || 0;

                if (!softSkill || !category) return;

                // Store skill data
                skillsData.push({
                  softSkill,
                  category,
                  subcategory: subcategory || "N/A",
                  uaeCount,
                  usCount,
                });

                // Aggregate by category
                if (!categoryMap.has(category)) {
                  categoryMap.set(category, {
                    category,
                    uaeTotal: 0,
                    usTotal: 0,
                    skillCount: 0,
                  });
                }

                const catData = categoryMap.get(category);
                catData.uaeTotal += uaeCount;
                catData.usTotal += usCount;
                catData.skillCount += 1;
              });

              if (skillsData.length === 0) {
                throw new Error("No valid data found in CSV");
              }

              // Calculate totals
              const uaeTotalCount = skillsData.reduce((sum, s) => sum + s.uaeCount, 0);
              const usTotalCount = skillsData.reduce((sum, s) => sum + s.usCount, 0);

              // Convert category map to array with percentages
              const categoriesArray = Array.from(categoryMap.values()).map((cat) => ({
                ...cat,
                uaePercentage: (cat.uaeTotal / uaeTotalCount) * 100,
                usPercentage: (cat.usTotal / usTotalCount) * 100,
              }));

              // Sort by UAE percentage descending
              categoriesArray.sort((a, b) => b.uaePercentage - a.uaePercentage);

              setCategoryData(categoriesArray);
              setAllSkillsData(skillsData);
              setSelectedCategory(categoriesArray[0]?.category || null);

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

  // Update charts when category data changes
  useEffect(() => {
    if (categoryData.length === 0) return;

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");

    // Assign colors to categories
    const colors = categoryData.map((_, idx) => colorPalette[idx % colorPalette.length]);
    const backgroundColors = colors.map((c) => c + "CC");

    // UAE Chart Data
    const uaeData = {
      labels: categoryData.map((c) => c.category),
      datasets: [
        {
          data: categoryData.map((c) => c.uaePercentage),
          backgroundColor: backgroundColors,
          borderColor: colors,
          borderWidth: 2,
        },
      ],
    };

    // US Chart Data
    const usData = {
      labels: categoryData.map((c) => c.category),
      datasets: [
        {
          data: categoryData.map((c) => c.usPercentage),
          backgroundColor: backgroundColors,
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
          position: "bottom",
          labels: {
            color: textColor,
            usePointStyle: true,
            font: {
              size: 11,
            },
            padding: 15,
            boxWidth: 15,
            boxHeight: 15,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.parsed || 0;
              return `${label}: ${value.toFixed(2)}%`;
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
  }, [categoryData]);

  // Update category skills when selected category changes
  useEffect(() => {
    if (!selectedCategory || allSkillsData.length === 0) {
      setCategorySkills([]);
      setUaeSubcategoryChartData(null);
      setUsSubcategoryChartData(null);
      return;
    }

    const skills = allSkillsData
      .filter((s) => s.category === selectedCategory)
      .sort((a, b) => b.uaeCount - a.uaeCount);

    setCategorySkills(skills);

    // Calculate subcategory aggregates
    const subcategoryMap = new Map();
    
    skills.forEach((skill) => {
      const subcategory = skill.subcategory;
      if (!subcategoryMap.has(subcategory)) {
        subcategoryMap.set(subcategory, {
          subcategory,
          uaeTotal: 0,
          usTotal: 0,
        });
      }
      
      const subData = subcategoryMap.get(subcategory);
      subData.uaeTotal += skill.uaeCount;
      subData.usTotal += skill.usCount;
    });

    const subcategoriesArray = Array.from(subcategoryMap.values());
    
    // Calculate totals for percentage
    const uaeTotal = subcategoriesArray.reduce((sum, sub) => sum + sub.uaeTotal, 0);
    const usTotal = subcategoriesArray.reduce((sum, sub) => sum + sub.usTotal, 0);
    
    // Calculate percentages
    const subcategoriesWithPercentages = subcategoriesArray.map((sub) => ({
      ...sub,
      uaePercentage: uaeTotal > 0 ? (sub.uaeTotal / uaeTotal) * 100 : 0,
      usPercentage: usTotal > 0 ? (sub.usTotal / usTotal) * 100 : 0,
    }));

    // Sort by UAE percentage descending
    subcategoriesWithPercentages.sort((a, b) => b.uaePercentage - a.uaePercentage);

    // Find the maximum percentage across both UAE and US for dynamic y-axis
    const maxUaePercentage = Math.max(...subcategoriesWithPercentages.map(s => s.uaePercentage), 0);
    const maxUsPercentage = Math.max(...subcategoriesWithPercentages.map(s => s.usPercentage), 0);
    const maxPercentage = Math.max(maxUaePercentage, maxUsPercentage);
    // Add 10% padding to the max for better visualization
    const yAxisMax = Math.ceil(maxPercentage * 1.1);

    // Generate colors for subcategories
    const subcategoryColors = subcategoriesWithPercentages.map((_, idx) => 
      colorPalette[idx % colorPalette.length]
    );
    const subcategoryBackgroundColors = subcategoryColors.map((c) => c + "AA");

    // Prepare chart data
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    // UAE Subcategory Chart
    const uaeSubData = {
      labels: subcategoriesWithPercentages.map((s) => s.subcategory),
      datasets: [
        {
          label: 'UAE Subcategory %',
          data: subcategoriesWithPercentages.map((s) => s.uaePercentage),
          backgroundColor: subcategoryBackgroundColors,
          borderColor: subcategoryColors,
          borderWidth: 1,
        },
      ],
    };

    // US Subcategory Chart
    const usSubData = {
      labels: subcategoriesWithPercentages.map((s) => s.subcategory),
      datasets: [
        {
          label: 'US Subcategory %',
          data: subcategoriesWithPercentages.map((s) => s.usPercentage),
          backgroundColor: subcategoryBackgroundColors,
          borderColor: subcategoryColors,
          borderWidth: 1,
        },
      ],
    };

    const subChartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.parsed.y || 0;
              return `${context.dataset.label}: ${value.toFixed(2)}%`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: yAxisMax,
          ticks: {
            color: textColorSecondary,
            callback: function(value) {
              return value + '%';
            }
          },
          grid: {
            color: surfaceBorder,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setUaeSubcategoryChartData(uaeSubData);
    setUsSubcategoryChartData(usSubData);
    setSubcategoryChartOptions(subChartOptions);

  }, [selectedCategory, allSkillsData]);

  // Calculate dynamic height based on number of categories
  // Base height for chart + additional height per legend item
  const calculateChartHeight = () => {
    const baseChartSize = 350; // Size of the doughnut itself
    const legendItemHeight = 25; // Approximate height per legend item
    const legendPadding = 40; // Extra padding for legend area
    const itemsPerRow = Math.floor(500 / 120); // Approximate items that fit in one row
    const rows = Math.ceil(categoryData.length / itemsPerRow);
    const legendHeight = rows * legendItemHeight + legendPadding;
    
    return baseChartSize + legendHeight;
  };

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
        <h2 className="m-0 mb-2 text-xl">Category Distribution: UAE vs US</h2>
        <p className="m-0 text-sm text-red-500">
          Error loading chart data: {error}
        </p>
      </div>
    );
  }

  if (!uaeChartData || !usChartData) return null;

  const totalUAECount = categoryData.reduce((sum, c) => sum + c.uaeTotal, 0);
  const totalUSCount = categoryData.reduce((sum, c) => sum + c.usTotal, 0);
  const chartHeight = calculateChartHeight();

  return (
    <div className="card surface-card shadow-2 border-round-xl p-4 w-full min-h-[420px] flex flex-col">
      <div className="justify-content-between align-items-start mb-3 gap-3 w-full">
        <div>
          {/* Statistics cards */}
          <div className="flex gap-2 flex-wrap justify-content-start align-items-center mt-3">
            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Total Categories
              </span>
              <span className="block text-sm font-semibold">
                {categoryData.length}
              </span>
            </div>
            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Total Skills
              </span>
              <span className="block text-sm font-semibold">
                {allSkillsData.length}
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

      {/* Charts area - two adjacent doughnut charts */}
      <div className="w-full mt-3 flex flex-col md:flex-row gap-4 justify-content-center align-items-center">
        {/* UAE Chart */}
        {showUAEChart && (
          <div
            className="flex flex-col align-items-center"
            style={{ flex: 1, minWidth: "300px", maxWidth: "500px" }}
          >
            <h3
              className="text-md font-semibold mb-2"
              style={{ color: "var(--blue-500)" }}
            >
              UAE Category Distribution
            </h3>
            <div style={{ width: "100%", height: `${chartHeight}px` }}>
              <Chart
                type="doughnut"
                data={uaeChartData}
                options={chartOptions}
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* US Chart */}
        {showUSChart && (
          <div
            className="flex flex-col align-items-center"
            style={{ flex: 1, minWidth: "300px", maxWidth: "500px" }}
          >
            <h3
              className="text-md font-semibold mb-2"
              style={{ color: "var(--pink-500)" }}
            >
              US Category Distribution
            </h3>
            <div style={{ width: "100%", height: `${chartHeight}px` }}>
              <Chart
                type="doughnut"
                data={usChartData}
                options={chartOptions}
                className="w-full h-full"
              />
            </div>
          </div>
        )}
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
                  style={{ minWidth: "200px" }}
                />
                <Column
                  field="subcategory"
                  header="Subcategory"
                  sortable
                  style={{ minWidth: "150px" }}
                />
                <Column
                  field="uaeCount"
                  header="Standardized Count UAE"
                  sortable
                  body={(rowData) => rowData.uaeCount.toLocaleString()}
                  style={{ minWidth: "120px" }}
                />
                <Column
                  field="usCount"
                  header="Standardized Count US"
                  sortable
                  body={(rowData) => rowData.usCount.toLocaleString()}
                  style={{ minWidth: "120px" }}
                />
              </DataTable>

              {/* Subcategory Bar Charts */}
              {uaeSubcategoryChartData && usSubcategoryChartData && (
                <div className="mt-4 pt-3 border-top-1 surface-border">
                  <h4 className="text-sm font-semibold mb-3">
                    Subcategory Distribution (%)
                  </h4>
                  <div className="w-full flex flex-col md:flex-row gap-4">
                    {/* UAE Subcategory Bar Chart */}
                    <div className="flex flex-col" style={{ flex: 1 }}>
                      <h5
                        className="text-sm font-semibold mb-2 text-center"
                        style={{ color: "var(--blue-500)" }}
                      >
                        UAE Subcategories
                      </h5>
                      <div style={{ width: "100%", height: "400px" }}>
                        <Chart
                          type="bar"
                          data={uaeSubcategoryChartData}
                          options={subcategoryChartOptions}
                          className="w-full h-full"
                        />
                      </div>
                    </div>

                    {/* US Subcategory Bar Chart */}
                    <div className="flex flex-col" style={{ flex: 1 }}>
                      <h5
                        className="text-sm font-semibold mb-2 text-center"
                        style={{ color: "var(--pink-500)" }}
                      >
                        US Subcategories
                      </h5>
                      <div style={{ width: "100%", height: "400px" }}>
                        <Chart
                          type="bar"
                          data={usSubcategoryChartData}
                          options={subcategoryChartOptions}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
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