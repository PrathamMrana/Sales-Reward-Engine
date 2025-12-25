import { useSales } from "../../context/SalesContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const PerformanceTrend = () => {
  const { deals } = useSales();

  // Group deals by month
  const monthlyData = deals.reduce((acc, deal) => {
    const date = new Date(deal.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthLabel,
        deals: 0,
        incentive: 0
      };
    }

    if (deal.status === "Approved") {
      acc[monthKey].deals += 1;
      acc[monthKey].incentive += deal.incentive;
    }

    return acc;
  }, {});

  const chartData = Object.values(monthlyData).sort((a, b) => {
    return new Date(a.month) - new Date(b.month);
  });

  if (chartData.length === 0) {
    return (
      <div className="card-modern p-12 text-center relative">
        <div className="absolute top-0 left-0 w-16 h-16 border-b border-r border-gray-200"></div>
        <p className="text-sm text-gray-500">No data available for trend analysis</p>
      </div>
    );
  }

  return (
    <div className="card-modern p-8 relative">
      <div className="absolute top-0 right-0 w-16 h-16 border-b border-r border-gray-200"></div>
      
      <div className="mb-6">
        <h2 className="section-title">Performance Trend</h2>
        <div className="h-px bg-black w-24 mt-2"></div>
        <p className="section-subtitle mt-4">Monthly Overview</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '0'
            }}
            formatter={(value, name) => {
              if (name === 'incentive') {
                return [`₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, 'Incentive'];
              }
              return [value, name === 'deals' ? 'Deals' : name];
            }}
          />
          <Line 
            type="monotone" 
            dataKey="deals" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 5 }}
            name="Deals"
          />
          <Line 
            type="monotone" 
            dataKey="incentive" 
            stroke="#14b8a6" 
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ fill: '#14b8a6', r: 5 }}
            name="Incentive"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
          <span className="text-xs text-gray-700 uppercase tracking-widest font-medium">Deals</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-1 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full border-dashed border-t-2"></div>
          <span className="text-xs text-gray-700 uppercase tracking-widest font-medium">Incentive</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTrend;

