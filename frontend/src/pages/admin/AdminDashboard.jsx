import SalesLayout from "../../layouts/SalesLayout";
import StatCard from "../../components/common/StatCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AdminDashboard = () => {
  const [deals, setDeals] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dealsRes, policiesRes] = await Promise.all([
        axios.get("http://localhost:8080/deals"),
        axios.get("http://localhost:8080/api/policy")
      ]);
      setDeals(dealsRes.data);
      setPolicies(policiesRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
      setLoading(false);
    }
  };

  if (loading) return <SalesLayout>Loading Dashboard...</SalesLayout>;

  // --- 1. Pending Actions & Core Stats ---
  const pendingDeals = deals.filter(d => d.status === "Submitted");
  const totalValue = deals.reduce((acc, d) => acc + (d.amount || 0), 0);
  const totalIncentive = deals.filter(d => d.status === "Approved").reduce((acc, d) => acc + (d.incentive || 0), 0);

  // Active Users (Sales Execs with at least one deal)
  const uniqueUsers = new Set(deals.map(d => d.user?.id).filter(Boolean));
  const activeSalesCount = uniqueUsers.size;

  // --- 2. Deal Status Breakdown (Chart) ---
  const statusCounts = deals.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = [
    { name: "Approved", value: statusCounts["Approved"] || 0, color: "#10B981" },
    { name: "Submitted", value: statusCounts["Submitted"] || 0, color: "#F59E0B" }, // Orange for Pending
    { name: "Rejected", value: statusCounts["Rejected"] || 0, color: "#EF4444" },
    { name: "Draft", value: statusCounts["Draft"] || 0, color: "#9CA3AF" }
  ].filter(d => d.value > 0);

  // --- 3. Financial Overview (Current Month) ---
  const now = new Date();
  const currentMonthDeals = deals.filter(d => {
    const dDate = new Date(d.createdAt || d.date);
    return dDate.getMonth() === now.getMonth() && dDate.getFullYear() === now.getFullYear();
  });
  const currentMonthPayout = currentMonthDeals
    .filter(d => d.status === "Approved")
    .reduce((acc, d) => acc + (d.incentive || 0), 0);

  // --- 4. Sales Executive Performance ---
  const userPerformance = {};
  deals.forEach(d => {
    const uName = d.user?.name || "Unknown";
    if (!userPerformance[uName]) userPerformance[uName] = { name: uName, deals: 0, incentive: 0 };
    userPerformance[uName].deals += 1;
    if (d.status === "Approved") userPerformance[uName].incentive += d.incentive;
  });
  const sortedUsers = Object.values(userPerformance).sort((a, b) => b.incentive - a.incentive);
  const topPerformers = sortedUsers.slice(0, 3);
  const underPerformers = sortedUsers.filter(u => u.deals < 2); // Arbitrary threshold for "Low Activity"

  // --- 5. Recent Activity Feed ---
  const activityFeed = [...deals].map(d => ({
    type: "DEAL",
    title: `Deal ${d.status}`,
    desc: `${d.user?.name} - ₹${d.amount}`,
    time: new Date(d.createdAt || d.date),
    id: "D" + d.id
  })).concat(policies.map(p => ({
    type: "POLICY",
    title: "Policy Active",
    desc: p.title,
    time: new Date(), // Policies don't have timestamps yet, putting 'now' or ignoring sort? 
    // Actually, let's just show them at the bottom if no date, or top if we want to highlight.
    // For MVP let's assume policies are "Static" reference, or just show deals in feed.
    id: "P" + p.id
  })));

  // Filter only meaningful activity (Deals) for the feed to be accurate primarily
  const recentActivity = [...deals]
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 5);

  return (
    <SalesLayout>
      <div className="space-y-8">

        {/* HEADER & PENDING ACTIONS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="section-title">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">System Overview & Controls</p>
          </div>

          {/* 1. Pending Actions Panel */}
          {pendingDeals.length > 0 ? (
            <Link to="/admin/approvals" className="group">
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-6 py-3 flex items-center space-x-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <div className="bg-orange-100 p-2 rounded-full text-orange-600 relative z-10">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-orange-800 group-hover:text-orange-900">{pendingDeals.length} Pending Approval{pendingDeals.length !== 1 && 's'}</p>
                  <p className="text-xs text-orange-600">Action Required</p>
                </div>
                <svg className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </Link>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-3 flex items-center space-x-3 opacity-80">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="text-sm font-medium text-green-800">All caught up! No pending approvals.</span>
            </div>
          )}
        </div>

        {/* 2. KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Deals" value={deals.length} gradient="primary" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
          <StatCard title="Total Payout" value={`₹${totalIncentive.toLocaleString()}`} gradient="emerald" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          <StatCard title="Month Payout" value={`₹${currentMonthPayout.toLocaleString()}`} gradient="accent" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
          <StatCard title="Active Sales" value={activeSalesCount} gradient="blue" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 3. Deal Status Breakdown (Pie Chart) */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 lg:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
              Deal Status
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ value }) => value}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Leaderboard & Underperformers */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 lg:col-span-1 flex flex-col">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              Top Performers (Incentive)
            </h3>
            <div className="flex-1 space-y-4">
              {topPerformers.map((user, idx) => (
                <div key={user.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-gray-200 text-gray-700' : 'bg-orange-100 text-orange-800'}`}>
                      {idx + 1}
                    </span>
                    <span className="font-medium text-gray-700">{user.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">₹{user.incentive.toLocaleString()}</span>
                </div>
              ))}
              {topPerformers.length === 0 && <p className="text-sm text-gray-400 italic">No performance data yet.</p>}
            </div>

            {underPerformers.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-red-500 uppercase tracking-widest mb-2">Needs Attention</h4>
                <div className="flex flex-wrap gap-2">
                  {underPerformers.slice(0, 3).map(u => (
                    <span key={u.name} className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs border border-red-100">
                      {u.name} ({u.deals} deals)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. Recent Activity Feed */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 lg:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Recent Activity
            </h3>
            <div className="space-y-0 relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100"></div>
              {recentActivity.map((item, idx) => (
                <div key={item.id + idx} className="relative pl-8 py-3 group">
                  <div className={`absolute left-[0.35rem] top-4 w-3 h-3 rounded-full border-2 border-white ring-2 ${item.status === 'Submitted' ? 'bg-orange-400 ring-orange-100' : item.status === 'Approved' ? 'bg-green-500 ring-green-100' : 'bg-gray-300 ring-gray-100'}`}></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Deal {item.status}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.user?.name || "User"} • ₹{item.amount}
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                      {new Date(item.createdAt || item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No recent activity.</p>}
            </div>
          </div>
        </div>

        {/* 6. Policy Status Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-12 -mt-12 pointer-events-none"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold mb-1">Active Incentive Policies</h3>
              <p className="text-blue-100 text-sm">You have {policies.length} active policies currently running.</p>
            </div>
            <Link to="/sales/policy" className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
              Manage Policies →
            </Link>
          </div>
        </div>

      </div>
    </SalesLayout>
  );
};

export default AdminDashboard;
