// src/components/BenchmarkingFig6.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AgCharts } from "ag-charts-react";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import Papa from "papaparse";

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
const EXCLUDED_TITLE_PATTERN = /r\u00e9p\u00e9titeur/i;

const fallbackPalette = ["#3b82f6", "#ec4899", "#22c55e", "#f97316", "#a855f7"];
const baseColors = ["--blue-500", "--pink-500", "--green-500", "--orange-500", "--purple-500", "--cyan-500"];

const dropdownPerfProps = {
  filter: true,
  filterDelay: 120,
  resetFilterOnHide: true,
  virtualScrollerOptions: { itemSize: 38, showLoader: true },
  scrollHeight: "260px",
};

const BenchmarkingFig6 = ({ selectedCountries = ["United States", "United Arab Emirates"] }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Raw data per country
  const [countryData, setCountryData] = useState({});
  const [availableCountries, setAvailableCountries] = useState([]);

  // Common skills across selected countries
  const [commonSkills, setCommonSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Chart data
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState(null);

  const [datasetVisibility, setDatasetVisibility] = useState({});

  // Statistics
  const [stats, setStats] = useState({
    totalTitles: 0,
    averages: [],
  });

  // Determine which country datasets are available from selectedCountries
  const selectedCountryConfigs = useMemo(
    () =>
      selectedCountries
        .map((name) => ({
          displayName: toDisplayName(name),
          csvKey: toCsvKey(name),
        }))
        .filter((cfg) => cfg.csvKey),
    [selectedCountries]
  );

  const visibleConfigs = useMemo(
    () => selectedCountryConfigs.filter((cfg) => datasetVisibility[cfg.csvKey]),
    [selectedCountryConfigs, datasetVisibility]
  );

  const countryColorMap = useMemo(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const palette = baseColors.map((cssVar) => {
      const value = documentStyle.getPropertyValue(cssVar);
      return value && value.trim() ? value.trim() : "";
    });
    const map = {};

    selectedCountryConfigs.forEach((cfg, index) => {
      const paletteColor = palette[index % palette.length];
      map[cfg.csvKey] = paletteColor || fallbackPalette[index % fallbackPalette.length];
    });

    return map;
  }, [selectedCountryConfigs]);

  const getColor = useCallback(
    (country) =>
      countryColorMap[country.csvKey] ||
      fallbackPalette[
        (selectedCountryConfigs.findIndex((cfg) => cfg.csvKey === country.csvKey) +
          fallbackPalette.length) %
          fallbackPalette.length
      ],
    [countryColorMap, selectedCountryConfigs]
  );

  // Build file url per country
  const buildUrl = (csvKey) => {
    if (csvKey === "US") return "/data/benchmarking_fig7.csv";
    return `/data/benchmarking_fig6_${csvKey}.csv`;
  };

  // Load all relevant CSV files whenever country selection changes
  useEffect(() => {
    const loadAll = async () => {
      if (!selectedCountryConfigs.length) {
        setCountryData({});
        setAvailableCountries([]);
        setCommonSkills([]);
        setSelectedSkill(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const fetches = selectedCountryConfigs.map(async (cfg) => {
          const response = await fetch(buildUrl(cfg.csvKey));
          if (!response.ok) {
            throw new Error(`HTTP error loading ${cfg.displayName} data (status ${response.status})`);
          }
          const text = await response.text();
          return { cfg, text };
        });

        const responses = await Promise.all(fetches);

        const parsedEntries = await Promise.all(
          responses.map(
            (item) =>
              new Promise((resolve, reject) => {
                Papa.parse(item.text, {
                  header: true,
                  skipEmptyLines: true,
                  complete: (results) => resolve({ cfg: item.cfg, rows: results.data }),
                  error: (err) => reject(err),
                });
              })
          )
        );

        const dataMap = {};
        parsedEntries.forEach(({ cfg, rows }) => {
          const processed = rows
            .map((row) => ({
              skill: row["skill"]?.trim() || "",
              title: row["title"]?.trim() || "",
              count: parseFloat(row["count"]) || 0,
              standardizedCount: parseFloat(row["standardized count"]) || 0,
            }))
            .filter(
              (row) =>
                row.skill &&
                row.title &&
                !Number.isNaN(row.standardizedCount) &&
                !EXCLUDED_TITLE_PATTERN.test(row.title)
            );

          dataMap[cfg.csvKey] = processed;
        });

        setCountryData(dataMap);
        setAvailableCountries(parsedEntries.map((p) => p.cfg.csvKey));
      } catch (err) {
        console.error("Error loading CSV files:", err);
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [selectedCountryConfigs]);

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

  // Compute common skills across loaded countries
  useEffect(() => {
    if (!selectedCountryConfigs.length) {
      setCommonSkills([]);
      setSelectedSkill(null);
      return;
    }

    const datasets = selectedCountryConfigs
      .map((cfg) => countryData[cfg.csvKey] || [])
      .filter((d) => d.length > 0);

    if (!datasets.length || datasets.length !== selectedCountryConfigs.length) {
      setCommonSkills([]);
      setSelectedSkill(null);
      return;
    }

    const skillSets = datasets.map((data) => new Set(data.map((row) => row.skill)));
    const intersection = [...skillSets[0]].filter((skill) => skillSets.every((set) => set.has(skill)));

    const skillOptions = intersection.sort().map((skill) => ({ label: skill, value: skill }));
    setCommonSkills(skillOptions);
    setSelectedSkill((prev) => {
      if (prev && skillOptions.some((s) => s.value === prev)) return prev;
      return skillOptions[0]?.value || null;
    });
  }, [countryData, selectedCountryConfigs]);

  // Update chart when selected skill or visibility changes
  useEffect(() => {
    if (!selectedSkill || !selectedCountryConfigs.length) {
      setChartOptions(null);
      setChartData([]);
      setStats({ totalTitles: 0, averages: [] });
      return;
    }

    if (!visibleConfigs.length) {
      setChartOptions(null);
      setChartData([]);
      setStats({ totalTitles: 0, averages: [] });
      return;
    }

    try {
      const documentStyle = getComputedStyle(document.documentElement);
      const getCssVar = (name, fallback) => {
        const value = documentStyle.getPropertyValue(name);
        return value && value.trim() ? value.trim() : fallback;
      };
      const textColor = getCssVar("--text-color", "#1f2937");
      const textColorSecondary = getCssVar("--text-color-secondary", "#6b7280");
      const gridColor = getCssVar("--surface-border", "#e5e7eb");

      // Build title universe across visible countries (top 10 each by percentage)
      const titleSet = new Set();
      const countryTitleMap = {};

      visibleConfigs.forEach((cfg, index) => {
        const rows = (countryData[cfg.csvKey] || []).filter((row) => row.skill === selectedSkill);
        const total = rows.reduce((sum, row) => sum + row.count, 0);
        const rowsWithPct = rows.map((row) => ({
          ...row,
          percentage: total > 0 ? row.count / total : 0,
        }));
        const topRows = rowsWithPct.sort((a, b) => b.percentage - a.percentage).slice(0, 10);
        countryTitleMap[cfg.csvKey] = topRows;
        topRows.forEach((row) => titleSet.add(row.title));
      });

      const titles = [...titleSet];

      // Sort titles by total percentage across visible countries
      const titlesWithTotals = titles.map((title) => {
        const values = visibleConfigs.map((cfg) => {
          const match = (countryTitleMap[cfg.csvKey] || []).find((row) => row.title === title);
          return match ? match.percentage : 0;
        });
        return {
          title,
          total: values.reduce((a, b) => a + b, 0),
          values,
        };
      });

      // Sort by the order of countries in selectedCountries (first country wins ties)
      titlesWithTotals.sort((a, b) => {
        for (let i = 0; i < visibleConfigs.length; i++) {
          const diff = b.values[i] - a.values[i];
          if (Math.abs(diff) > 1e-12) return diff;
        }
        return a.title.localeCompare(b.title);
      });

      const dataForChart = titlesWithTotals.map((item) => {
        const entry = { title: item.title };
        visibleConfigs.forEach((cfg, idx) => {
          entry[cfg.csvKey] = item.values[idx] * 100;
        });
        return entry;
      });

      const series = visibleConfigs.map((cfg) => {
        const color = getColor(cfg);
        const isUS = cfg.csvKey === "US";
        return isUS
          ? {
              type: "scatter",
              xKey: "title",
              yKey: cfg.csvKey,
              title: cfg.displayName,
              marker: {
                fill: color,
                stroke: "#ffffff",
                strokeWidth: 2,
                size: 12,
                shape: "circle",
              },
              tooltip: {
                renderer: ({ datum }) => ({
                  content: `${cfg.displayName}: ${(datum[cfg.csvKey] || 0).toFixed(2)}%`,
                }),
              },
            }
          : {
              type: "bar",
              xKey: "title",
              yKey: cfg.csvKey,
              yName: cfg.displayName,
              fill: color,
              stroke: color,
              cornerRadius: 5,
              tooltip: {
                renderer: ({ datum }) => ({
                  content: `${cfg.displayName}: ${(datum[cfg.csvKey] || 0).toFixed(2)}%`,
                }),
              },
            };
      });

      const maxValue = Math.max(
        ...dataForChart.flatMap((d) => visibleConfigs.map((cfg) => d[cfg.csvKey] || 0)),
        0
      );
      const paddedMax = maxValue > 0 ? Math.ceil(maxValue * 1.15) : 1;

      const options = {
        data: dataForChart,
        background: { fill: "#ffffff" },
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
              formatter: ({ value }) => (value.length > 28 ? `${value.slice(0, 25)}...` : value),
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
            marker: { shape: "circle", size: 10 },
            label: { fontSize: 13, color: textColor },
            paddingX: 24,
          },
        },
      };

      // Stats
      const averages = visibleConfigs.map((cfg, idx) => {
        const values = titlesWithTotals.map((t) => t.values[idx]);
        const positive = values.filter((v) => v > 0);
        const avg = positive.length ? positive.reduce((a, b) => a + b, 0) / positive.length : 0;
        return { cfg, avg };
      });

      setStats({
        totalTitles: titles.length,
        averages,
      });
      setChartData(dataForChart);
      setChartOptions(options);
    } catch (err) {
      console.error("Error processing chart data:", err);
      setError(err.message || "Error processing chart data");
    }
  }, [selectedSkill, countryData, selectedCountryConfigs, datasetVisibility, getColor, visibleConfigs]);

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

  const hasChartData = !!(chartOptions && chartData.length && commonSkills.length && visibleConfigs.length);

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
        <div
          className="grid gap-4 mb-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}
        >
          <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
              Total Titles
            </p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalTitles}</p>
          </div>
        </div>

        {/* Chart toggles */}
        <div className="flex gap-4 mt-4 align-items-center flex-wrap">
          <span className="text-sm font-semibold text-color-secondary">
            Show datasets:
          </span>
          {selectedCountryConfigs.map((country) => {
            const id = `toggle-${country.csvKey}`.replace(/\s+/g, "-").toLowerCase();
            const color = getColor(country);

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
      <div className="flex-1 min-h-[420px]">
        {hasChartData ? (
          <AgCharts className="w-full h-full" options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-color-secondary">
            {commonSkills.length === 0
              ? "No common skills found between the selected datasets."
              : "Select at least one dataset to display the chart."}
          </div>
        )}
      </div>
    </div>
  );
};

export default BenchmarkingFig6;
