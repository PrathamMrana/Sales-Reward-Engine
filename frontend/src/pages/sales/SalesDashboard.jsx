import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SalesLayout from "../../layouts/SalesLayout";
import StatCard from "../../components/common/StatCard";
import GoalTracker from "../../components/common/GoalTracker";
import TierBadge from "../../components/common/TierBadge";
import { useSales } from "../../context/SalesContext";

const SalesDashboard = () => {
  const { deals } = useSales();
  const { auth } = useAuth();
  const userId = auth?.user?.id || auth?.id;

  // 1. Data Processing for KPIs
  const totalDeals = deals.length;
  const approvedDeals = deals.filter(d => d.status === "Approved");
  const localTotalIncentive = approvedDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);

  // This Month Logic
  const now = new Date();
  const thisMonthDeals = approvedDeals.filter(d => {
    try {
      let dealDate;
      if (typeof d.date === 'string') {
        // handle DD/MM/YYYY or standard format
        if (d.date.includes('/')) {
          const [day, month, year] = d.date.split('/');
          dealDate = new Date(year, month - 1, day);
        } else {
          dealDate = new Date(d.date); // ISO string
        }
      } else {
        dealDate = new Date(d.date);
      }
      if (isNaN(dealDate.getTime())) return false;
      return dealDate.getMonth() === now.getMonth() && dealDate.getFullYear() === now.getFullYear();
    } catch (e) { return false; }
  });
  const thisMonthIncentive = thisMonthDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);

  // Trend Calculation (Last 3 Months)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthDeals = approvedDeals.filter(d => {
    const dealDate = new Date(d.date); // assuming standardized or handled by try-catches in real app, keeping simple for demo
    return dealDate.getMonth() === lastMonth.getMonth() && dealDate.getFullYear() === lastMonth.getFullYear();
  });
  const lastMonthIncentive = lastMonthDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);
  const trendPercent = lastMonthIncentive > 0 ? ((thisMonthIncentive - lastMonthIncentive) / lastMonthIncentive * 100).toFixed(0) : 100;
  const trendDirection = trendPercent >= 0 ? "up" : "down";

  // Best Month Calculation
  const dealsByMonth = approvedDeals.reduce((acc, d) => {
    const date = new Date(d.date);
    const key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    acc[key] = (acc[key] || 0) + (d.incentive || 0);
    return acc;
  }, {});
  const bestMonth = Object.keys(dealsByMonth).reduce((a, b) => dealsByMonth[a] > dealsByMonth[b] ? a : b, "N/A");
  const bestMonthValue = dealsByMonth[bestMonth] || 0;

  // 2. Async Data State
  const [performanceData, setPerformanceData] = useState(null);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [topLeader, setTopLeader] = useState(null);

  useEffect(() => {
    if (userId) {
      // Fetch Profile/Performance
      axios.get(`http://localhost:8080/performance/summary?userId=${userId}`)
        .then(res => setPerformanceData(res.data))
        .catch(console.error);

      // Fetch Recent Notifications
      axios.get(`http://localhost:8080/api/notifications/user/${userId}`)
        .then(res => setRecentNotifications(res.data.slice(0, 3)))
        .catch(console.error);

      // Fetch Simple Leaderboard Preview (Top 1)
      axios.get("http://localhost:8080/deals").then(res => {
        const allDeals = res.data;
        const approved = allDeals.filter(d => d.status === "Approved");
        const userStats = {};
        approved.forEach(d => {
          if (!d.user) return;
          if (!userStats[d.user.id]) userStats[d.user.id] = { name: d.user.name, total: 0 };
          userStats[d.user.id].total += (d.incentive || 0);
        });
        const sorted = Object.values(userStats).sort((a, b) => b.total - a.total);
        if (sorted.length > 0) setTopLeader(sorted[0]);
      }).catch(console.error);
    }
  }, [userId, deals]);

  const totalIncentive = performanceData ? performanceData.totalIncentiveEarned : localTotalIncentive;
  const approvalRate = totalDeals > 0 ? ((approvedDeals.length / totalDeals) * 100).toFixed(1) : 0;

  return (
    <SalesLayout>
      <div className="space-y-8 animate-in fade-in duration-500">

        {/* Profile Welcome Header */}
        <div className="bg-gradient-to-r from-primary-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {auth?.user?.name || "Sales Executive"}!</h1>
              <p className="opacity-80 mt-1">Here is your performance snapshot for today.</p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs uppercase tracking-widest opacity-70">Lifetime Earnings</p>
              <p className="text-3xl font-bold">₹{totalIncentive.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* 1. KPIs Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="This Month"
            value={`₹${thisMonthIncentive.toLocaleString()}`}
            subtitle="Incentive Earned"
            gradient="emerald"
            icon="money"
            trend={trendDirection}
            trendValue={`${Math.abs(trendPercent)}%`}
          />
          <div className="glass-card p-6 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <svg className="w-16 h-16 text-amber-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
            </div>
            <p className="text-xs font-bold text-amber-800 dark:text-amber-200 uppercase tracking-widest mb-1">Best Month</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{bestMonth}</p>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mt-1">₹{bestMonthValue.toLocaleString()}</p>
          </div>
          <StatCard
            title="Approval Rate"
            value={`${approvalRate}%`}
            subtitle={`${approvedDeals.length}/${totalDeals} Deals`}
            gradient="blue"
            icon="check"
          />
          <StatCard
            title="Global Rank"
            value={`#${performanceData?.rank || "N/A"}`}
            subtitle={topLeader ? `Top: ${topLeader.name}` : "Loading..."}
            gradient="accent"
            icon="trophy"
          />
          <div className="h-full">
            <Link to="/sales/reports" className="h-full flex flex-col items-center justify-center p-4 bg-surface-2 border-2 border-dashed border-border-strong rounded-xl hover:bg-surface-3 transition-colors group cursor-pointer">
              <div className="p-3 bg-primary-100 text-primary-600 rounded-full group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </div>
              <span className="mt-2 font-semibold text-text-primary">Download Report</span>
            </Link>
          </div>
        </div>

        {/* 2. Main Goals & Tier Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Goal Tracker (Read Only) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Current Progress</h2>
              <Link to="/sales/targets" className="text-sm text-primary-600 hover:underline">View Details &rarr;</Link>
            </div>
            <GoalTracker readOnly={true} compact={false} />
          </div>

          {/* Tier Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Club Status</h2>
              <Link to="/sales/policy" className="text-sm text-primary-600 hover:underline">View Rules &rarr;</Link>
            </div>
            <div className="h-[200px]">
              <TierBadge totalIncentive={totalIncentive} rank={performanceData?.rank} />
            </div>
          </div>
        </div>

        {/* 3. Notifications & Activity Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notifications Preview */}
          <div className="card-modern p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Recent Alerts</h2>
              <Link to="/sales/notifications" className="text-sm text-primary-600 hover:underline">View All</Link>
            </div>
            {recentNotifications.length === 0 ? (
              <p className="text-text-muted text-sm">No recent alerts.</p>
            ) : (
              <div className="space-y-3">
                {recentNotifications.map(n => (
                  <div key={n.id} className="flex gap-3 items-start p-3 rounded-lg bg-surface-2">
                    <span className="text-lg">{n.type === 'DEAL_APPROVED' ? '✅' : n.type === 'DEAL_REJECTED' ? '❌' : 'ℹ️'}</span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{n.title}</p>
                      <p className="text-xs text-text-muted line-clamp-1">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Link to Analytics */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div>
              <h3 className="text-xl font-bold mb-2">Want deeper insights?</h3>
              <p className="text-gray-400 text-sm mb-4">Analyze your monthly trends, deal breakdown, and compare your performance with previous months.</p>
            </div>
            <Link to="/sales/performance" className="w-fit bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2">
              Open Performance Analytics &rarr;
            </Link>
          </div>
        </div>
      </div>
    </SalesLayout>
  );
};

export default SalesDashboard;
