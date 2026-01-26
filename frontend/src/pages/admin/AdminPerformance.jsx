import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import AdminLayout from "../../layouts/AdminLayout";

const AdminPerformance = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);

    // Table State
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch User Profile
                const userRes = await axios.get(`http://localhost:8080/api/users/${userId}`).catch(() => ({ data: { name: "Unknown User", email: "N/A" } }));
                setUserProfile(userRes.data);

                // Fetch Deals
                const dealsRes = await axios.get(`http://localhost:8080/deals?userId=${userId}`);
                // Sort deals by date desc
                const sortedDeals = dealsRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setDeals(sortedDeals);

                // Calculate Metrics locally if endpoint missing
                // (Fallback if /admin/performance/{id} doesn't exist or is robust enough)
                const approved = sortedDeals.filter(d => d.status === 'Approved');
                const totalRev = approved.reduce((acc, d) => acc + (d.amount || 0), 0);
                const totalInc = approved.reduce((acc, d) => acc + (d.incentive || 0), 0);
                const avgDeal = approved.length ? totalRev / approved.length : 0;

                // Group by month for chart
                const monthly = approved.reduce((acc, deal) => {
                    const month = deal.date ? deal.date.substring(0, 7) : 'Unknown';
                    if (!acc[month]) acc[month] = 0;
                    acc[month] += (deal.incentive || 0);
                    return acc;
                }, {});

                const chartData = Object.keys(monthly).sort().map(m => ({ month: m, incentiveSum: monthly[m] }));

                setData({
                    totalDeals: sortedDeals.length,
                    approvedDeals: approved.length,
                    totalIncentiveEarned: totalInc,
                    approvalRate: sortedDeals.length ? (approved.length / sortedDeals.length) * 100 : 0,
                    averageDealValue: avgDeal,
                    monthlyTrend: chartData
                });

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const {
        totalDeals = 0,
        approvedDeals = 0,
        approvalRate = 0,
        totalIncentiveEarned = 0,
        averageDealValue = 0,
        monthlyTrend = []
    } = data || {};

    // Tier Logic
    const getTier = (rev) => {
        if (rev >= 5000000) return { name: 'Diamond', color: 'from-cyan-400 to-blue-500' };
        if (rev >= 2500000) return { name: 'Platinum', color: 'from-slate-300 to-slate-500' };
        if (rev >= 1000000) return { name: 'Gold', color: 'from-yellow-400 to-amber-500' };
        return { name: 'Silver', color: 'from-slate-200 to-slate-400' };
    };

    // Calculate total revenue for tier
    const totalRevenue = deals.filter(d => d.status === 'Approved').reduce((acc, d) => acc + (d.amount || 0), 0);
    const tier = getTier(totalRevenue);

    // Filtered Table Data
    const filteredDeals = useMemo(() => {
        return deals.filter(deal => {
            const matchesSearch = (deal.status || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (deal.amount?.toString() || "").includes(searchTerm) ||
                (deal.clientName || "").toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "ALL" || (deal.status || "").toUpperCase() === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [deals, searchTerm, statusFilter]);

    // Chart Configs
    const lineChartData = {
        labels: monthlyTrend.map(t => t.month),
        datasets: [{
            label: 'Incentive Earned',
            data: monthlyTrend.map(t => t.incentiveSum),
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)'); // Emerald
                gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
                return gradient;
            },
            borderColor: '#10B981',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#10B981',
            pointRadius: 6,
            pointHoverRadius: 8
        }]
    };

    if (loading) return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center h-[80vh]">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                <p className="text-text-muted font-medium">Calibrating Sales Metrics...</p>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700 font-sans">

                {/* NAV HEADER */}
                <div className="mb-6 flex items-center gap-2">
                    <button onClick={() => navigate('/admin/performance')} className="text-sm font-bold text-text-muted hover:text-primary-600 transition-colors flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        LEADERBOARD
                    </button>
                    <span className="text-text-muted">/</span>
                    <span className="text-sm font-bold text-text-primary">ANALYTICS</span>
                </div>

                {/* HERO PROFILE SECTION */}
                <div className="bg-surface-1 rounded-3xl border border-border-subtle shadow-xl overflow-hidden mb-8 relative">
                    <div className="h-32 bg-slate-900 absolute top-0 w-full z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-indigo-900 opacity-90"></div>
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full"></div>
                    </div>

                    <div className="relative z-10 px-8 pt-16 pb-8 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
                        <div className="flex items-end gap-6">
                            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-2xl rotate-3">
                                <div className={`w-full h-full bg-gradient-to-br ${tier.color} rounded-xl flex items-center justify-center text-white text-4xl font-black shadow-inner`}>
                                    {userProfile?.name?.charAt(0) || "U"}
                                </div>
                            </div>
                            <div className="mb-1">
                                <h1 className="text-3xl font-black text-text-primary tracking-tight">{userProfile?.name || "Unknown User"}</h1>
                                <p className="text-text-muted font-medium flex items-center gap-2">
                                    {userProfile?.email}
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="text-emerald-600 font-bold text-xs uppercase bg-emerald-100 px-2 py-0.5 rounded-full">Top Performer</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="text-right p-4 bg-surface-2 rounded-2xl border border-border-subtle">
                                <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider mb-1">Total Revenue</p>
                                <p className="text-2xl font-black text-slate-800 dark:text-white">₹{(totalRevenue / 100000).toFixed(1)}L</p>
                            </div>
                            <div className="text-right p-4 bg-surface-2 rounded-2xl border border-border-subtle">
                                <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider mb-1">Current Tier</p>
                                <div className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${tier.color}`}>
                                    {tier.name}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* METRICS GRID */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="p-6 bg-surface-1 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Incentive Earned</p>
                        <p className="text-3xl font-black text-text-primary mt-1">₹{(totalIncentiveEarned / 1000).toFixed(1)}k</p>
                    </div>

                    <div className="p-6 bg-surface-1 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>
                        <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Close Rate</p>
                        <p className="text-3xl font-black text-text-primary mt-1">{approvalRate.toFixed(0)}%</p>
                    </div>

                    <div className="p-6 bg-surface-1 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            </div>
                        </div>
                        <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Avg Deal Size</p>
                        <p className="text-3xl font-black text-text-primary mt-1">₹{(averageDealValue / 1000).toFixed(0)}k</p>
                    </div>

                    <div className="p-6 bg-surface-1 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                        </div>
                        <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Volume (Closed)</p>
                        <p className="text-3xl font-black text-text-primary mt-1">{approvedDeals} <span className="text-sm font-medium text-text-muted">/ {totalDeals}</span></p>
                    </div>
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 p-6 bg-surface-1 rounded-3xl border border-border-subtle shadow-lg">
                        <h3 className="text-lg font-bold text-text-primary mb-6">Incentive Trajectory</h3>
                        <div className="h-64">
                            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: '#e2e8f030' } }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }} />
                        </div>
                    </div>
                    <div className="p-6 bg-surface-1 rounded-3xl border border-border-subtle shadow-lg flex flex-col justify-center">
                        <h3 className="text-lg font-bold text-text-primary mb-4 text-center">Deal Portfolio</h3>
                        <div className="h-48 relative">
                            <Doughnut data={{
                                labels: ['Approved', 'Pending', 'Rejected'],
                                datasets: [{
                                    data: [approvedDeals, totalDeals - approvedDeals - filteredDeals.filter(d => d.status === 'Rejected').length, filteredDeals.filter(d => d.status === 'Rejected').length],
                                    backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                                    borderWidth: 0,
                                    hoverOffset: 4
                                }]
                            }} options={{ maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, font: { size: 10, weight: 'bold' } } } } }} />

                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <span className="text-3xl font-black text-text-primary">{totalDeals}</span>
                                <span className="text-[10px] uppercase font-bold text-text-muted">Total Deals</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DATA TABLE */}
                <div className="bg-surface-1 rounded-3xl border border-border-subtle shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h3 className="text-lg font-bold text-text-primary">Deal History Log</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search client or amount..."
                                className="px-4 py-2 bg-surface-2 border border-border-subtle rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 w-64 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-surface-2/50 text-xs font-bold text-text-muted uppercase tracking-wider">
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Deal Value</th>
                                    <th className="px-6 py-4">Incentive</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {filteredDeals.length === 0 ? (
                                    <tr><td colSpan="6" className="p-8 text-center text-text-muted italic">No records match your filters.</td></tr>
                                ) : (
                                    filteredDeals.map((deal) => (
                                        <tr key={deal.id} className="hover:bg-surface-2 transition-colors group">
                                            <td className="px-6 py-4 text-sm font-medium text-text-secondary">{deal.date || "N/A"}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-text-primary">{deal.clientName || "Unnamed Client"}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-text-primary">₹{(deal.amount || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹{(deal.incentive || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${deal.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                        deal.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {deal.status || "PENDING"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-text-muted max-w-xs truncate">{deal.rejectionReason || "-"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminPerformance;
