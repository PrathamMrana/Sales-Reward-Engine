import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import SalesLayout from "../../layouts/SalesLayout";
import PerformanceTrend from "../../components/charts/PerformanceTrend";
import EarningsBreakdown from "../../components/charts/EarningsBreakdown";
import MonthlyPerformanceBar from "../../components/charts/MonthlyPerformanceBar";
import PerformanceComparison from "../../components/common/PerformanceComparison";

const SalesPerformancePage = () => {
    const { auth } = useAuth();
    const userId = auth?.user?.id || auth?.id;

    return (
        <SalesLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="section-title">Performance Analytics</h1>
                        <div className="h-1 w-24 mt-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
                        <p className="section-subtitle mt-4">Deep dive into your earnings, trends, and statistics.</p>
                    </div>
                    <button className="btn-secondary flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Export Data
                    </button>
                </div>

                {/* Filters Row */}
                <div className="flex gap-2 bg-surface-2 p-1 rounded-lg w-fit">
                    {['Monthly', 'Quarterly', 'Yearly'].map(t => (
                        <button key={t} className="px-4 py-2 rounded-md text-sm font-medium hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all text-text-secondary hover:text-text-primary focus:bg-white dark:focus:bg-slate-700 focus:shadow-sm focus:text-primary-600">
                            {t}
                        </button>
                    ))}
                </div>

                {/* Main Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 card-modern p-6">
                        <h3 className="font-bold mb-4">Incentive Growth Trend</h3>
                        <PerformanceTrend />
                    </div>
                    <div className="card-modern p-6">
                        <h3 className="font-bold mb-4">Earnings Breakdown</h3>
                        <EarningsBreakdown />
                    </div>
                </div>

                {/* Comparison Section */}
                <div className="card-modern p-6">
                    <h3 className="font-bold mb-4">Period Comparison</h3>
                    <PerformanceComparison />
                </div>

                {/* Monthly Bar Chart */}
                <div className="card-modern p-6">
                    <h3 className="font-bold mb-4">Monthly Performance History</h3>
                    <MonthlyPerformanceBar />
                </div>
            </div>
        </SalesLayout>
    );
};

export default SalesPerformancePage;
