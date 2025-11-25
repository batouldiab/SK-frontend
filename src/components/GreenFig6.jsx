// src/components/GreenFig6.jsx
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

const GreenFig6 = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCsv = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/data/green_fig6.csv");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();

        const lines = text.trim().split(/\r?\n/);
        if (lines.length < 2) {
          throw new Error("CSV file appears to be empty");
        }

        const headerLine = lines[0];
        // Detect delimiter: tab, semicolon or comma
        const delimiter = headerLine.includes("\t")
          ? "\t"
          : headerLine.includes(";")
          ? ";"
          : ",";

        const rows = lines.slice(1);

        const rawData = [];

        rows.forEach((line) => {
          if (!line.trim()) return;

          const cols = line.split(delimiter);
          // Expect: [year, energy_not_green, energy_and_green, total_energy, Green Jobs in the Energy Sector]
          if (cols.length < 5) return;

          const yearStr = cols[0].trim();
          const year = parseInt(yearStr, 10);
          if (isNaN(year)) return;

          // We only care about 2021–2024
          if (year < 2021 || year > 2024) return;

          const percentageStr = cols[4].toString().trim().replace(",", ".");
          const percentage = parseFloat(percentageStr);
          if (isNaN(percentage)) return;

          rawData.push({ year, percentage });
        });

        if (rawData.length === 0) {
          throw new Error("No valid rows for years 2021–2024 parsed from CSV");
        }

        // Ensure years are sorted: 2021, 2022, 2023, 2024
        const sorted = rawData.sort((a, b) => a.year - b.year);
        const years = sorted.map((d) => d.year.toString());
        const percentages = sorted.map((d) => d.percentage);

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary =
          documentStyle.getPropertyValue("--text-color-secondary");
        const surfaceBorder =
          documentStyle.getPropertyValue("--surface-border");
        const lineColor =
          documentStyle.getPropertyValue("--green-500") ||
          documentStyle.getPropertyValue("--blue-500") ||
          "#22c55e";

        const data = {
          labels: years,
          datasets: [
            {
              label: "Green Jobs in the Energy Sector (%)",
              data: percentages,
              fill: false,
              borderColor: lineColor,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 5,
            },
          ],
        };

        const options = {
          maintainAspectRatio: false,
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
                label: (context) => `${context.parsed.y.toFixed(2)}%`,
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: textColorSecondary,
              },
              grid: {
                color: surfaceBorder,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                color: textColorSecondary,
                callback: (value) => value + "%",
              },
              grid: {
                color: surfaceBorder,
              },
              title: {
                display: true,
                text: "Share of Green Jobs in the Energy Sector (%)",
                color: textColorSecondary,
              },
            },
          },
        };

        setChartData(data);
        setChartOptions(options);
      } catch (err) {
        console.error("Error loading green_fig6.csv:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadCsv();
  }, []);

  if (loading) {
    return (
      <div className="card surface-card shadow-2 border-round-xl p-4 w-full min-h-[420px] flex flex-column">
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
        <h2 className="m-0 mb-2 text-xl">
          Green Jobs in the Energy Sector (2021–2024)
        </h2>
        <p className="m-0 text-sm text-red-500">
          Error loading chart data: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="card surface-card shadow-2 border-round-xl p-4 w-full min-h-[420px] flex flex-col">
      <div className="justify-content-center align-items-center mb-3 gap-3 w-full text-center">
        <div>
          <h2 className="mt-1 mb-1 text-xl">
            Green Jobs in the Energy Sector (2021–2024)
          </h2>
          <p className="m-0 text-sm text-color-secondary">
            Share of green jobs among all energy-related job postings in recent
            years.
          </p>
        </div>
      </div>

      {/* Chart area */}
      <div className="w-full h-full min-h-[360px]">
        <Chart
          className="chart-green-6 w-full h-full"
          type="line"
          data={chartData}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default GreenFig6;
