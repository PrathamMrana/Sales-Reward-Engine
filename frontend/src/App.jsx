import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import RequireAuth from "./auth/RequireAuth";
import SalesDashboard from "./pages/sales/SalesDashboard";
import DealHistoryPage from "./pages/sales/DealHistoryPage";
import Calculator from "./pages/Calculator";
import ProfilePage from "./pages/sales/ProfilePage";
import IncentivePolicyPage from "./pages/sales/IncentivePolicyPage";
import ReportsPage from "./pages/sales/ReportsPage";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { auth } = useAuth();

  return (
    <Routes>
      {/* ROOT */}
      <Route
        path="/"
        element={
          auth ? <Navigate to="/sales" /> : <Navigate to="/login" />
        }
      />

      <Route path="/login" element={<Login />} />

      {/* SALES ROUTES */}
      <Route element={<RequireAuth allowedRoles={["SALES"]} />}>
        <Route path="/sales" element={<SalesDashboard />} />
        <Route path="/sales/history" element={<DealHistoryPage />} />
        <Route path="/sales/calculator" element={<Calculator />} />
        <Route path="/sales/profile" element={<ProfilePage />} />
        <Route path="/sales/policy" element={<IncentivePolicyPage />} />
        <Route path="/sales/reports" element={<ReportsPage />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
