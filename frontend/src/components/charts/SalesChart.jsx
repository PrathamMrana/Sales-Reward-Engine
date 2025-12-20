import { useSales } from "../../context/SalesContext";

const SalesChart = () => {
  const { deals } = useSales();

  const totalIncentive = deals.reduce((sum, d) => sum + d.incentive, 0);
  const avgDealValue = deals.length > 0 
    ? deals.reduce((sum, d) => sum + d.amount, 0) / deals.length 
    : 0;

  return (
    <div className="card-modern p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-0.5">
          Performance Overview
        </h2>
        <p className="text-xs text-gray-600">Sales metrics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Total Deals</p>
          <p className="text-xl font-semibold text-gray-900">{deals.length}</p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Total Rewards</p>
          <p className="text-xl font-semibold text-gray-900">₹{totalIncentive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Avg Deal Value</p>
          <p className="text-xl font-semibold text-gray-900">₹{avgDealValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
