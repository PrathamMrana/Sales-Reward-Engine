import SalesLayout from "../../layouts/SalesLayout";
import StatCard from "../../components/common/StatCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AdminDashboard = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:8080/deals");
                setDeals(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch admin data", err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <SalesLayout><div className="p-8 text-center">Loading Dashboard...</div></SalesLayout>;

    // --- 1. Key Metrics ---
    const pendingDeals = deals.filter(d => (d.status || "").toLowerCase() === "submitted");
    const approvedDeals = deals.filter(d => (d.status || "").toLowerCase() === "approved");
    const totalPayout = approvedDeals.reduce((acc, d) => acc + (d.incentive || 0), 0);
    const activeUsers = new Set(deals.map(d => d.user?.id).filter(Boolean)).size;

    // --- 2. Charts Data ---
    const statusCounts = deals.reduce((acc, d) => {
        const status = d.status || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    const statusData = [
        { name: "Approved", value: statusCounts["Approved"] || 0, color: "#10B981" },
        { name: "Submitted", value: statusCounts["Submitted"] || 0, color: "#F59E0B" },
        { name: "Rejected", value: statusCounts["Rejected"] || 0, color: "#EF4444" },
    ].filter(d => d.value > 0);

    // --- 3. Top Performers (Preview) ---
    const userStats = {};
    approvedDeals.forEach(d => {
        if (!d.user) return;
        if (!userStats[d.user.id]) userStats[d.user.id] = { name: d.user.name, incentive: 0 };
        userStats[d.user.id].incentive += (d.incentive || 0);
    });
    const topPerformers = Object.values(userStats).sort((a, b) => b.incentive - a.incentive).slice(0, 3);

    return (
        <SalesLayout>
            <div className="space-y-8 animate-in fade-in duration-500">

                {/* HERO SECTION */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold">Admin Overview</h1>
                        <p className="text-gray-400 mt-1">System Health & Pending Actions</p>
                    </div>
                    <div className="relative z-10 text-right hidden md:block">
                        <p className="text-xs uppercase tracking-widest text-gray-500">Total Disbursed</p>
                        <p className="text-3xl font-bold text-emerald-400">₹{totalPayout.toLocaleString()}</p>
                    </div>
                </div>

                {/* ALERT SECTION (Only if needed) */}
                {pendingDeals.length > 0 && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 rounded-r-lg flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-full text-orange-600 dark:text-orange-200">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-orange-900 dark:text-orange-100">Pending Approvals</h3>
                                <p className="text-sm text-orange-800 dark:text-orange-200">You have {pendingDeals.length} deals waiting for review.</p>
                            </div>
                        </div>
                        <Link to="/admin/approvals" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow">
                            Review Now
                        </Link>
                    </div>
                )}

                {/* QUICK ACTIONS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/admin/users" className="card-modern p-4 hover:bg-surface-2 transition-colors flex flex-col items-center justify-center gap-2 group text-center">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <span className="font-bold text-sm text-text-primary">Manage Users</span>
                    </Link>
                    <Link to="/admin/simulation" className="card-modern p-4 hover:bg-surface-2 transition-colors flex flex-col items-center justify-center gap-2 group text-center">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-full group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                        <span className="font-bold text-sm text-text-primary">Policy Sim</span>
                    </Link>
                    <Link to="/admin/audit-logs" className="card-modern p-4 hover:bg-surface-2 transition-colors flex flex-col items-center justify-center gap-2 group text-center">
                        <div className="p-3 bg-gray-100 text-gray-600 rounded-full group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        </div>
                        <span className="font-bold text-sm text-text-primary">Audit Logs</span>
                    </Link>
                    <Link to="/admin/performance" className="card-modern p-4 hover:bg-surface-2 transition-colors flex flex-col items-center justify-center gap-2 group text-center">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <span className="font-bold text-sm text-text-primary">Performance</span>
                    </Link>
                </div>

                {/* METRICS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Total Deals" value={deals.length} gradient="primary" />
                    <StatCard title="Pending Approvals" value={pendingDeals.length} gradient={pendingDeals.length > 0 ? "accent" : "primary"} />
                    <StatCard title="Active Users" value={activeUsers} gradient="blue" />
                    <StatCard title="Avg Payout" value={`₹${approvedDeals.length ? Math.round(totalPayout / approvedDeals.length).toLocaleString() : 0}`} gradient="emerald" />
                </div>

                {/* INSIGHTS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Status Chart */}
                    <div className="card-modern p-6 lg:col-span-1">
                        <h3 className="font-bold text-text-primary mb-4">Deal Status</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
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

                    {/* Top Performers */}
                    <div className="card-modern p-6 lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-text-primary">Top Performers</h3>
                            <Link to="/admin/performance" className="text-sm text-primary-600 hover:underline">View All</Link>
                        </div>
                        <div className="space-y-3">
                            {topPerformers.map((user, idx) => (
                                <div key={user.name} className="flex items-center justify-between p-4 bg-surface-2 rounded-xl border border-border-subtle hover:scale-[1.01] transition-transform">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${idx === 0 ? "bg-yellow-500" : idx === 1 ? "bg-gray-400" : "bg-orange-500"}`}>
                                            {idx + 1}
                                        </div>
                                        <span className="font-semibold text-text-primary">{user.name}</span>
                                    </div>
                                    <span className="font-bold text-emerald-600">₹{user.incentive.toLocaleString()}</span>
                                </div>
                            ))}
                            {topPerformers.length === 0 && <p className="text-text-muted">No data available.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </SalesLayout>
    );
};

export default AdminDashboard;
