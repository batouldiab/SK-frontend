import { Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Dashboard from "./pages/Dashboard";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";

const AppRoutes = () => (
  <Routes>
    <Route element={<DefaultLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="page1" element={<Page1 />} />
      <Route path="page2" element={<Page2 />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
