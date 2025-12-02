import { Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import CountryCitiesMap from "./pages/CountryCitiesMap";
import GreenOverview from "./pages/GreenOverview";
import GreenOccupations from "./pages/GreenOccupations";
import GreenInEnergySector from "./pages/GreenInEnergySector";
import BenchmarkingOccupationalDemands from "./pages/BenchmarkingOccupationalDemands";
import BenchmarkSkillSimilarity from "./pages/BenchmarSkillSimilarity";
import BenchmarkingOccupationalPattern from "./pages/BenchmarkingOccupationalPattern"

const AppRoutes = () => (
  <Routes>
    <Route element={<DefaultLayout />}>
      {/* <Route path="/" element={<CountryCitiesMap />} /> */}
      <Route path="/" />
      <Route path="greenOverview" element={<GreenOverview />} />
      <Route path="greenOccupations" element={<GreenOccupations />} />
      <Route path="greenInEnergySector" element={<GreenInEnergySector />} />
      <Route path="benchmarkingOccupationalDemands" element={<BenchmarkingOccupationalDemands />} />
      <Route path="benchmarSkillSimilarity" element={<BenchmarkSkillSimilarity />} />
      <Route path="benchmarkingOccupationalPattern" element={<BenchmarkingOccupationalPattern />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
