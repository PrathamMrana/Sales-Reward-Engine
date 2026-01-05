import AdminLayout from "../../layouts/AdminLayout";
import StatCard from "../../components/common/StatCard";
import SalesChart from "../../components/charts/SalesChart";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-10">
        <div>
          <h1 className="section-title">Admin</h1>
          <div className="h-px bg-black w-24 mt-2"></div>
          <p className="section-subtitle mt-4">Dashboard Overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Sales" value="₹12,00,000" />
          <StatCard title="Incentives Paid" value="₹2,00,000" />
        <StatCard title="Top Performer" value="Amit" />
        <StatCard title="Pending Approvals" value="5" />
      </div>

        <div className="pt-6">
      <SalesChart />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
