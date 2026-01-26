import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import AdminLayout from "../../layouts/AdminLayout";

const AdminPerformance = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [debugLog, setDebugLog] = useState([]);

    // Filter State
    const [searchTerm, setSearchTerm] = useState("");

    const addLog = (msg) => setDebugLog(prev => [...prev, msg]);

    // --- Helper for Date Ranges ---
    const getLast6MonthsLabels = () => {
        const months = [];
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            // Format YYYY-MM
            const monthStr = d.toISOString().slice(0, 7);
            months.push(monthStr);
        }
        return months;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                addLog(`Starting fetch for userId: ${userId}`);

                // 1. Fetch User Profile (Strategy: Specific -> All -> Deal-embedded)
                let userObj = { name: "Loading...", email: "..." };
                try {
                    const uRes = await axios.get(`http://localhost:8080/api/users/${userId}`);
                    userObj = uRes.data;
                    addLog("User fetched via ID endpoint");
                } catch (e) {
                    addLog("User ID endpoint failed, trying list...");
                    try {
                        const allUsers = await axios.get("http://localhost:8080/api/users");
                        const found = allUsers.data.find(u => u.id == userId);
                        if (found) {
                            userObj = found;
                            addLog("User found in list");
                        }
                    } catch (e2) {
                        addLog("User list fetch failed");
                    }
                }
                setUserProfile(userObj);

                // 2. Fetch Deals
                let allDeals = [];
                try {
                    const dealsRes = await axios.get(`http://localhost:8080/deals?userId=${userId}`);
                    allDeals = dealsRes.data || [];
                    addLog(`Deals fetched via filter: ${allDeals.length}`);
                } catch (e) {
                    addLog("Deals filter endpoint failed, fetching all...");
                    const dealsRes = await axios.get(`http://localhost:8080/deals`);
                    allDeals = (dealsRes.data || []).filter(d => d.user?.id == userId || d.userId == userId || (d.user && d.user.id && d.user.id.toString() === userId.toString()));
                    addLog(`Deals filtered manually: ${allDeals.length}`);
                }

                // If user name still unknown, try to find in deals
                if ((!userObj.name || userObj.name === "Loading...") && allDeals.length > 0) {
                    const firstUserDeal = allDeals.find(d => d.user && d.user.name);
                    if (firstUserDeal) {
                        setUserProfile(prev => ({ ...prev, name: firstUserDeal.user.name, email: firstUserDeal.user.email || "" }));
                        addLog("User name recovered from deal data");
                    }
                }

                // Sort deals by date desc
                const sortedDeals = allDeals.sort((a, b) => {
                    const dateA = new Date(a.date || a.createdAt || 0);
                    const dateB = new Date(b.date || b.createdAt || 0);
                    return dateB - dateA;
                });
                setDeals(sortedDeals);

                // 3. Compute Metrics
                const approved = sortedDeals.filter(d => (d.status || "").toLowerCase() === 'approved');
                const totalRev = approved.reduce((acc, d) => acc + (parseFloat(d.amount) || 0), 0);
                const totalInc = approved.reduce((acc, d) => acc + (parseFloat(d.incentive) || 0), 0);
                const avgDeal = approved.length ? totalRev / approved.length : 0;

                // 4. Compute Monthly Trend
                const monthLabels = getLast6MonthsLabels();
                const trendMap = {};
                monthLabels.forEach(m => trendMap[m] = 0);

                approved.forEach(deal => {
                    // Try multiple date fields
                    const rawDate = deal.date || deal.createdAt; // e.g. "2023-10-25" or ISO
                    if (rawDate) {
                        try {
                            const d = new Date(rawDate);
                            if (!isNaN(d.getTime())) {
                                const yyyyMM = d.toISOString().slice(0, 7); // "2023-10"
                                if (trendMap.hasOwnProperty(yyyyMM)) {
                                    trendMap[yyyyMM] += (parseFloat(deal.incentive) || 0);
                                } else {
                                    // Handle dates outside 6-month window or slight format mismatch
                                    // addLog(`Date ${yyyyMM} outside range`);
                                }
                            }
                        } catch (e) {
                            addLog(`Date parse error: ${rawDate}`);
                        }
                    }
                });

                const chartData = monthLabels.map(m => ({ month: m, incentiveSum: trendMap[m] }));

                setData({
                    totalDeals: sortedDeals.length,
                    approvedDeals: approved.length,
                    totalIncentiveEarned: totalInc,
                    approvalRate: sortedDeals.length ? (approved.length / sortedDeals.length) * 100 : 0,
                    averageDealValue: avgDeal,
                    monthlyTrend: chartData
                });

            } catch (err) {
                console.error("Error fetching performance details:", err);
                addLog(`CRITICAL ERROR: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    // Tier Logic
    const getTier = (rev) => {
        if (rev >= 5000000) return { name: 'Diamond', color: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' };
        if (rev >= 2500000) return { name: 'Platinum', color: 'from-slate-300 to-slate-500', bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
        if (rev >= 1000000) return { name: 'Gold', color: 'from-yellow-400 to-amber-500', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' };
        return { name: 'Silver', color: 'from-slate-200 to-slate-400', bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' };
    };

    const {
        totalDeals = 0,
        approvedDeals = 0,
        approvalRate = 0,
        totalIncentiveEarned = 0,
        averageDealValue = 0,
        monthlyTrend = []
    } = data || {};

    const totalRevenue = deals
        .filter(d => (d.status || "").toLowerCase() === 'approved')
        .reduce((acc, d) => acc + (parseFloat(d.amount) || 0), 0);

    const tier = getTier(totalRevenue);

    // Filtered Table
    const filteredDeals = useMemo(() => {
        return deals.filter(deal => {
            const searchLower = searchTerm.toLowerCase();
            const dealDate = deal.date || deal.createdAt || "";
            return (
                (deal.clientName || "").toLowerCase().includes(searchLower) ||
                (deal.status || "").toLowerCase().includes(searchLower) ||
                (deal.amount?.toString() || "").includes(searchLower) ||
                dealDate.toLowerCase().includes(searchLower)
            );
        });
    }, [deals, searchTerm]);

    // Chart Config
    const lineChartData = {
        labels: monthlyTrend.map(t => {
            const [y, m] = t.month.split('-');
            const date = new Date(parseInt(y), parseInt(m) - 1);
            return date.toLocaleString('default', { month: 'short' });
        }),
        datasets: [{
            label: 'Incentive',
            data: monthlyTrend.map(t => t.incentiveSum),
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(79, 70, 229, 0.4)'); // Indigo
                gradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)');
                return gradient;
            },
            borderColor: '#4F46E5', // Indigo 600
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#4F46E5',
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    };

    const doughnutData = {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [{
            data: [
                approvedDeals,
                totalDeals - approvedDeals - deals.filter(d => (d.status || "").toLowerCase() === 'rejected').length,
                deals.filter(d => (d.status || "").toLowerCase() === 'rejected').length
            ],
            backgroundColor: ['#10B981', '#F59E0B', '#EF4444'], // Emerald, Amber, Red
            borderWidth: 0,
            hoverOffset: 10
        }]
    };

    if (loading) return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center h-[80vh]">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-bold tracking-wide animate-pulse">ANALYZING PERFORMANCE DATA...</p>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700 font-sans">

                {/* NAV */}
                <div className="mb-8 flex items-center justify-between">
                    <button onClick={() => navigate('/admin/performance')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-indigo-200 group-hover:bg-indigo-50">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </div>
                        <span className="font-bold text-sm uppercase tracking-wide">Back to Roster</span>
                    </button>
                    {/* <div className="text-[10px] text-slate-300 font-mono">ID: {userId}</div> */}
                </div>

                {/* HERO CARD */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden mb-8 relative group">
                    <div className="absolute top-0 w-full h-32 bg-slate-900 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 opacity-90"></div>
                        <div className="absolute -right-10 -top-10 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl"></div>
                        <div className="absolute left-10 top-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>
                    </div>

                    <div className="relative px-8 pt-16 pb-8 flex flex-col md:flex-row items-end justify-between gap-6">
                        <div className="flex items-end gap-6">
                            <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-2xl relative mb-2">
                                <div className={`w-full h-full bg-gradient-to-br ${tier.color} rounded-2xl flex items-center justify-center text-white text-5xl font-black shadow-inner`}>
                                    {userProfile?.name ? userProfile.name.charAt(0) : "?"}
                                </div>
                                <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center border-2 border-slate-50" title={`Tier: ${tier.name}`}>
                                    {tier.name === 'Diamond' && '💎'}
                                    {tier.name === 'Platinum' && '🏆'}
                                    {tier.name === 'Gold' && '🥇'}
                                    {tier.name === 'Silver' && '🥈'}
                                    {tier.name === 'Bronze' && '🥉'}
                                </div>
                            </div>
                            <div className="mb-2">
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
                                    {userProfile?.name || "Unknown Associate"}
                                </h1>
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 flex items-center gap-2 border border-slate-200">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        {userProfile?.email || "No Email"}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${tier.bg} ${tier.text} ${tier.border}`}>
                                        {tier.name} Tier
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Lifetime Revenue</p>
                                <p className="text-4xl font-black text-slate-800">
                                    <span className="text-lg text-slate-400 font-bold mr-1">₹</span>
                                    {(totalRevenue / 100000).toFixed(2)}
                                    <span className="text-lg text-slate-400 font-bold ml-1">L</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded-md tracking-wider">Earned</span>
                        </div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total Incentive</p>
                        <p className="text-3xl font-black text-slate-900 mt-1">₹{(totalIncentiveEarned / 1000).toFixed(1)}k</p>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded-md tracking-wider">Efficiency</span>
                        </div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Conversion Rate</p>
                        <p className="text-3xl font-black text-slate-900 mt-1">{approvalRate.toFixed(0)}%</p>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-100 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            </div>
                            <span className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold uppercase rounded-md tracking-wider">Quality</span>
                        </div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Avg Deal Size</p>
                        <p className="text-3xl font-black text-slate-900 mt-1">₹{(averageDealValue / 1000).toFixed(0)}k</p>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-100 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                            </div>
                            <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase rounded-md tracking-wider">Volume</span>
                        </div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Deals Closed</p>
                        <p className="text-3xl font-black text-slate-900 mt-1">{approvedDeals} <span className="text-xs text-slate-400 font-bold">/ {totalDeals}</span></p>
                    </div>
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 p-8 bg-white rounded-[2rem] border border-slate-200 shadow-xl">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Earnings Velocity</h3>
                                <p className="text-sm text-slate-500 font-medium">6-month incentive performance trend</p>
                            </div>
                            <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
                                Live Data
                            </div>
                        </div>
                        <div className="h-72 w-full">
                            <Line
                                data={lineChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { weight: 'bold', size: 10 }, color: '#94a3b8' } },
                                        x: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 11 }, color: '#64748b' } }
                                    },
                                    plugins: { legend: { display: false } }
                                }}
                            />
                        </div>
                    </div>

                    <div className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-xl flex flex-col items-center">
                        <h3 className="text-lg font-black text-slate-900 mb-2">Deal Composition</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-6">Status Breakdown</p>

                        <div className="h-56 w-56 relative flex items-center justify-center mb-6">
                            <Doughnut
                                data={doughnutData}
                                options={{
                                    maintainAspectRatio: false,
                                    cutout: '80%',
                                    plugins: { legend: { display: false } }
                                }}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black text-slate-900">{totalDeals}</span>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Total Deals</span>
                            </div>
                        </div>

                        <div className="w-full space-y-2">
                            <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50/50">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span className="text-xs font-bold text-slate-700">Approved</span>
                                </div>
                                <span className="text-xs font-black text-emerald-700">{approvedDeals}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50/50">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    <span className="text-xs font-bold text-slate-700">Pending</span>
                                </div>
                                <span className="text-xs font-black text-amber-700">{totalDeals - approvedDeals - deals.filter(d => (d.status || "").toLowerCase() === 'rejected').length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LOGS */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Transaction Ledger</h3>
                            <p className="text-sm text-slate-500 font-medium">Detailed log of all assigned deals</p>
                        </div>
                        <input
                            type="text"
                            placeholder="Search ledger..."
                            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 transition-all placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Incentive</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredDeals.length === 0 ? (
                                    <tr><td colSpan="6" className="p-10 text-center text-slate-400 font-bold italic">No entries found</td></tr>
                                ) : (
                                    filteredDeals.map((deal) => (
                                        <tr key={deal.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-xs font-bold text-slate-500 font-mono">
                                                {deal.date ? new Date(deal.date).toLocaleDateString() : (deal.createdAt ? new Date(deal.createdAt).toLocaleDateString() : "N/A")}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-900">{deal.clientName || "Unknown Client"}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-600 font-mono">₹{(parseFloat(deal.amount) || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-emerald-600 font-mono">₹{(parseFloat(deal.incentive) || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${(deal.status || "").toLowerCase() === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                        (deal.status || "").toLowerCase() === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {(deal.status || "PENDING").toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-400 max-w-xs truncate">{deal.rejectionReason || "-"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* DEBUG SECTION (Uncomment if needed) */}
                {/* <div className="mt-8 p-4 bg-gray-100 rounded-xl text-xs font-mono text-gray-600">
                    <p className="font-bold mb-2">DEBUG INFO:</p>
                    {debugLog.map((log, i) => <div key={i}>{log}</div>)}
                </div> */}
            </div>
        </AdminLayout>
    );
};

export default AdminPerformance;
