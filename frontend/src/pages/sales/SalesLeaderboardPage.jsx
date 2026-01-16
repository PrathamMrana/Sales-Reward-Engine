import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import SalesLayout from "../../layouts/SalesLayout";

const SalesLeaderboardPage = () => {
    const { auth } = useAuth();
    const currentUserId = auth?.user?.id || auth?.id;
    const [leaders, setLeaders] = useState([]);
    const [filter, setFilter] = useState("This Month");

    useEffect(() => {
        axios.get("http://localhost:8080/deals").then(res => {
            const allDeals = res.data;
            const approved = allDeals.filter(d => d.status === "Approved");
            const userStats = {};

            approved.forEach(d => {
                if (!d.user) return;
                const uid = d.user.id;
                if (!userStats[uid]) {
                    userStats[uid] = { name: d.user.name, totalIncentive: 0, deals: 0 };
                }
                userStats[uid].totalIncentive += (d.incentive || 0);
                userStats[uid].deals += 1;
            });

            const sorted = Object.values(userStats).sort((a, b) => b.totalIncentive - a.totalIncentive);
            setLeaders(sorted);
        }).catch(err => console.error("Failed to load leaderboard"));
    }, []);

    return (
        <SalesLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="section-title">Leaderboard</h1>
                        <div className="h-1 w-24 mt-2 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full"></div>
                        <p className="section-subtitle mt-4">Top Performers & Rankings</p>
                    </div>
                    <div className="flex bg-surface-2 p-1 rounded-lg border border-border-subtle">
                        {["This Month", "Last Month", "This Year"].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === f ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-text-secondary hover:text-text-primary'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="card-modern overflow-hidden">
                    <table className="w-full bg-white dark:bg-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Executive</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trend</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Deals Closed</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total Incentive</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {leaders.map((leader, idx) => (
                                <tr key={leader.name} className={`group transition-colors ${currentUserId && leader.name === auth?.user?.name ? "bg-primary-50 dark:bg-primary-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}>
                                    <td className="px-6 py-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-md transform group-hover:scale-110 transition-transform ${idx === 0 ? "bg-gradient-to-br from-yellow-300 to-yellow-600 ring-2 ring-yellow-200" :
                                                idx === 1 ? "bg-gradient-to-br from-slate-300 to-slate-500 ring-2 ring-slate-200" :
                                                    idx === 2 ? "bg-gradient-to-br from-orange-400 to-amber-700 ring-2 ring-orange-200" : "bg-gray-200 text-gray-600"
                                            }`}>
                                            {idx === 0 ? "🏆" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-text-primary">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                                                {leader.name[0]}
                                            </div>
                                            {leader.name}
                                            {currentUserId && leader.name === auth?.user?.name && <span className="px-2 py-0.5 rounded text-[10px] bg-primary-200 text-primary-800">You</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-bold flex items-center gap-1 ${idx % 3 === 0 ? 'text-green-500' : idx % 3 === 1 ? 'text-red-500' : 'text-gray-400'}`}>
                                            {idx % 3 === 0 ? '▲ 2' : idx % 3 === 1 ? '▼ 1' : '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary">{leader.deals}</td>
                                    <td className="px-6 py-4 text-right font-bold text-emerald-600 text-lg">
                                        ₹{leader.totalIncentive.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SalesLayout>
    );
};

export default SalesLeaderboardPage;
