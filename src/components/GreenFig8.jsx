// src/components/GreenFig8.jsx
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

const GreenFig8 = () => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCsv = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/data/green_fig8.csv");
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

        const dataRows = [];

        rows.forEach((line) => {
          if (!line.trim()) return;
          const cols = line.split(delimiter);
          if (cols.length < 5) return;

          const date = cols[0].trim();
          const shareGreenNonOG = parseFloat(
            cols[1].toString().replace(",", ".").replace(" ", "")
          );
          const shareOGTotal = parseFloat(
            cols[2].toString().replace(",", ".").replace(" ", "")
          );
          const shareGreenOG = parseFloat(
            cols[3].toString().replace(",", ".").replace(" ", "")
          );
          const shareGreenJobsThatAreOG = parseFloat(
            cols[4].toString().replace(",", ".").replace(" ", "")
          );

          if (
            !date ||
            isNaN(shareGreenNonOG) ||
            isNaN(shareOGTotal) ||
            isNaN(shareGreenOG) ||
            isNaN(shareGreenJobsThatAreOG)
          ) {
            return;
          }

          dataRows.push({
            date,
            shareGreenNonOG,
            shareOGTotal,
            shareGreenOG,
            shareGreenJobsThatAreOG,
          });
        });

        if (dataRows.length === 0) {
          throw new Error("No valid rows parsed from CSV");
        }

        // Select only year 2021–2025
        const filteredDataRows = dataRows.filter((r) => {
          const year = parseInt(r.date);
          return year >= 2021 && year <= 2025;
        });

        const labels = filteredDataRows.map((r) => r.date);
        const greenNonOG = filteredDataRows.map((r) => r.shareGreenNonOG);
        const ogTotal = filteredDataRows.map((r) => r.shareOGTotal);
        const greenOG = filteredDataRows.map((r) => r.shareGreenOG);
        const greenJobsThatAreOG = filteredDataRows.map(
          (r) => r.shareGreenJobsThatAreOG
        );

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary =
          documentStyle.getPropertyValue("--text-color-secondary");
        const surfaceBorder =
          documentStyle.getPropertyValue("--surface-border") || "#e0e0e0";

        const primaryGreen =
          documentStyle.getPropertyValue("--green-500") || "#22c55e";
        const ogColor =
          documentStyle.getPropertyValue("--blue-500") || "#3b82f6";
        const greenOgColor =
          documentStyle.getPropertyValue("--teal-400") || "#2dd4bf";
        const lineColor =
          documentStyle.getPropertyValue("--orange-500") || "#f97316";

        const data = {
          labels,
          datasets: [
            {
              type: "line",
              label: "Share of Green Jobs that are O&G",
              borderColor: lineColor,
              borderWidth: 2,
              pointRadius: 3,
              fill: false,
              tension: 0.3,
              data: greenJobsThatAreOG,
              yAxisID: "y",
            },
            {
              type: "bar",
              label: "Share of Green Jobs (non-O&G)",
              backgroundColor: primaryGreen,
              data: greenNonOG,
              stack: "shares",
              borderColor: "white",
              borderWidth: 1,
              borderRadius: 8,
              maxBarThickness: 40,
              yAxisID: "y",
            },
            {
              type: "bar",
              label: "Share of O&G Jobs (Green and non-Green)",
              backgroundColor: ogColor,
              data: ogTotal,
              stack: "shares",
              borderColor: "white",
              borderWidth: 1,
              borderRadius: 8,
              maxBarThickness: 40,
              yAxisID: "y",
            },
            {
              type: "bar",
              label: "share of Green O&G jobs",
              backgroundColor: greenOgColor,
              data: greenOG,
              stack: "shares",
              borderColor: "white",
              borderWidth: 1,
              borderRadius: 8,
              maxBarThickness: 40,
              yAxisID: "y",
            },
          ],
        };

        const options = {
          maintainAspectRatio: false,
          responsive: true,
          layout: {
            padding: { top: 10, right: 20, left: 10, bottom: 0 },
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
                  const value =
                    typeof context.parsed.y === "number"
                      ? context.parsed.y.toFixed(2)
                      : context.parsed.y;
                  return `${context.dataset.label}: ${value}%`;
                },
              },
            },
          },
          scales: {
            x: {
              stacked: true,
              ticks: {
                color: textColorSecondary,
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false,
              },
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: {
                color: textColorSecondary,
                callback: (value) => value + "%", // show '%' suffix
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
          Green and O&G Jobs Shares over Time
        </h2>
        <p className="m-0 text-sm text-red-500">
          Error loading chart data: {error}
        </p>
      </div>
    );
  }

  if (!chartData) return null;

  return (
    <div className="card surface-card shadow-2 border-round-xl p-4 w-full min-h-[420px] flex flex-col">
      <div className="justify-content-between align-items-center mb-3 gap-3 w-full">
        <div>
          <h2 className="mt-1 mb-1 text-xl">
            Green and O&G Jobs Shares over Time
          </h2>
          <p className="m-0 text-sm text-color-secondary">
            Stacked bars show the share of{" "}
            <strong>green jobs outside O&amp;G</strong>,{" "}
            <strong>all O&amp;G jobs</strong>, and{" "}
            <strong>green jobs within O&amp;G</strong>. The line shows, for each
            year, what share of all green jobs are in the O&amp;G sector.
          </p>
        </div>
      </div>

      {/* Chart area */}
      <div className="w-full mt-2" style={{ minHeight: "360px" }}>
        <Chart
          className="chart-green-8 w-full h-full"
          type="line"
          data={chartData}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default GreenFig8;
