import SalesLayout from "../../layouts/SalesLayout";
import StatCard from "../../components/common/StatCard";
import DealHistory from "../../components/tables/DealHistory";
import GoalTracker from "../../components/common/GoalTracker";
import PerformanceTrend from "../../components/charts/PerformanceTrend";
import { useSales } from "../../context/SalesContext";

const SalesDashboard = () => {
  const { deals } = useSales();

  // Show all deals in count, but only approved deals for incentive
  const totalDeals = deals.length;
  const approvedDeals = deals.filter(d => d.status === "Approved");
  const totalIncentive = approvedDeals.reduce((sum, d) => sum + d.incentive, 0);

  // This month - all deals for count, approved for incentive
  const thisMonthAllDeals = deals.filter(deal => {
    const dealDate = new Date(deal.date);
    const now = new Date();
    return dealDate.getMonth() === now.getMonth() && 
           dealDate.getFullYear() === now.getFullYear();
  });
  
  const thisMonthApprovedDeals = thisMonthAllDeals.filter(d => d.status === "Approved");
  const thisMonthIncentive = thisMonthApprovedDeals.reduce((sum, d) => sum + d.incentive, 0);

  return (
    <SalesLayout>
      <div className="space-y-10">
        <div>
          <h1 className="section-title">Performance</h1>
          <div className="h-px bg-black w-24 mt-2"></div>
          <p className="section-subtitle mt-4">Dashboard Overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Deals" 
            value={totalDeals}
            gradient="from-primary-500 to-primary-600"
          />
          <StatCard
            title="Total Incentive"
            value={`₹${totalIncentive.toLocaleString('en-IN')}`}
            gradient="from-emerald-500 to-green-600"
          />
          <StatCard 
            title="This Month Incentive" 
            value={`₹${thisMonthIncentive.toLocaleString('en-IN')}`}
            gradient="from-accent-500 to-cyan-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GoalTracker />
          <PerformanceTrend />
        </div>

        <div className="pt-6">
          <DealHistory />
        </div>
      </div>
    </SalesLayout>
  );
};

export default SalesDashboard;
