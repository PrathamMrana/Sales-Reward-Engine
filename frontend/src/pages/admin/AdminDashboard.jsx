import AdminLayout from "../../layouts/AdminLayout";
import StatCard from "../../components/common/StatCard";
import SalesChart from "../../components/charts/SalesChart";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of sales performance and rewards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Sales" value="₹12,00,000" />
          <StatCard title="Incentives Paid" value="₹2,00,000" />
          <StatCard title="Top Performer" value="Amit" />
          <StatCard title="Pending Approvals" value="5" />
        </div>

        <SalesChart />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
