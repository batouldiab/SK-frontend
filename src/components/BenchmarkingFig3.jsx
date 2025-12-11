// src/components/BenchmarkingFig3.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
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

const BenchmarkingFig3 = ({ selectedCountries = ["United States", "United Arab Emirates"] }) => {
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
  const [datasetVisibility, setDatasetVisibility] = useState({});
  const [availableCountries, setAvailableCountries] = useState([]);

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

              const allSkills = [];

              // Parse all rows
              results.data.forEach((row) => {
                const softSkill = (row["Soft Skill"] || row[Object.keys(row)[0]] || "").trim();
                if (!softSkill) return;

                const values = {};
                standardizedColumns.forEach((col) => {
                  const val = parseFloat(row[col.fieldName]);
                  if (!Number.isNaN(val)) {
                    values[col.country] = val;
                  }
                });

                allSkills.push({
                  softSkill,
                  values,
                });
              });

              if (allSkills.length === 0) {
                throw new Error("No valid data found in CSV");
              }

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

  const visibleCountries = useMemo(
    () => selectedCountryConfigs.filter((cfg) => datasetVisibility[cfg.csvKey]),
    [selectedCountryConfigs, datasetVisibility]
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

  // Build unified top skills across selected countries
  useEffect(() => {
    if (!allSkillsData.length || !visibleCountries.length) {
      setUnifiedTopSkills([]);
      return;
    }

    const selectedKeys = visibleCountries.map((c) => c.csvKey);
    const unifiedNames = new Set();
    const unified = [];

    selectedKeys.forEach((key) => {
      const topForCountry = [...allSkillsData]
        .sort((a, b) => (b.values[key] || 0) - (a.values[key] || 0))
        .slice(0, 10);

      topForCountry.forEach((skill) => {
        if (!unifiedNames.has(skill.softSkill)) {
          unifiedNames.add(skill.softSkill);
          unified.push(skill);
        }
      });
    });

    const primaryKey = selectedKeys[0];
    unified.sort((a, b) => (b.values[primaryKey] || 0) - (a.values[primaryKey] || 0));

    setUnifiedTopSkills(unified);
    setSelectedSkill((prev) => {
      if (prev && unified.some((s) => s.softSkill === prev.softSkill)) return prev;
      return unified[0] || allSkillsData[0] || null;
    });
  }, [allSkillsData, visibleCountries]);

  // Update radar chart when unified data changes
  useEffect(() => {
    if (unifiedTopSkills.length === 0 || !visibleCountries.length) {
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

    const datasets = visibleCountries.map((cfg, index) => {
      const color = getColor(index);
      return {
        label: `${cfg.displayName} Standardized Count`,
        borderColor: color,
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointHoverBackgroundColor: textColor,
        pointHoverBorderColor: color,
        backgroundColor: color + "33",
        data: unifiedTopSkills.map((s) => s.values[cfg.csvKey] || 0),
        fill: true,
      };
    });

    if (!datasets.length) {
      setRadarChartData(null);
      return;
    }

    const radarData = {
      labels: unifiedTopSkills.map((s) => s.softSkill),
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
  }, [unifiedTopSkills, visibleCountries]);

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
          Top Soft Skills
        </h3>
        <p className="text-blue-700">Error loading chart data: {error}</p>
      </div>
    );
  }

  const documentStyle = getComputedStyle(document.documentElement);
  const palette = baseColors.map((cssVar) => documentStyle.getPropertyValue(cssVar) || "");
  const getColor = (index) => {
    const resolved = palette[index % palette.length];
    return resolved && resolved.trim() ? resolved.trim() : fallbackPalette[index % fallbackPalette.length];
  };

  const totalDistinctSkills = allSkillsData.length;
  const unifiedCount = unifiedTopSkills.length;
  const averages = visibleCountries.map((cfg) => {
    const total = unifiedTopSkills.reduce((sum, s) => sum + (s.values[cfg.csvKey] || 0), 0);
    return { ...cfg, average: unifiedCount ? total / unifiedCount : 0 };
  });

  const nonZeroCounts = visibleCountries.map((cfg) => ({
    ...cfg,
    count: allSkillsData.filter((s) => (s.values[cfg.csvKey] || 0) !== 0).length,
  }));

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-full min-h-[420px] flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            Total Distinct Skills (Dataset)
          </p>
          <p className="text-2xl font-bold text-slate-800">{totalDistinctSkills}</p>
          <div className="mt-3 text-xs text-slate-600 space-y-1">
            {nonZeroCounts.map((c, index) => (
              <div key={c.csvKey} style={{ color: getColor(index) }}>
                {c.displayName}: {c.count}
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
            Unified Top Distinct Skills
          </p>
          <p className="text-2xl font-bold text-blue-700">{unifiedCount}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl">
          <p className="text-xs font-medium text-slate-300 uppercase tracking-wide mb-1">
            Average Standardized Count (Unified set)
          </p>
          <div className="flex gap-4 text-white flex-wrap">
            {averages.map((avg) => (
              <div key={avg.csvKey}>
                <p className="text-[10px] uppercase text-slate-200 mb-1">{avg.displayName}</p>
                <p className="text-xl font-semibold">{avg.average.toFixed(4)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart toggles */}
      <div className="flex gap-4 mt-1 mb-3 items-center flex-wrap">
        <span className="text-sm font-semibold text-gray-600">
          Show datasets:
        </span>
        {selectedCountryConfigs.map((country, index) => {
          const id = `toggle-${country.csvKey}`.replace(/\s+/g, "-").toLowerCase();
          const color = getColor(index);
          return (
            <div className="flex items-center gap-2" key={country.csvKey}>
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

      {/* Radar Chart - comparison */}
      <div className="w-full mt-3 flex justify-center items-center">
        <div className="flex flex-col items-center w-full" style={{ maxWidth: "720px" }}>
          <h3 className="text-md font-semibold mb-2 text-gray-800">
            Top Distinct Soft Skills Comparison: <span className="font-light">Skills count per 100 OJAs</span>
          </h3>
          <div style={{ width: "100%", height: "500px" }}>
            {radarChartData && radarChartData.datasets?.length ? (
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
          Compare standardized demand for a selected soft skill (per 1000 soft skill in the country market)
        </h3>
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <Dropdown
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.value)}
            options={allSkillsData}
            optionLabel="softSkill"
            placeholder="Select a soft skill"
            className="w-full md:w-80"
            showClear
            {...dropdownPerfProps}
          />

          {selectedSkill && (
            <div className="flex gap-6 text-sm flex-wrap">
              {visibleCountries.map((country, index) => (
                <div key={country.csvKey}>
                  <span className="block text-gray-500 text-xs uppercase">{country.displayName}</span>
                  <span className="block font-semibold" style={{ color: getColor(index) }}>
                    {(selectedSkill.values[country.csvKey] || 0).toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BenchmarkingFig3;
