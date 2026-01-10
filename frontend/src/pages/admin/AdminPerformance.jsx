import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import SalesLayout from '../../layouts/SalesLayout';

const AdminPerformance = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch performance summary
                const perfRes = await axios.get(`http://localhost:8080/admin/performance/${userId}`);
                setData(perfRes.data);

                // Fetch raw deals for details
                const dealsRes = await axios.get(`http://localhost:8080/deals?userId=${userId}`);
                // Sort deals by date desc, handling potential null dates slightly gracefully
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

    if (loading) return <SalesLayout><div className="p-8">Loading...</div></SalesLayout>;
    if (error) return <SalesLayout><div className="p-8 text-red-500">{error}</div></SalesLayout>;
    if (!data) return <SalesLayout><div className="p-8">No data found</div></SalesLayout>;

    const {
        totalDeals = 0,
        approvedDeals = 0,
        rejectedDeals = 0,
        approvalRate = 0,
        totalIncentiveEarned = 0,
        averageDealValue = 0,
        monthlyTrend = []
    } = data;

    const chartData = {
        labels: monthlyTrend.map(t => {
            if (typeof t.month === 'string') return t.month;
            if (Array.isArray(t.month)) return `${t.month[0]}-${t.month[1]}`;
            return `${t.month.year}-${t.month.monthValue}`;
        }),
        datasets: [
            {
                label: 'Incentive Sum',
                data: monthlyTrend.map(t => t.incentiveSum),
                backgroundColor: 'rgba(59,130,246,0.2)',
                borderColor: 'rgba(59,130,246,1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    return (
        <SalesLayout>
            <div className="max-w-6xl mx-auto pb-10">
                <button
                    onClick={() => navigate('/admin/performance')}
                    className="mb-4 text-gray-500 hover:text-gray-700 font-medium flex items-center"
                >
                    ← Back to Leaderboard
                </button>

                <h1 className="text-2xl font-bold mb-6">Performance Details</h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Total Deals</p>
                        <p className="text-2xl font-bold text-gray-800">{totalDeals}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Approval Rate</p>
                        <p className="text-2xl font-bold text-green-600">{approvalRate.toFixed(1)}%</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Total Incentive</p>
                        <p className="text-2xl font-bold text-blue-600">₹{totalIncentiveEarned.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Avg Deal Value</p>
                        <p className="text-2xl font-bold text-gray-800">₹{averageDealValue.toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold mb-4">Monthly Incentive Trend</h2>
                        <div className="h-80">
                            <Line data={chartData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <h2 className="text-lg font-semibold p-6 text-gray-800 border-b border-gray-50">Recent Deals History</h2>
                        <div className="overflow-x-auto max-h-80 overflow-y-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Incentive</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {deals.length === 0 ? (
                                        <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No deals found</td></tr>
                                    ) : (
                                        deals.map(deal => (
                                            <tr key={deal.id} className="hover:bg-gray-50 text-sm">
                                                <td className="px-6 py-3 text-gray-600">{deal.date || "N/A"}</td>
                                                <td className="px-6 py-3 font-medium text-gray-900">₹{deal.amount}</td>
                                                <td className="px-6 py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${deal.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                        deal.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {deal.status}
                                                    </span>
                                                </td>
                                                {/* Incentive might be 0 for rejected/pending deals */}
                                                <td className="px-6 py-3 text-gray-600">₹{deal.incentive?.toFixed(2) || 0}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </SalesLayout>
    );
};

export default AdminPerformance;
