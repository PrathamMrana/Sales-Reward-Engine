import SalesLayout from "../../layouts/SalesLayout";
import StatCard from "../../components/common/StatCard";
import DealHistory from "../../components/tables/DealHistory";
import GoalTracker from "../../components/common/GoalTracker";
import PerformanceTrend from "../../components/charts/PerformanceTrend";
import InsightsPanel from "../../components/common/InsightsPanel";
import PerformanceComparison from "../../components/common/PerformanceComparison";
import { useSales } from "../../context/SalesContext";

const SalesDashboard = () => {
  const { deals } = useSales();

  // Show all deals in count, but only approved deals for incentive
  const totalDeals = deals.length;
  const approvedDeals = deals.filter(d => d.status === "Approved");
  const totalIncentive = approvedDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);

  // This month calculations
  const now = new Date();
  const thisMonthAllDeals = deals.filter(deal => {
    try {
      let dealDate;
      if (typeof deal.date === 'string') {
        dealDate = new Date(deal.date);
        if (isNaN(dealDate.getTime())) {
          const parts = deal.date.split('/');
          if (parts.length === 3) {
            dealDate = new Date(parts[2], parts[0] - 1, parts[1]);
          }
        }
      } else {
        dealDate = new Date(deal.date);
      }
      return dealDate.getMonth() === now.getMonth() && 
             dealDate.getFullYear() === now.getFullYear();
    } catch (e) {
      return false;
    }
  });
  
  const thisMonthApprovedDeals = thisMonthAllDeals.filter(d => d.status === "Approved");
  const thisMonthIncentive = thisMonthApprovedDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);

  // Last month calculations for trends
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const lastMonthDeals = deals.filter(deal => {
    try {
      let dealDate;
      if (typeof deal.date === 'string') {
        dealDate = new Date(deal.date);
        if (isNaN(dealDate.getTime())) {
          const parts = deal.date.split('/');
          if (parts.length === 3) {
            dealDate = new Date(parts[2], parts[0] - 1, parts[1]);
          }
        }
      } else {
        dealDate = new Date(deal.date);
      }
      return dealDate >= lastMonth && dealDate <= lastMonthEnd && deal.status === "Approved";
    } catch {
      return false;
    }
  });
  const lastMonthIncentive = lastMonthDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);

  // Calculate trends
  const incentiveTrend = lastMonthIncentive > 0 
    ? ((thisMonthIncentive - lastMonthIncentive) / lastMonthIncentive * 100).toFixed(1)
    : null;
  const dealsTrend = lastMonthDeals.length > 0
    ? ((thisMonthApprovedDeals.length - lastMonthDeals.length) / lastMonthDeals.length * 100).toFixed(1)
    : null;

  return (
    <SalesLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="section-title">Performance Dashboard</h1>
          <div className="h-px bg-black w-24 mt-2"></div>
          <p className="section-subtitle mt-4">Real-time insights and analytics</p>
        </div>

        {/* Section 1: Performance Overview - KPIs */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Total Deals" 
              value={totalDeals || 0}
              gradient="primary"
              subtitle="All time"
              trend={dealsTrend ? (parseFloat(dealsTrend) > 0 ? "up" : "down") : null}
              trendValue={dealsTrend ? `${Math.abs(parseFloat(dealsTrend))}%` : null}
            />
            <StatCard
              title="Total Incentive"
              value={`₹${(totalIncentive || 0).toLocaleString('en-IN')}`}
              gradient="emerald"
              subtitle="Approved deals only"
            />
            <StatCard 
              title="This Month Incentive" 
              value={`₹${(thisMonthIncentive || 0).toLocaleString('en-IN')}`}
              gradient="accent"
              subtitle="Current month"
              trend={incentiveTrend ? (parseFloat(incentiveTrend) > 0 ? "up" : "down") : null}
              trendValue={incentiveTrend ? `${Math.abs(parseFloat(incentiveTrend))}%` : null}
            />
          </div>
        </section>

        {/* Section 2: Goal & Progress */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-900">Goal & Progress</h2>
          </div>
          <GoalTracker />
        </section>

        {/* Section 3: Trends & Insights */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-900">Trends & Insights</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hero Chart - Takes 2 columns */}
            <div className="lg:col-span-2">
              <PerformanceTrend />
            </div>
            {/* Insights Panel - Takes 1 column */}
            <div>
              <InsightsPanel />
            </div>
          </div>
        </section>

        {/* Section 3.5: Performance Comparison */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-900">Performance Comparison</h2>
          </div>
          <PerformanceComparison />
        </section>

        {/* Section 4: Recent Activity */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <DealHistory />
        </section>
      </div>
    </SalesLayout>
  );
};

export default SalesDashboard;
