// src/components/GreenFig9.jsx
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

const GreenFig9 = () => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCsv = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/data/green_fig9.csv");
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

        const countries = [];
        const totalJobs = [];
        const shares = [];

        const THRESHOLD = 50000; // > 50,000

        rows.forEach((line) => {
          if (!line.trim()) return;

          const cols = line.split(delimiter);
          // Expect at least 3 columns: Country, Share, Total jobs
          if (cols.length < 3) return;

          const country = cols[0].trim();
          if (!country) return; // skip blank country rows

          const shareRaw = cols[1].toString().trim();
          const totalRaw = cols[2].toString().trim();

          const share = parseFloat(
            shareRaw.replace(/\s/g, "").replace(",", ".")
          );
          const total = parseFloat(
            totalRaw.replace(/,/g, "").replace(/\s/g, "")
          );

          if (isNaN(share) || isNaN(total) || total <= THRESHOLD) {
            return;
          }

          countries.push(country);
          totalJobs.push(total);
          shares.push(share);
        });

        if (countries.length === 0) {
          throw new Error("No valid rows parsed from CSV after filtering");
        }

        const averageShare = shares.reduce((a, b) => a + b, 0) / shares.length;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary =
          documentStyle.getPropertyValue("--text-color-secondary");
        const surfaceBorder =
          documentStyle.getPropertyValue("--surface-border") || "#e0e0e0";

        const primaryGreen =
          documentStyle.getPropertyValue("--green-500") || "#22c55e";
        const primaryBlue =
          documentStyle.getPropertyValue("--blue-500") || "#3b82f6";

        const data = {
          labels: countries,
          datasets: [
            {
              type: "bar",
              label: "Green jobs share within O&G (%)",
              backgroundColor: primaryGreen,
              data: shares,
              borderColor: "white",
              borderWidth: 1,
              borderRadius: 8,
              maxBarThickness: 48,
            },
            {
              type: "line",
              label: "Average share",
              borderColor: primaryBlue,
              borderWidth: 2,
              pointRadius: 0,
              fill: false,
              tension: 0.35,
              borderDash: [6, 6],
              data: Array(countries.length).fill(averageShare),
            },
          ],
        };

        const options = {
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

                  if (context.dataset.type === "bar") {
                    const country = context.label;
                    const total = totalJobs[idx];
                    const share = shares[idx];

                    return [
                      `${country}`,
                      `Total jobs: ${Math.round(total).toLocaleString()}`,
                      `Green jobs within O&G: ${share.toFixed(2)}%`,
                    ];
                  }

                  if (context.dataset.type === "line") {
                    return (
                      context.dataset.label +
                      ": " +
                      context.parsed.y.toFixed(2) +
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
              ticks: {
                color: textColorSecondary,
                maxRotation: 45,
                autoSkip: true,
              },
              grid: { display: false },
            },
            y: {
              beginAtZero: true,
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
                text: "Green jobs share within O&G (%)",
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
          Green Jobs within O&amp;G Sectors by Country
        </h2>
        <p className="m-0 text-sm text-red-500">
          Error loading chart data: {error}
        </p>
      </div>
    );
  }

  if (!chartData) return null;

  const labels = chartData.labels || [];
  const distData =
    chartData.datasets?.[0]?.data && Array.isArray(chartData.datasets[0].data)
      ? chartData.datasets[0].data
      : [];
  const totalCountries = labels.length;
  const avg =
    distData.length > 0
      ? distData.reduce((a, b) => a + b, 0) / distData.length
      : 0;
  const max = distData.length > 0 ? Math.max(...distData) : 0;

  return (
    <div className="card surface-card shadow-2 border-round-xl p-4 w-full min-h-[420px] flex flex-col">
      <div className="justify-content-between align-items-center mb-3 gap-3 w-full">
        <div>
          <h2 className="mt-1 mb-1 text-xl">
            Green Jobs within O&amp;G Sectors by Country
          </h2>
          <p className="m-0 text-sm text-color-secondary">
            Share of green jobs within the oil &amp; gas sector, among all
            scraped postings per country.
          </p>

          <div className="mt-3 text-xs text-color-secondary max-w-[100%]">
            <span className="inline-flex align-items-center gap-2">
              <span
                className="w-2 h-2 border-round"
                style={{ backgroundColor: "var(--surface-border)" }}
              />
              <span>
                ESCWA countries with fewer than 50,000 scraped job postings were
                excluded from this figure.
              </span>
            </span>
          </div>

          <div className="flex gap-1 flex-wrap justify-content-center align-items-center mt-3">
            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Countries
              </span>
              <span className="block text-sm font-semibold">
                {totalCountries}
              </span>
            </div>
            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Avg. green share (O&amp;G)
              </span>
              <span className="block text-sm font-semibold">
                {avg.toFixed(1)}%
              </span>
            </div>
            <div className="surface-100 border-round-lg px-3 py-2 text-right">
              <span className="block text-xs text-color-secondary">
                Max country share
              </span>
              <span className="block text-sm font-semibold">
                {max.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="w-full mt-2" style={{ minHeight: "360px" }}>
        <Chart
          className="chart-green-9 w-full h-full"
          type="bar"
          data={chartData}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default GreenFig9;
