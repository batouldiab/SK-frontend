import { Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import CountryCitiesMap from "./pages/CountryCitiesMap";
import GreenOverview from "./pages/GreenOverview";
import GreenOccupations from "./pages/GreenOccupations";
import GreenInEnergySector from "./pages/GreenInEnergySector";
import Benchmarking from "./pages/Benchmarking";

const AppRoutes = () => (
  <Routes>
    <Route element={<DefaultLayout />}>
      <Route path="/" element={<CountryCitiesMap />} />
      {/* <Route path="/" /> */}
      <Route path="greenOverview" element={<GreenOverview />} />
      <Route path="greenOccupations" element={<GreenOccupations />} />
      <Route path="greenInEnergySector" element={<GreenInEnergySector />} />
      <Route path="benchmarking" element={<Benchmarking />} />
      <Route path="benchmarkingOccupationalDemands" element={<Navigate to="/benchmarking" replace />} />
      <Route path="benchmarSkillSimilarity" element={<Navigate to="/benchmarking" replace />} />
      <Route path="benchmarkingOccupationalPattern" element={<Navigate to="/benchmarking" replace />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
