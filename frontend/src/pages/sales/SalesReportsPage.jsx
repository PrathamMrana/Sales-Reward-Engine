import React, { useState } from "react";
import SalesLayout from "../../layouts/SalesLayout";
import { useSales } from "../../context/SalesContext";

const SalesReportsPage = () => {
    const { deals } = useSales();
    const [reportType, setReportType] = useState("Incentive");
    const [dateRange, setDateRange] = useState("This Month");

    const handleDownload = () => {
        const headers = ["ID", "Client", "Amount", "Incentive", "Date", "Status"];
        const csvContent = "data:text/csv;charset=utf-8," +
            headers.join(",") + "\n" +
            deals.map(d => [d.id, d.clientName, d.amount, d.incentive, d.date, d.status].join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <SalesLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                    <h1 className="section-title">Reports & Exports</h1>
                    <div className="h-1 w-24 mt-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
                    <p className="section-subtitle mt-4">Download your performance data.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="card-modern p-6 space-y-6">
                        <h3 className="font-bold text-lg">Generate Report</h3>

                        <div>
                            <label className="block text-sm font-bold text-text-secondary mb-2">Report Type</label>
                            <select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="input-modern w-full"
                            >
                                <option value="Incentive">Incentive Statement</option>
                                <option value="Deals">Deal History</option>
                                <option value="Performance">Performance Review</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-text-secondary mb-2">Date Range</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['This Month', 'Last Month', 'This Year'].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setDateRange(r)}
                                        className={`py-2 px-3 rounded-md text-sm border ${dateRange === r ? 'bg-primary-500 text-white border-primary-500' : 'border-border-strong text-text-secondary hover:bg-surface-2'}`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleDownload}
                            className="w-full btn-primary py-3 flex justify-center items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download {reportType} Report ({dateRange})
                        </button>
                    </div>

                    <div className="card-modern p-6 bg-surface-2 border-dashed border-2 border-border-strong flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md mb-4 text-primary-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h4 className="font-bold text-text-primary">Preview Not Available</h4>
                        <p className="text-sm text-text-muted mt-2 max-w-xs">Reports are generated on demand. Click download to view the full CSV file.</p>
                    </div>
                </div>
            </div>
        </SalesLayout>
    );
};

export default SalesReportsPage;
