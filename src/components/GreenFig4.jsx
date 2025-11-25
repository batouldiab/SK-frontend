// src/components/GreenFig4.jsx
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

const GreenFig4 = () => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [maxDemand, setMaxDemand] = useState(0);
  const [totalDemand, setTotalDemand] = useState(0);

  useEffect(() => {
    const loadCsv = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/data/green_fig4.csv");
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

        const jobRows = [];

        rows.forEach((line) => {
          if (!line.trim()) return;
          const cols = line.split(delimiter);
          if (cols.length < 2) return;

          const title = cols[0].trim();
          const demand = parseFloat(
            cols[1].toString().replace(",", ".").replace(" ", "")
          );

          if (!title || isNaN(demand)) {
            return;
          }

          jobRows.push({
            title,
            demand,
          });
        });

        if (jobRows.length === 0) {
          throw new Error("No valid rows parsed from CSV");
        }

        // Sort by demand descending and keep top 20 (file is already top 20, but just in case)
        jobRows.sort((a, b) => b.demand - a.demand);
        const topJobs = jobRows.slice(0, 20);

        const jobTitles = topJobs.map((r) => r.title);
        const demands = topJobs.map((r) => r.demand);

        const maxD = Math.max(...demands);
        const totalD = demands.reduce((s, v) => s + v, 0);

        setMaxDemand(maxD);
        setTotalDemand(totalD);

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary =
          documentStyle.getPropertyValue("--text-color-secondary");
        const surfaceBorder =
          documentStyle.getPropertyValue("--surface-border") || "#e0e0e0";

        const primaryGreen =
          documentStyle.getPropertyValue("--green-500") || "#22c55e";

        const data = {
          labels: jobTitles,
          datasets: [
            {
              type: "bar",
              label: "Green demand (number of postings)",
              backgroundColor: primaryGreen,
              data: demands,
              borderColor: "white",
              borderWidth: 1,
              borderRadius: 8,
              maxBarThickness: 32,
            },
          ],
        };

        const options = {
          indexAxis: "y", // horizontal bars
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
              callbacks: {
                label: function (context) {
                  const title = context.label;
                  const value = context.parsed.x;
                  return `${title}: ${value.toLocaleString()} green postings`;
                },
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              suggestedMax: maxD * 1.1,
              ticks: {
                color: textColorSecondary,
                callback: (value) => value.toLocaleString(),
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false,
              },
              title: {
                display: true,
                text: "Number of green job postings",
                color: textColorSecondary,
              },
            },
            y: {
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
          Green Demand by ESCO Job Title (Top 20)
        </h2>
        <p className="m-0 text-sm text-red-500">
          Error loading chart data: {error}
        </p>
      </div>
    );
  }

  if (!chartData) return null;

  const labels = chartData.labels || [];

  return (
    <div className="card surface-card shadow-2 border-round-xl p-4 w-full h-full flex flex-col lg:flex-row">
      {/* Header + stats */}
      <div className=" justify-content-between align-items-start mb-3 gap-3 w-full lg:w-[30%]">
        <div className="w-full p-2">
          <h2 className="mt-1 mb-1 text-xl">
            Green Demand by ESCO Job Title (Top 20)
          </h2>
          <p className="m-0 text-sm text-color-secondary">
            Top 20 ESCO job titles with the highest number of{" "}
            <strong>green-labelled</strong> postings in the dataset. Bars show
            the total count of green postings for each occupation.
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
                Max green demand
              </span>
              <span className="block text-sm font-semibold">
                {maxDemand.toLocaleString()}
              </span>
            </div>
            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Total green postings (top 20)
              </span>
              <span className="block text-sm font-semibold">
                {totalDemand.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="w-full lg:w-[70%] min-h-100 max-h-[100%]">
        <Chart
          className="chart-green-4"
          type="bar"
          data={chartData}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default GreenFig4;
