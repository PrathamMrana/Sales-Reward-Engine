import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import RequireAuth from "./auth/RequireAuth";
import SalesDashboard from "./pages/sales/SalesDashboard";
import DealHistoryPage from "./pages/sales/DealHistoryPage";
import Calculator from "./pages/Calculator";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DealApproval from "./pages/admin/DealApproval";
import UserManagement from "./pages/admin/UserManagement";
import IncentivePolicyPage from "./pages/sales/IncentivePolicyPage";
import ProfilePage from "./pages/sales/ProfilePage";
import NotificationManagement from "./pages/admin/NotificationManagement";
import AdminPerformance from "./pages/admin/AdminPerformance";
import PerformanceDashboard from "./pages/admin/PerformanceDashboard";
import AuditLogs from "./pages/admin/AuditLogs";
import PolicySimulation from "./pages/admin/PolicySimulation";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { auth } = useAuth();

  return (
    <Routes>
      {/* ROOT */}
      <Route
        path="/"
        element={
          auth
            ? (auth.user?.role === "ADMIN" ? <Navigate to="/admin" /> : <Navigate to="/sales" />)
            : <Navigate to="/login" />
        }
      />

      <Route path="/login" element={<Login />} />

      {/* SHARED ROUTES (ADMIN & SALES) */}
      <Route element={<RequireAuth allowedRoles={["ADMIN", "SALES"]} />}>
        <Route path="/sales/policy" element={<IncentivePolicyPage />} />
        <Route path="/sales/profile" element={<ProfilePage />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/approvals" element={<DealApproval />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/notifications" element={<NotificationManagement />} />
        <Route path="/admin/performance" element={<PerformanceDashboard />} />
        <Route path="/admin/performance/:userId" element={<AdminPerformance />} />

        <Route path="/admin/audit-logs" element={<AuditLogs />} />
        <Route path="/admin/simulation" element={<PolicySimulation />} />
        <Route path="/admin/profile" element={<ProfilePage />} />
      </Route>

      {/* SALES ROUTES */}
      <Route element={<RequireAuth allowedRoles={["SALES"]} />}>
        <Route path="/sales" element={<SalesDashboard />} />
        <Route path="/sales/history" element={<DealHistoryPage />} />
        <Route path="/sales/calculator" element={<Calculator />} />
      </Route>

      <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  );
};
export default App;
