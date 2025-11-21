// ParquetReaderComponent.jsx
import React, { useEffect, useState } from "react";
import { parquetReadObjects } from "hyparquet";

const ParquetReaderComponent = ({ filepath, onDataLoaded }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const readParquetFile = async () => {
      try {
        setError(null);

        // Fetch the parquet file
        const response = await fetch(filepath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();

        // 👇 IMPORTANT: parquetReadObjects returns a Promise<rows[]>, not an async iterator
        const rows = await parquetReadObjects({
          file: arrayBuffer,            // ArrayBuffer is allowed as file :contentReference[oaicite:1]{index=1}
          columns: ["Country", "labels"] // only what we need = less work
        });

        // Aggregate here instead of in GreenFig1
        const countryStats = {};

        for (const row of rows) {
          const country = row.Country;
          if (!country) continue;

          if (!countryStats[country]) {
            countryStats[country] = {
              greenJobsCount: 0,
              totalJobsScraped: 0
            };
          }

          countryStats[country].totalJobsScraped += 1;

          // parse labels
          let labels = {};
          try {
            if (typeof row.labels === "string") {
              labels = JSON.parse(row.labels);
            } else if (typeof row.labels === "object" && row.labels !== null) {
              labels = row.labels;
            }
          } catch (e) {
            // ignore bad JSON
          }

          if (labels["Green Label"] === 1) {
            countryStats[country].greenJobsCount += 1;
          }
        }

        if (onDataLoaded) {
          onDataLoaded(countryStats); // send only aggregated data to parent
        }
      } catch (err) {
        console.error("Error reading Parquet file:", err);
        setError(err.message || "Unknown error");
      }
    };

    readParquetFile();
  }, [filepath, onDataLoaded]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return null;
};

export default ParquetReaderComponent;
