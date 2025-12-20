import SalesLayout from "../../layouts/SalesLayout";
import StatCard from "../../components/common/StatCard";
import DealHistory from "../../components/tables/DealHistory";
import { useSales } from "../../context/SalesContext";

const SalesDashboard = () => {
  const { deals } = useSales();

  const totalDeals = deals.length;
  const totalIncentive = deals.reduce(
    (sum, d) => sum + d.incentive,
    0
  );

  const thisMonthDeals = deals.filter(deal => {
    const dealDate = new Date(deal.date);
    const now = new Date();
    return dealDate.getMonth() === now.getMonth() && dealDate.getFullYear() === now.getFullYear();
  });
  const thisMonthIncentive = thisMonthDeals.reduce((sum, d) => sum + d.incentive, 0);

  return (
    <SalesLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Performance Dashboard
          </h1>
          <p className="text-sm text-gray-600">Overview of your sales and rewards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Total Deals" 
            value={totalDeals} 
          />
          <StatCard
            title="Total Incentive"
            value={`₹${totalIncentive.toLocaleString('en-IN')}`}
          />
          <StatCard 
            title="This Month" 
            value={`₹${thisMonthIncentive.toLocaleString('en-IN')}`}
          />
        </div>

        <DealHistory />
      </div>
    </SalesLayout>
  );
};

export default SalesDashboard;
