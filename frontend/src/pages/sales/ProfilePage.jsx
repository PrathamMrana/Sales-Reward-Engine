import SalesLayout from "../../layouts/SalesLayout";
import { useSales } from "../../context/SalesContext";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/common/StatCard";

const ProfilePage = () => {
  const { deals } = useSales();
  const { auth } = useAuth();

  // Calculate lifetime stats
  const approvedDeals = deals.filter(d => d.status === "Approved");
  const lifetimeIncentive = approvedDeals.reduce((sum, d) => sum + d.incentive, 0);
  const totalDealsCount = deals.length;

  // Find best month
  const monthlyStats = deals.reduce((acc, deal) => {
    if (deal.status !== "Approved") return acc;
    const date = new Date(deal.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthLabel, incentive: 0, deals: 0 };
    }
    acc[monthKey].incentive += deal.incentive;
    acc[monthKey].deals += 1;
    return acc;
  }, {});

  const bestMonth = Object.values(monthlyStats).reduce((best, current) => {
    return current.incentive > (best?.incentive || 0) ? current : best;
  }, null);

  // Calculate average deal value
  const avgDealValue = approvedDeals.length > 0
    ? approvedDeals.reduce((sum, d) => sum + d.amount, 0) / approvedDeals.length
    : 0;

  // Status breakdown
  const statusBreakdown = {
    Draft: deals.filter(d => d.status === "Draft").length,
    Submitted: deals.filter(d => d.status === "Submitted").length,
    Approved: approvedDeals.length,
    Rejected: deals.filter(d => d.status === "Rejected").length,
  };

  return (
    <SalesLayout>
      <div className="space-y-10">
        <div>
          <h1 className="section-title">My Profile</h1>
          <div className="h-px bg-black w-24 mt-2"></div>
          <p className="section-subtitle mt-4">Performance Summary</p>
        </div>

        {/* Profile Header */}
        <div className="card-modern p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100 to-accent-100 opacity-30 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-xl">
                <span className="text-white text-3xl font-bold">
                  {(auth?.name || "U").charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">{auth?.name || "User"}</h2>
                <p className="text-sm text-primary-600 uppercase tracking-widest font-medium">{auth?.role || "SALES"}</p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-primary-200 to-accent-200"></div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Lifetime Incentive" 
            value={`₹${(lifetimeIncentive || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
            gradient="emerald"
          />
          <StatCard 
            title="Total Deals" 
            value={totalDealsCount || 0}
            gradient="primary"
          />
          <StatCard 
            title="Avg Deal Value" 
            value={`₹${(avgDealValue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            gradient="accent"
          />
        </div>

        {/* Best Month & Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Best Month */}
          <div className="card-modern p-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-widest mb-4">Best Month</h3>
            {bestMonth ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Month</p>
                  <p className="text-lg font-semibold text-gray-900">{bestMonth.month}</p>
                </div>
                <div className="flex items-baseline space-x-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Incentive</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      ₹{bestMonth.incentive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Deals</p>
                    <p className="text-xl font-semibold text-gray-900">{bestMonth.deals}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No approved deals yet</p>
            )}
          </div>

          {/* Status Breakdown */}
          <div className="card-modern p-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-widest mb-4">Deal Status</h3>
            <div className="space-y-3">
              {Object.entries(statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{status}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${totalDealsCount > 0 ? (count / totalDealsCount) * 100 : 0}%`,
                          background: status === "Approved" 
                            ? "linear-gradient(to right, #10b981, #059669)"
                            : status === "Submitted"
                            ? "linear-gradient(to right, #3b82f6, #2563eb)"
                            : status === "Rejected"
                            ? "linear-gradient(to right, #ef4444, #dc2626)"
                            : "linear-gradient(to right, #6b7280, #4b5563)"
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SalesLayout>
  );
};

export default ProfilePage;

