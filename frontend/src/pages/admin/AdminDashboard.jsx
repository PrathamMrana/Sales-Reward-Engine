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
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    // Separate fetch for audit logs to not block initial render if it's slow
    const fetchAuditLogs = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/audit-logs");
        if (Array.isArray(res.data)) {
          setAuditLogs(res.data);
        } else {
          setAuditLogs([]);
        }
      } catch (err) {
        console.error("Failed to fetch audit logs", err);
        setAuditLogs([]);
      }
    };
    fetchAuditLogs();
  }, []);

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
  const pendingDeals = deals.filter(d => (d.status || "").toLowerCase() === "submitted");
  const totalValue = deals.reduce((acc, d) => acc + (d.amount || 0), 0);
  const totalIncentive = deals.filter(d => (d.status || "").toLowerCase() === "approved").reduce((acc, d) => acc + (d.incentive || 0), 0);

  // Active Users (Sales Execs with at least one deal)
  const uniqueUsers = new Set(deals.map(d => d.user?.id).filter(Boolean));
  const activeSalesCount = uniqueUsers.size;

  // --- 2. Deal Status Breakdown (Chart) ---
  const statusCounts = deals.reduce((acc, d) => {
    const status = d.status || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  const statusData = [
    { name: "Approved", value: statusCounts["Approved"] || 0, color: "#10B981" },
    { name: "Submitted", value: statusCounts["Submitted"] || 0, color: "#F59E0B" },
    { name: "Rejected", value: statusCounts["Rejected"] || 0, color: "#EF4444" },
    { name: "Draft", value: statusCounts["Draft"] || 0, color: "#9CA3AF" }
  ].filter(d => d.value > 0);

  // --- 3. Financial Overview (Current Month) ---
  const now = new Date();
  const currentMonthDeals = deals.filter(d => {
    if (!d.createdAt && !d.date) return false;
    const dDate = new Date(d.createdAt || d.date);
    return !isNaN(dDate.getTime()) && dDate.getMonth() === now.getMonth() && dDate.getFullYear() === now.getFullYear();
  });
  const currentMonthPayout = currentMonthDeals
    .filter(d => (d.status || "").toLowerCase() === "approved")
    .reduce((acc, d) => acc + (d.incentive || 0), 0);

  // --- 4. Sales Executive Performance ---
  const userPerformance = {};
  deals.forEach(d => {
    if (!d.user || !d.user.name || d.user.name === "Unknown") return;
    const uName = d.user.name;
    if (!userPerformance[uName]) userPerformance[uName] = { name: uName, deals: 0, incentive: 0 };
    userPerformance[uName].deals += 1;
    if ((d.status || "").toLowerCase() === "approved") userPerformance[uName].incentive += (d.incentive || 0);
  });
  const sortedUsers = Object.values(userPerformance).sort((a, b) => b.incentive - a.incentive);
  const topPerformers = sortedUsers.slice(0, 3);
  const underPerformers = sortedUsers.filter(u => u.deals < 6);

  // --- 5. Recent Activity Feed (Merged Deals + Audit Logs) ---




  const safeDeals = Array.isArray(deals) ? deals : [];
  const safeAuditLogs = Array.isArray(auditLogs) ? auditLogs : [];

  const recentActivity = [
    // 1. Deal Creation Events (from Deals)
    ...safeDeals.map(d => ({
      id: "D" + (d.id || Math.random()),
      type: "DEAL_CREATE",
      title: "New Deal Created",
      desc: `${d.user?.name || "Unknown"} submitted a deal worth ₹${(d.amount || 0).toLocaleString('en-IN')}`,
      time: d.createdAt ? new Date(d.createdAt) : (d.date ? new Date(d.date) : new Date()),
      status: d.status || "Draft",
      user: d.user || { name: "Unknown" },
      amount: d.amount || 0
    })),
    // 2. Audit Log Events (Approvals, Rejections, Updates)
    ...safeAuditLogs.map(log => ({
      id: "AL" + (log.id || Math.random()),
      type: "AUDIT",
      title: log.action ? log.action.replace(/_/g, ' ') : "System Action",
      desc: log.details || "No details available",
      time: log.timestamp ? new Date(log.timestamp) : new Date(),
      status: log.action === 'UPDATE_STATUS' && (log.details || "").includes('Approved') ? 'Approved'
        : log.action === 'UPDATE_STATUS' && (log.details || "").includes('Rejected') ? 'Rejected'
          : 'Updated',
      user: { name: log.email || "Admin" },
      amount: 0 // Audit logs might not have amount directly, prevents crash if accessing item.amount
    }))
  ]
    .filter(item => item.time && !isNaN(item.time.getTime())) // Filter out invalid dates
    .sort((a, b) => b.time - a.time)
    .slice(0, 10); // increased to 10 for better visibility

  return (
    <SalesLayout>
      <div className="space-y-8">

        {/* HEADER & PENDING ACTIONS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="section-title">Admin Dashboard</h1>
            <p className="text-text-secondary text-sm mt-1">System Overview & Controls</p>
          </div>

          {/* 1. Pending Actions & Risk Alerts */}
          <div className="flex flex-col gap-4 w-full md:w-auto">
            {/* High Risk Alert is specific red, keeping as is but ensuring dark mode text contrast */}
            {pendingDeals.filter(d => d.riskLevel === 'HIGH' || (d.amount > 50000 && d.status === 'Submitted')).length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm flex justify-between items-center animate-pulse">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <div>
                    <h3 className="text-red-800 dark:text-red-200 font-bold">Needs Attention: High Value Deals</h3>
                    <p className="text-red-700 dark:text-red-300 text-sm">You have pending deals flagged as High Risk.</p>
                  </div>
                </div>
                <Link to="/admin/approvals" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm ml-4">
                  Review
                </Link>
              </div>
            )}

            {/* General Pending & Quick Actions */}
            {pendingDeals.length > 0 ? (
              <div className="flex flex-col md:flex-row gap-4">
                <Link to="/admin/approvals" className="group flex-1">
                  <div className="glass-card px-6 py-4 flex items-center justify-between h-full">
                    <div className="flex items-center space-x-4">
                      {/* Orange icon styles remain specific as they are alerts */}
                      <div className="relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded-full text-orange-600 dark:text-orange-400 relative z-10">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-orange-800 dark:text-orange-200 group-hover:text-orange-900 dark:group-hover:text-orange-100">{pendingDeals.length} Pending Approval{pendingDeals.length !== 1 && 's'}</p>
                        <p className="text-xs text-orange-600 dark:text-orange-400">Action Required</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="glass-card px-6 py-3 flex items-center space-x-3 !bg-emerald-50/50 dark:!bg-emerald-900/10 !border-emerald-200 dark:!border-emerald-800">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">All caught up! No pending approvals.</span>
              </div>
            )}
          </div>
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
          <div className="glass-card p-6 lg:col-span-1">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center">
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
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Leaderboard & Underperformers */}
          <div className="glass-card p-6 lg:col-span-1 flex flex-col">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              Top Performers
            </h3>
            <div className="flex-1 space-y-4">
              {topPerformers.map((user, idx) => (
                <div key={user.name} className="flex items-center justify-between p-3 bg-surface-2 border border-border-subtle rounded-lg transition-colors hover:bg-surface-3 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-gray-200 text-gray-700' : 'bg-orange-100 text-orange-800'}`}>
                      {idx + 1}
                    </span>
                    <span className="font-medium text-text-primary">{user.name}</span>
                  </div>
                  <span className="font-bold text-text-primary">₹{user.incentive.toLocaleString()}</span>
                </div>
              ))}
              {topPerformers.length === 0 && <p className="text-sm text-text-muted italic">No performance data yet.</p>}
            </div>

            {underPerformers.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border-subtle">
                <h4 className="text-xs font-semibold text-red-500 uppercase tracking-widest mb-2">Needs Attention</h4>
                <div className="flex flex-wrap gap-2">
                  {underPerformers.slice(0, 3).map(u => (
                    <span key={u.name} className="px-2 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded text-xs border border-red-100 dark:border-red-900/50">
                      {u.name} ({u.deals} deals)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. Recent Activity Feed */}
          <div className="glass-card p-6 lg:col-span-1">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Recent Activity
            </h3>
            <div className="space-y-0 relative max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-700"></div>
              {recentActivity.map((item, idx) => {
                const isAudit = item.type === 'AUDIT';
                const isCreate = item.type === 'DEAL_CREATE';

                let iconColor = "bg-gray-300 ring-gray-100 dark:ring-gray-700";
                if (item.status === 'Approved' || item.title.includes('APPROVE')) iconColor = "bg-green-500 ring-green-100 dark:ring-green-900";
                else if (item.status === 'Rejected' || item.title.includes('REJECT')) iconColor = "bg-red-500 ring-red-100 dark:ring-red-900";
                else if (item.status === 'Submitted' || isCreate) iconColor = "bg-blue-500 ring-blue-100 dark:ring-blue-900";
                else if (item.title.includes('UPDATE')) iconColor = "bg-orange-400 ring-orange-100 dark:ring-orange-900";

                return (
                  <div key={item.id + idx} className="relative pl-8 py-3 group">
                    <div className={`absolute left-[0.35rem] top-4 w-3 h-3 rounded-full border-2 border-white dark:border-surface-1 ring-2 ${iconColor}`}></div>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 mr-4">
                        <p className="text-sm font-medium text-text-primary group-hover:text-primary-500 transition-colors capitalize">
                          {item.title.toLowerCase()}
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5 break-words">
                          {isAudit ? item.desc : item.desc}
                        </p>
                      </div>
                      <span className="text-[10px] whitespace-nowrap text-text-muted bg-surface-2 px-1.5 py-0.5 rounded border border-border-subtle">
                        {item.time.toLocaleDateString() === new Date().toLocaleDateString()
                          ? item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : item.time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              {recentActivity.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No recent activity.</p>}
            </div>
          </div>
        </div>

        {/* 6. Policy Status Card */}
        <div className="rounded-xl p-6 text-white shadow-lg relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-12 -mt-12 pointer-events-none blur-3xl"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold mb-1">Active Incentive Policies</h3>
              <p className="text-blue-100 text-sm">You have {policies.length} active policies currently running.</p>
            </div>
            <Link to="/admin/simulation" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/30">
              Simulate Policy Changes →
            </Link>
          </div>
        </div>

      </div>
    </SalesLayout>
  );
};

export default AdminDashboard;
