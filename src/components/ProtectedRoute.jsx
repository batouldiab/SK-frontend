import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   const location = useLocation();

//   // Check if we're already on the login page
//   const isLoginPage = location.pathname === "/login";

//   if (!isAuthenticated && !isLoginPage) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

  return <Outlet />;
}

export default ProtectedRoute;
