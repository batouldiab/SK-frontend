// src/components/GreenFig1.jsx
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

const GreenFig1 = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCsv = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/data/green_fig1.csv");
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

        const years = [];
        const percentages = [];

        rows.forEach((line) => {
          if (!line.trim()) return;
          const cols = line.split(delimiter);
          if (cols.length < 4) return;

          const year = cols[0].trim();
          const percentage = parseFloat(cols[3].toString().replace(",", "."));

          if (!year || isNaN(percentage)) return;
          // We only care about 2021–2024
            if (parseInt(year, 10) < 2021 || parseInt(year, 10) > 2024) return;

          years.push(year);
          percentages.push(percentage);
        });

        if (years.length === 0) {
          throw new Error("No valid rows parsed from CSV");
        }

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary =
          documentStyle.getPropertyValue("--text-color-secondary");
        const surfaceBorder =
          documentStyle.getPropertyValue("--surface-border");
        const lineColor =
          documentStyle.getPropertyValue("--blue-500") || "#3b82f6";

        const data = {
          labels: years,
          datasets: [
            {
              label: "Percentage of Green Jobs",
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
                text: "Percentage of Green Jobs",
                color: textColorSecondary,
              },
            },
          },
        };

        setChartData(data);
        setChartOptions(options);
      } catch (err) {
        console.error("Error loading green_fig1.csv:", err);
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
          Green Jobs Share Over Time (Arab Region)
        </h2>
        <p className="m-0 text-sm text-red-500">
          Error loading chart data: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="card surface-card shadow-2 border-round-xl p-4 w-full flex flex-col lg:flex-row align-items-center justify-content-center">
      <div className="justify-content-between align-items-center mb-3 gap-3 w-full lg:w-[30%] p-4">
        <div>
          <h2 className="mt-1 mb-1 text-xl text-center">
            Green Jobs Share Over Time (Arab Region)
          </h2>
          <p className="m-0 text-sm text-color-secondary text-center">
            Percentage of green job postings among all scraped postings, by
            year.
          </p>
        </div>
      </div>

      {/* Chart area */}
      <div className="w-full lg:w-[70%] min-h-100 max-h-[100%]">
        <Chart
          className="chart-green-1"
          type="line"
          data={chartData}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default GreenFig1;
