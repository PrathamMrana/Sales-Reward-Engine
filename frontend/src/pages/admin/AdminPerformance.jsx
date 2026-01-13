import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import SalesLayout from '../../layouts/SalesLayout';

const AdminPerformance = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Table State
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch performance summary
                const perfRes = await axios.get(`http://localhost:8080/admin/performance/${userId}`);
                setData(perfRes.data);

                // Fetch raw deals for details
                const dealsRes = await axios.get(`http://localhost:8080/deals?userId=${userId}`);
                // Sort deals by date desc
                const sortedDeals = dealsRes.data.sort((a, b) => {
                    const dateA = a.date ? new Date(a.date) : new Date(0);
                    const dateB = b.date ? new Date(b.date) : new Date(0);
                    return dateB - dateA;
                });
                setDeals(sortedDeals);
            } catch (err) {
                console.error(err);
                setError('Failed to load performance data. Ensure backend endpoint exists.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    // --- Derived Metrics & Logic ---
    const {
        totalDeals = 0,
        approvedDeals = 0,
        rejectedDeals = 0,
        approvalRate = 0,
        totalIncentiveEarned = 0,
        averageDealValue = 0,
        consistencyScore = 0,
        monthlyTrend = []
    } = data || {};

    const maxDealValue = deals.length > 0 ? Math.max(...deals.map(d => d.amount)) : 0;

    // Performance Tier Logic
    const getTier = (incentive) => {
        if (incentive >= 100000) return { name: 'Platinum', color: 'bg-purple-100 text-purple-700 border-purple-200' };
        if (incentive >= 50000) return { name: 'Gold', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
        if (incentive >= 10000) return { name: 'Silver', color: 'bg-gray-100 text-gray-700 border-gray-200' };
        return { name: 'Bronze', color: 'bg-orange-100 text-orange-700 border-orange-200' };
    };
    const currentTier = getTier(totalIncentiveEarned);

    // Filtered Table Data
    const filteredDeals = useMemo(() => {
        return deals.filter(deal => {
            const matchesSearch = (deal.status || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (deal.amount?.toString() || "").includes(searchTerm) ||
                (deal.date || "").includes(searchTerm);

            const matchesStatus = statusFilter === "ALL" || (deal.status || "").toUpperCase() === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [deals, searchTerm, statusFilter]);

    // Chart Data: Line Trend
    const processedTrend = useMemo(() => {
        if (!monthlyTrend || monthlyTrend.length === 0) return [];

        let data = [...monthlyTrend];

        // If only one data point, prepend a "start point" from the previous month with 0 value
        // to make it look like a growth curve instead of a single dot.
        if (data.length === 1) {
            const current = data[0];
            let prevLabel = "Start";

            // Try to deduce previous month name/label
            try {
                // If structure is { month: "2023-10" } or similar
                if (typeof current.month === 'string' && current.month.includes('-')) {
                    const [y, m] = current.month.split('-');
                    const date = new Date(parseInt(y), parseInt(m) - 1 - 1); // Previous month
                    prevLabel = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                }
                // If structure is { month: { year: 2023, monthValue: 10 } }
                else if (current.month && typeof current.month === 'object' && current.month.year) {
                    const date = new Date(current.month.year, current.month.monthValue - 1 - 1);
                    prevLabel = `${date.getFullYear()}-${date.getMonth() + 1}`;
                }
            } catch (e) {
                // Fallback if date parsing fails
                prevLabel = "Start";
            }

            data = [
                { month: prevLabel, incentiveSum: 0 },
                ...data
            ];
        }
        return data;
    }, [monthlyTrend]);

    const lineChartData = {
        labels: processedTrend.map(t => {
            if (typeof t.month === 'string') return t.month;
            if (Array.isArray(t.month)) return `${t.month[0]}-${t.month[1]}`;
            if (t.month && t.month.year) return `${t.month.year}-${t.month.monthValue}`;
            return t.month || "";
        }),
        datasets: [
            {
                label: 'Incentive Earned (Approved)',
                data: processedTrend.map(t => t.incentiveSum),
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.2)'); // Blue 600 at top
                    gradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)'); // Transparent at bottom
                    return gradient;
                },
                borderColor: '#2563EB',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#2563EB',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            },
        ],
    };

    // Chart Data: Status Distribution
    const statusCounts = deals.reduce((acc, deal) => {
        const status = (deal.status || "Unknown").toUpperCase();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const doughnutData = {
        labels: Object.keys(statusCounts),
        datasets: [{
            data: Object.values(statusCounts),
            backgroundColor: [
                '#10B981', // green for approved usually
                '#EF4444', // red for rejected
                '#F59E0B', // yellow
                '#6B7280'  // gray
            ],
            borderWidth: 0
        }]
    };

    if (loading) return <SalesLayout><div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div></SalesLayout>;
    if (error) return <SalesLayout><div className="p-8 text-red-500 bg-red-50 rounded-lg m-4">{error}</div></SalesLayout>;
    if (!data) return <SalesLayout><div className="p-8">No data found</div></SalesLayout>;

    return (
        <SalesLayout>
            <div className="max-w-7xl mx-auto pb-10 px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <button onClick={() => navigate('/admin/performance')} className="text-gray-500 hover:text-gray-700 font-medium flex items-center mb-2 transition-colors">
                            ← Back to Leaderboard
                        </button>
                        <h1 className="text-3xl font-bold text-text-primary border-l-4 border-indigo-500 pl-3">
                            {data.userName}'s Performance
                        </h1>
                    </div>

                    <div className={`px-4 py-2 rounded-lg border ${currentTier.color} flex flex-col items-center shadow-sm`}>
                        <span className="text-xs uppercase font-bold tracking-wider">Current Tier</span>
                        <span className="text-xl font-extrabold">{currentTier.name}</span>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                    <div className="card-modern p-5 hover:shadow-md transition-shadow">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Total Incentive</p>
                        <p className="text-2xl font-bold text-indigo-600 mt-1">₹{totalIncentiveEarned.toLocaleString()}</p>
                    </div>
                    <div className="card-modern p-5 hover:shadow-md transition-shadow">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Deals Closed</p>
                        <p className="text-2xl font-bold text-text-primary mt-1">{approvedDeals} <span className="text-sm font-normal text-text-muted">/ {totalDeals}</span></p>
                    </div>
                    <div className="card-modern p-5 hover:shadow-md transition-shadow">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Approval Rate</p>
                        <p className={`text-2xl font-bold mt-1 ${approvalRate >= 80 ? 'text-green-600' : approvalRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {approvalRate.toFixed(1)}%
                        </p>
                    </div>
                    <div className="card-modern p-5 hover:shadow-md transition-shadow">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Avg Deal Size</p>
                        <p className="text-2xl font-bold text-text-primary mt-1">₹{Math.round(averageDealValue).toLocaleString()}</p>
                    </div>
                    <div className="card-modern p-5 hover:shadow-md transition-shadow">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Consistency</p>
                        <div className="flex items-end gap-2">
                            <p className={`text-2xl font-bold mt-1 ${consistencyScore >= 80 ? 'text-green-600' : consistencyScore >= 50 ? 'text-yellow-600' : 'text-gray-600'}`}>
                                {Math.round(consistencyScore)}/100
                            </p>
                        </div>
                    </div>
                    <div className="card-modern p-5 hover:shadow-md transition-shadow">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Max Deal</p>
                        <p className="text-2xl font-bold text-purple-600 mt-1">₹{maxDealValue.toLocaleString()}</p>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Line Chart: Incentive Growth */}
                    <div className="glass-card p-6 border-white/20 dark:border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-text-primary">Incentive Growth Trend</h2>
                            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-semibold">Earnings</span>
                        </div>
                        <div className="h-64">
                            <Line data={lineChartData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true, grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }, x: { grid: { display: false }, ticks: { color: '#94a3b8' } } }, plugins: { legend: { display: false } } }} />
                        </div>
                    </div>

                    {/* Line Chart: Quality Trend */}
                    <div className="glass-card p-6 border-white/20 dark:border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-text-primary">Deal Quality Trend</h2>
                            <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded text-xs font-semibold">Avg Deal Size</span>
                        </div>
                        <div className="h-64">
                            <Line
                                data={{
                                    labels: lineChartData.labels,
                                    datasets: [
                                        {
                                            label: 'Avg Deal Size',
                                            data: processedTrend.map(t => t.averageDealSize),
                                            backgroundColor: (context) => {
                                                const ctx = context.chart.ctx;
                                                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                                                gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)'); // Indigo
                                                gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
                                                return gradient;
                                            },
                                            borderColor: '#6366F1',
                                            borderWidth: 2,
                                            tension: 0.4,
                                            fill: true,
                                            pointBackgroundColor: '#FFFFFF',
                                            pointBorderColor: '#6366F1',
                                            pointRadius: 4
                                        },
                                    ],
                                }}
                                options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true, grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }, x: { grid: { display: false }, ticks: { color: '#94a3b8' } } }, plugins: { legend: { display: false } } }}
                            />
                        </div>
                    </div>
                </div>

                {/* Doughnut Chart Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="glass-card p-6 border-white/20 dark:border-white/10">
                        <h2 className="text-lg font-bold text-text-primary mb-6">Execution Mix</h2>
                        <div className="h-48 flex justify-center">
                            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#94a3b8' } } } }} />
                        </div>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="card-modern overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-text-primary">Detailed Deal History</h2>

                        <div className="flex gap-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search deals..."
                                    className="pl-9 pr-4 py-2 bg-surface-1 border border-border-subtle rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-primary-500 outline-none w-full md:w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg className="w-4 h-4 text-text-muted absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>

                            <select
                                className="px-4 py-2 bg-surface-1 border border-border-subtle rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-primary-500 outline-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="ALL">All Status</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="DRAFT">Draft</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-surface-2 border-b border-border-subtle sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Deal Value</th>
                                    <th className="px-6 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Incentive</th>
                                    <th className="px-6 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {filteredDeals.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-text-muted italic">
                                            No deals match your search criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDeals.map(deal => (
                                        <tr key={deal.id} className="hover:bg-surface-2 transition-colors">
                                            <td className="px-6 py-4 text-sm text-text-secondary font-medium">{deal.date || "N/A"}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-text-primary">₹{deal.amount?.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-indigo-600">
                                                {deal.incentive > 0 ? `₹${deal.incentive?.toLocaleString()}` : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${deal.status === 'Approved' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                    deal.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                        'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                    }`}>
                                                    {deal.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-muted max-w-xs truncate">
                                                {deal.rejectionReason || "-"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-surface-2 p-4 border-t border-border-subtle text-xs text-text-muted text-right">
                        Showing {filteredDeals.length} of {deals.length} deals
                    </div>
                </div>
            </div>
        </SalesLayout>
    );
};

export default AdminPerformance;
