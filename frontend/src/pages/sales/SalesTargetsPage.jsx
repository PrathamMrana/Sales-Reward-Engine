import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import SalesLayout from "../../layouts/SalesLayout";
import GoalTracker from "../../components/common/GoalTracker";
import TierBadge from "../../components/common/TierBadge";
import { useSales } from "../../context/SalesContext";

const SalesTargetsPage = () => {
    const { deals } = useSales();
    const { auth } = useAuth();
    const userId = auth?.user?.id || auth?.id;
    const [performanceData, setPerformanceData] = useState(null);

    // Fallback incentive calculation
    const approvedDeals = deals.filter(d => d.status === "Approved");
    const localTotalIncentive = approvedDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:8080/performance/summary?userId=${userId}`)
                .then(res => setPerformanceData(res.data))
                .catch(console.error);
        }
    }, [userId, deals]);

    const totalIncentive = performanceData ? performanceData.totalIncentiveEarned : localTotalIncentive;
    const rank = performanceData ? performanceData.rank : null;

    // Simulator State
    const [simDealValue, setSimDealValue] = useState(50000);
    const [simDealCount, setSimDealCount] = useState(1);
    const simIncentive = simDealValue * 0.10 * simDealCount;
    const projectedTotal = totalIncentive + simIncentive;

    return (
        <SalesLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                    <h1 className="section-title">Targets & Progress</h1>
                    <div className="h-1 w-24 mt-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
                    <p className="section-subtitle mt-4">Track your goals, forecast outcomes, and simulate earnings.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Goal Tracker */}
                    <div className="space-y-6">
                        <div className="card-modern p-6">
                            <h2 className="text-lg font-bold mb-4">Monthly Goal Tracker</h2>
                            <GoalTracker />
                        </div>

                        {/* What-If Simulator */}
                        <div className="card-modern p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-100 dark:border-indigo-800">
                            <div className="flex items-center gap-2 mb-4">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">Earnings Simulator</h2>
                            </div>
                            <p className="text-sm text-text-secondary mb-6">See how closing more deals affects your total earnings.</p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="text-xs font-bold uppercase text-text-muted">Avg Deal Value (₹)</label>
                                    <input
                                        type="number"
                                        value={simDealValue}
                                        onChange={(e) => setSimDealValue(Number(e.target.value))}
                                        className="input-modern mt-1 w-full"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-text-muted">Deals to Close</label>
                                    <input
                                        type="number"
                                        value={simDealCount}
                                        onChange={(e) => setSimDealCount(Number(e.target.value))}
                                        className="input-modern mt-1 w-full"
                                    />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-border-subtle">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm text-text-secondary">Projected Extra Incentive</span>
                                    <span className="text-xl font-bold text-emerald-600">+₹{simIncentive.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                                <p className="text-xs text-center text-text-muted mt-2">
                                    Your total would reach <span className="font-bold text-text-primary">₹{projectedTotal.toLocaleString()}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Club Status */}
                    <div className="space-y-6">
                        <div className="card-modern p-6">
                            <h2 className="text-lg font-bold mb-4">Club Status Ladder</h2>
                            <p className="text-sm text-text-secondary mb-4">Climb the ladder to unlock higher rewards!</p>
                            <div className="h-[250px] flex items-center justify-center">
                                <TierBadge totalIncentive={totalIncentive} rank={rank} />
                            </div>
                        </div>

                        {/* Forecast / Insights */}
                        <div className="card-modern p-6">
                            <h3 className="font-bold text-text-primary mb-3">AI Goal Forecast</h3>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                </div>
                                <div>
                                    {/* Calculating gap and deals needed */}
                                    {(() => {
                                        const { monthlyTarget } = useSales(); // Access context directly or pass as prop
                                        // Note: reusing localTotalIncentive if performanceData not ready
                                        const current = totalIncentive > 0 ? totalIncentive : 0;
                                        const gap = Math.max(0, monthlyTarget - current); // Target from Context
                                        // Assume avg incentive from deals or default 5000
                                        const avgIncentive = approvedDeals.length > 0 ? (current / approvedDeals.length) : 5000;
                                        const dealsNeeded = Math.ceil(gap / avgIncentive);

                                        return gap > 0 ? (
                                            <>
                                                <p className="text-sm text-text-secondary">
                                                    You are <span className="font-bold text-amber-600">₹{gap.toLocaleString()}</span> away from your monthly target.
                                                </p>
                                                <p className="text-xs text-text-muted mt-2">
                                                    At your average of <b>₹{Math.round(avgIncentive).toLocaleString()}/deal</b>, you need roughly:
                                                </p>
                                                <p className="text-xl font-bold text-primary-600 mt-1">{dealsNeeded} more deals 🎯</p>
                                            </>
                                        ) : (
                                            <p className="text-sm font-bold text-emerald-600">You have hit your target! Great job! 🚀</p>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SalesLayout>
    );
};

export default SalesTargetsPage;
