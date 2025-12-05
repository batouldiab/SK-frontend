// src/components/BenchmarkingFig5_2.jsx
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Papa from "papaparse";

const dropdownPerfProps = {
  filter: true,
  filterDelay: 120,
  resetFilterOnHide: true,
  virtualScrollerOptions: { itemSize: 38, showLoader: true },
  scrollHeight: "260px",
};

const BenchmarkingFig5_2 = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chart data
  const [radarChartData, setRadarChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

  // Processed data
  const [categoryData, setCategoryData] = useState([]);
  const [allSkillsData, setAllSkillsData] = useState([]);
  
  // UI state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categorySkills, setCategorySkills] = useState([]);
  const [showUAEChart, setShowUAEChart] = useState(true);
  const [showUSChart, setShowUSChart] = useState(true);

  // Unified subcategory bar chart data
  const [subcategoryChartData, setSubcategoryChartData] = useState(null);
  const [subcategoryChartOptions, setSubcategoryChartOptions] = useState({});

  // Load and process CSV data
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
                const hardSkill = row["Hard Skill"]?.trim();
                const category = row["Category"]?.trim();
                const subcategory = row["Subcategory"]?.trim();
                const uaeCount = parseFloat(row["Standardized Count UAE"]) || 0;
                const usCount = parseFloat(row["Standardized Count US"]) || 0;

                if (!hardSkill || !category) return;

                // Store skill data
                skillsData.push({
                  hardSkill,
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

              // Calculate totals (excluding 'Uncategorized' for percentage calculation)
              const filteredSkillsData = skillsData.filter(s => s.category !== "Uncategorized");
              const uaeTotalCount = filteredSkillsData.reduce((sum, s) => sum + s.uaeCount, 0);
              const usTotalCount = filteredSkillsData.reduce((sum, s) => sum + s.usCount, 0);

              // Convert category map to array with percentages, filtering out 'Uncategorized'
              const categoriesArray = Array.from(categoryMap.values())
                .filter((cat) => cat.category !== "Uncategorized")
                .map((cat) => ({
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

    const datasets = [];

    if (showUAEChart) {
      datasets.push({
        label: "UAE Percentage",
        borderColor: documentStyle.getPropertyValue("--blue-500") || "#3b82f6",
        pointBackgroundColor: documentStyle.getPropertyValue("--blue-500") || "#3b82f6",
        pointBorderColor: documentStyle.getPropertyValue("--blue-500") || "#3b82f6",
        pointHoverBackgroundColor: textColor,
        pointHoverBorderColor: documentStyle.getPropertyValue("--blue-500") || "#3b82f6",
        backgroundColor: (documentStyle.getPropertyValue("--blue-500") || "#3b82f6") + "33",
        data: categoryData.map((c) => c.uaePercentage),
        fill: true,
      });
    }

    if (showUSChart) {
      datasets.push({
        label: "US Percentage",
        borderColor: documentStyle.getPropertyValue("--pink-500") || "#ec4899",
        pointBackgroundColor: documentStyle.getPropertyValue("--pink-500") || "#ec4899",
        pointBorderColor: documentStyle.getPropertyValue("--pink-500") || "#ec4899",
        pointHoverBackgroundColor: textColor,
        pointHoverBorderColor: documentStyle.getPropertyValue("--pink-500") || "#ec4899",
        backgroundColor: (documentStyle.getPropertyValue("--pink-500") || "#ec4899") + "33",
        data: categoryData.map((c) => c.usPercentage),
        fill: true,
      });
    }

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
  }, [categoryData, showUAEChart, showUSChart]);

  // Update category skills when selected category changes
  useEffect(() => {
    if (!selectedCategory || allSkillsData.length === 0) {
      setCategorySkills([]);
      setSubcategoryChartData(null);
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

    // Get top 10 for UAE
    const sortedByUAE = [...subcategoriesWithPercentages].sort((a, b) => b.uaePercentage - a.uaePercentage);
    const uaeTop10 = sortedByUAE.slice(0, 10);

    // Get top 10 for US
    const sortedByUS = [...subcategoriesWithPercentages].sort((a, b) => b.usPercentage - a.usPercentage);
    const usTop10 = sortedByUS.slice(0, 10);

    // Create unified top subcategories list (10-20 subcategories)
    const unifiedSubcategoryNames = new Set(uaeTop10.map(s => s.subcategory));
    const unifiedSubcategories = [...uaeTop10];

    usTop10.forEach(sub => {
      if (!unifiedSubcategoryNames.has(sub.subcategory)) {
        unifiedSubcategoryNames.add(sub.subcategory);
        unifiedSubcategories.push(sub);
      }
    });

    // Sort unified list by UAE percentage for consistent display
    unifiedSubcategories.sort((a, b) => b.uaePercentage - a.uaePercentage);

    // Prepare chart data
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    // Find the maximum percentage across both UAE and US for dynamic y-axis
    const maxUaePercentage = Math.max(...unifiedSubcategories.map(s => s.uaePercentage), 0);
    const maxUsPercentage = Math.max(...unifiedSubcategories.map(s => s.usPercentage), 0);
    const maxPercentage = Math.max(maxUaePercentage, maxUsPercentage);
    // Add 10% padding to the max for better visualization
    const yAxisMax = Math.ceil(maxPercentage * 1.1);

    const blueColor = documentStyle.getPropertyValue('--blue-500') || '#3b82f6';
    const pinkColor = documentStyle.getPropertyValue('--pink-500') || '#ec4899';

    // Unified Subcategory Radar Chart with two datasets
    const unifiedSubData = {
      labels: unifiedSubcategories.map((s) => s.subcategory),
      datasets: [
        {
          label: 'UAE Subcategory %',
          backgroundColor: blueColor + '33',
          borderColor: blueColor,
          pointBackgroundColor: blueColor,
          pointBorderColor: blueColor,
          borderWidth: 2,
          data: unifiedSubcategories.map((s) => s.uaePercentage),
          fill: true,
        },
        {
          label: 'US Subcategory %',
          backgroundColor: pinkColor + '33',
          borderColor: pinkColor,
          pointBackgroundColor: pinkColor,
          pointBorderColor: pinkColor,
          borderWidth: 2,
          data: unifiedSubcategories.map((s) => s.usPercentage),
          fill: true,
        },
      ],
    };

    const subChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.9,
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
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
          suggestedMax: yAxisMax,
          ticks: {
            color: textColorSecondary,
            callback: function(value) {
              return value + '%';
            },
            backdropColor: 'transparent',
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

  }, [selectedCategory, allSkillsData]);

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

  if (!radarChartData) return null;

  const totalUAECount = categoryData.reduce((sum, c) => sum + c.uaeTotal, 0);
  const totalUSCount = categoryData.reduce((sum, c) => sum + c.usTotal, 0);

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
              Show datasets:
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

      {/* Radar chart for all categories */}
      <div className="w-full mt-3 flex flex-col justify-content-center align-items-center">
        <h3 className="text-md font-semibold mb-2 text-center">
          UAE vs US: Hard Skill Categories (All)
        </h3>
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
                  field="hardSkill"
                  header="Hard Skill"
                  sortable
                  body={(rowData) => rowData.hardSkill.toLocaleString()}
                  style={{ minWidth: "200px" }}
                />
                <Column
                  field="subcategory"
                  header="Subcategory"
                  sortable
                  body={(rowData) => rowData.subcategory.toLocaleString()}
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

              {/* Unified Subcategory Bar Chart */}
              {subcategoryChartData && (
                <div className="mt-4 pt-3 border-top-1 surface-border">
                  <h4 className="text-sm font-semibold mb-3">
                    Unified Top Subcategory Distribution: UAE vs US (%)
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

export default BenchmarkingFig5_2;
