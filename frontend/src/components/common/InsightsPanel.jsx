import { useSales } from "../../context/SalesContext";

const InsightsPanel = () => {
  const { deals } = useSales();

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Helper function to parse dates
  const parseDate = (dateStr) => {
    try {
      if (typeof dateStr === 'string') {
        let date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            date = new Date(parts[2], parts[0] - 1, parts[1]);
          }
        }
        return date;
      }
      return new Date(dateStr);
    } catch {
      return null;
    }
  };

  // Today's deals
  const todayDeals = deals.filter(deal => {
    if (deal.status !== "Approved") return false;
    const dealDate = parseDate(deal.date);
    if (!dealDate || isNaN(dealDate.getTime())) return false;
    return dealDate >= today;
  });

  // This week's deals
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const thisWeekDeals = deals.filter(deal => {
    if (deal.status !== "Approved") return false;
    const dealDate = parseDate(deal.date);
    if (!dealDate || isNaN(dealDate.getTime())) return false;
    return dealDate >= weekStart;
  });

  // Best deal this month
  const thisMonthDeals = deals.filter(deal => {
    if (deal.status !== "Approved") return false;
    const dealDate = parseDate(deal.date);
    if (!dealDate || isNaN(dealDate.getTime())) return false;
    return dealDate.getMonth() === now.getMonth() && 
           dealDate.getFullYear() === now.getFullYear();
  });

  const bestDeal = thisMonthDeals.reduce((best, current) => {
    return (current.incentive || 0) > (best?.incentive || 0) ? current : best;
  }, null);

  // Average incentive
  const avgIncentive = thisMonthDeals.length > 0
    ? thisMonthDeals.reduce((sum, d) => sum + (d.incentive || 0), 0) / thisMonthDeals.length
    : 0;

  const insights = [
    {
      label: "Deals Today",
      value: todayDeals.length,
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "from-primary-500 to-primary-600"
    },
    {
      label: "This Week",
      value: thisWeekDeals.length,
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      color: "from-accent-500 to-accent-600"
    },
    {
      label: "Best Deal This Month",
      value: bestDeal ? `₹${bestDeal.incentive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : "N/A",
      icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
      color: "from-emerald-500 to-green-600"
    },
    {
      label: "Avg Incentive",
      value: `₹${avgIncentive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="card-modern p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Quick Insights</h3>
        <div className="h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 w-16"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className="p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${insight.color.includes('primary') ? '#3b82f6' : insight.color.includes('accent') ? '#14b8a6' : insight.color.includes('emerald') ? '#10b981' : '#a855f7'}, ${insight.color.includes('primary') ? '#2563eb' : insight.color.includes('accent') ? '#0d9488' : insight.color.includes('emerald') ? '#059669' : '#9333ea'})`
                }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={insight.icon} />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{insight.label}</p>
                <p className="text-lg font-semibold text-gray-900">{insight.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;

