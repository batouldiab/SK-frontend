import { Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import CountryCitiesMap from "./pages/CountryCitiesMap";
import GreenOverview from "./pages/GreenOverview";
import Benchmarking from "./pages/Benchmarking";

const AppRoutes = () => (
  <Routes>
    <Route element={<DefaultLayout />}>
      {/* <Route path="/" element={<CountryCitiesMap />} /> */}
      <Route path="/" />
      <Route path="greenOverview" element={<GreenOverview />} />
      <Route path="benchmarking" element={<Benchmarking />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
