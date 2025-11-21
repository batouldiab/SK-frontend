// src/components/GreenFig3.jsx
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

const GreenFig3 = () => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalAvgGreen, setGlobalAvgGreen] = useState(0);

  useEffect(() => {
    const loadCsv = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/data/green_fig3.csv");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        const lines = text.trim().split(/\r?\n/);
        if (lines.length < 2) {
          throw new Error("CSV file appears to be empty");
        }

        const headerLine = lines[0];
        const delimiter = headerLine.includes("\t")
          ? "\t"
          : headerLine.includes(";")
          ? ";"
          : ",";

        const rows = lines.slice(1);

        // --- Parse full CSV into objects ---
        const jobRows = [];

        rows.forEach((line) => {
          if (!line.trim()) return;
          const cols = line.split(delimiter);
          if (cols.length < 3) return;

          const title = cols[0].trim();
          const greenShare = parseFloat(
            cols[1].toString().replace(",", ".").replace(" ", "")
          );
          const nonGreenShare = parseFloat(
            cols[2].toString().replace(",", ".").replace(" ", "")
          );

          if (!title || isNaN(greenShare) || isNaN(nonGreenShare)) {
            return;
          }

          jobRows.push({
            title,
            greenShare,
            nonGreenShare,
          });
        });

        if (jobRows.length === 0) {
          throw new Error("No valid rows parsed from CSV");
        }

        // --- Global average across ALL occupations ---
        const globalAvgGreenShare =
          jobRows.reduce((sum, r) => sum + r.greenShare, 0) / jobRows.length;
        setGlobalAvgGreen(globalAvgGreenShare);

        // --- Keep only TOP 20 by greenShare (descending) for display ---
        jobRows.sort((a, b) => b.greenShare - a.greenShare);
        const topJobs = jobRows.slice(0, 20);

        const jobTitles = topJobs.map((r) => r.title);
        const greenShares = topJobs.map((r) => r.greenShare);
        const nonGreenShares = topJobs.map((r) => r.nonGreenShare);

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary =
          documentStyle.getPropertyValue("--text-color-secondary");
        const surfaceBorder =
          documentStyle.getPropertyValue("--surface-border") || "#e0e0e0";

        const primaryGreen =
          documentStyle.getPropertyValue("--green-500") || "#22c55e";
        const neutralBar =
          documentStyle.getPropertyValue("--surface-400") || "#94a3b8";
        const lineColor =
          documentStyle.getPropertyValue("--red-500") || "#ff0000ff";

        const data = {
          labels: jobTitles,
          datasets: [
            // 🔹 Put line dataset FIRST, and base chart type is 'line'
            {
              type: "line",
              label: "Average green share (all occupations)",
              borderColor: lineColor,
              borderWidth: 2,
              pointRadius: 0,
              fill: false,
              tension: 0,
              borderDash: [6, 6],
              // For horizontal bars, these are x-values; same value per label
              data: Array(jobTitles.length).fill(globalAvgGreenShare),
            },
            {
              type: "bar",
              label: "Green share (%)",
              backgroundColor: primaryGreen,
              data: greenShares,
              borderColor: "white",
              borderWidth: 1,
              borderRadius: 8,
              maxBarThickness: 32,
              stack: "job-share",
            },
            {
              type: "bar",
              label: "Non-green share (%)",
              backgroundColor: neutralBar,
              data: nonGreenShares,
              borderColor: "white",
              borderWidth: 1,
              borderRadius: 8,
              maxBarThickness: 32,
              stack: "job-share",
            },
          ],
        };

        const options = {
          indexAxis: "y", // 🔹 Horizontal bars
          maintainAspectRatio: false,
          responsive: true,
          layout: {
            padding: { top: 10, right: 20, left: 0, bottom: 0 },
          },
          plugins: {
            legend: {
              position: "bottom",
              align: "start",
              labels: {
                usePointStyle: true,
                boxWidth: 8,
                boxHeight: 8,
                color: textColor,
                padding: 16,
              },
            },
            tooltip: {
              usePointStyle: true,
              callbacks: {
                label: function (context) {
                  const idx = context.dataIndex;
                  const title = context.label;

                  if (context.dataset.type === "bar") {
                    const green = greenShares[idx];
                    const nonGreen = nonGreenShares[idx];
                    const total = green + nonGreen;

                    return [
                      `${title}`,
                      `Green share: ${green.toFixed(2)}%`,
                      `Non-green share: ${nonGreen.toFixed(2)}%`,
                      `Total: ${total.toFixed(2)}%`,
                    ];
                  }

                  if (context.dataset.type === "line") {
                    return (
                      context.dataset.label +
                      ": " +
                      context.parsed.x.toFixed(2) +
                      "%"
                    );
                  }

                  return "";
                },
              },
            },
          },
          scales: {
            x: {
              stacked: true,
              beginAtZero: true,
              max: 100,
              ticks: {
                color: textColorSecondary,
                callback: (value) => value + "%",
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false,
              },
              title: {
                display: true,
                text: "Share of job postings (%)",
                color: textColorSecondary,
              },
            },
            y: {
              stacked: true,
              ticks: {
                color: textColorSecondary,
                autoSkip: false,
                maxRotation: 0,
              },
              grid: {
                display: false,
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
        console.error("Error loading CSV:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadCsv();
  }, []);

  if (loading) {
    return (
      <div className="card surface-card shadow-2 border-round-xl p-4 w-full h-96 flex flex-column">
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
      <div className="card surface-card shadow-2 border-round-xl p-4 w-full h-96">
        <h2 className="m-0 mb-2 text-xl">
          Green vs Non-Green Share by ESCO Job Title (Top 20)
        </h2>
        <p className="m-0 text-sm text-red-500">
          Error loading chart data: {error}
        </p>
      </div>
    );
  }

  if (!chartData) return null;

  const labels = chartData.labels || [];
  const greenData =
    chartData.datasets?.[1]?.data && Array.isArray(chartData.datasets[1].data)
      ? chartData.datasets[1].data
      : [];
  const maxGreen =
    greenData.length > 0 ? Math.max(...greenData) : 0;

  return (
    <div className="card surface-card shadow-2 border-round-xl p-4 w-full h-full flex flex-column">
      <div className="flex justify-content-between align-items-start mb-3 gap-3 w-[30%]">
        <div className="w-full p-2">
          <h2 className="mt-1 mb-1 text-xl">
            Green vs Non-Green Share by ESCO Job Title (Top 20)
          </h2>
          <p className="m-0 text-sm text-color-secondary">
            Top 20 ESCO job titles ranked by green share. Bars show the split
            between green and non-green postings. The dashed line marks the
            average green share across <strong>all</strong> occupations in the
            dataset.
          </p>

          <div className="flex gap-2 flex-wrap justify-content-start align-items-center mt-3">
            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Job titles shown
              </span>
              <span className="block text-sm font-semibold">
                {labels.length}
              </span>
            </div>
            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Avg. green share (all)
              </span>
              <span className="block text-sm font-semibold">
                {globalAvgGreen.toFixed(1)}%
              </span>
            </div>
            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Max green share (top 20)
              </span>
              <span className="block text-sm font-semibold">
                {maxGreen.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="w-[70%] min-h-100 max-h-[100%]">
        {/* 🔹 Base type 'line' so the line layer is on top, like in your example */}
        <Chart
          className="chart-green-3"
          type="line"
          data={chartData}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default GreenFig3;
