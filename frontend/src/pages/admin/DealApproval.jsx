import SalesLayout from "../../layouts/SalesLayout";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const DealApproval = () => {
    const [deals, setDeals] = useState([]);
    const [filter, setFilter] = useState("ALL"); // ALL, Submitted, Approved, Rejected
    const [selectedSalesPerson, setSelectedSalesPerson] = useState("ALL");
    const [sortOrder, setSortOrder] = useState("desc"); // desc = Newest First

    // Approve Modal State
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [approveDealId, setApproveDealId] = useState(null);
    const [adminComment, setAdminComment] = useState("");

    // Reject Modal State
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectDealId, setRejectDealId] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    const fetchDeals = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:8080/deals");
            setDeals(res.data);
        } catch (err) {
            console.error("Failed to fetch deals", err);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchDeals();
    }, [fetchDeals]);

    const processStatusUpdate = async (dealId, status, reason, comment) => {
        try {
            const payload = { status };
            if (reason) payload.reason = reason;
            if (comment) payload.comment = comment;

            const res = await axios.patch(`http://localhost:8080/deals/${dealId}/status`, payload);
            // Update local state with the response data, assuming it contains the updated deal
            setDeals(prev => prev.map(d => d.id === dealId ? res.data : d));
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update deal status");
        }
    };

    const handleStatusUpdate = async (dealId, newStatus) => {
        if (newStatus === "Rejected") {
            setRejectDealId(dealId);
            setRejectReason("");
            setIsRejectModalOpen(true);
            return;
        }
        if (newStatus === "Approved") {
            setApproveDealId(dealId);
            setAdminComment("");
            setIsApproveModalOpen(true);
            return;
        }
    };

    const confirmRejection = async () => {
        if (!rejectReason.trim()) {
            alert("Please provide a rejection reason.");
            return;
        }
        await processStatusUpdate(rejectDealId, "Rejected", rejectReason, null);
        setIsRejectModalOpen(false);
    };

    const confirmApproval = async () => {
        await processStatusUpdate(approveDealId, "Approved", null, adminComment);
        setIsApproveModalOpen(false);
    };

    // Extract unique Sales Persons (Users)
    const salesPersons = [...new Set(deals.map(d => d.user?.name).filter(Boolean))];

    const filteredDeals = deals.filter(d => {
        // Status Filter
        if (filter !== "ALL" && d.status !== filter) return false;

        // Sales Person Filter
        if (selectedSalesPerson !== "ALL" && d.user?.name !== selectedSalesPerson) return false;

        return true;
    }).sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date).getTime();
        const dateB = new Date(b.createdAt || b.date).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    const getRiskBadge = (risk, amount) => {
        let level = risk;
        // Fallback logic if risk is null (legacy data)
        if (!level) {
            if (amount > 50000) level = "HIGH";
            else level = "LOW";
        }

        if (level === "HIGH") {
            return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded border border-red-200">HIGH RISK</span>
        } else if (level === "MEDIUM") {
            return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded border border-yellow-200">MEDIUM RISK</span>
        } else {
            return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded border border-green-200">LOW RISK</span>
        }
    };

    return (
        <SalesLayout>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => {
                            const headers = ["ID", "Date", "Sales Exec", "Amount", "Incentive", "Risk", "Status", "Comment/Reason"];
                            const csvContent = [
                                headers.join(","),
                                ...filteredDeals.map(d => [
                                    d.id,
                                    new Date(d.createdAt || d.date).toLocaleDateString(),
                                    `"${d.user ? d.user.name : "Unknown"}"`,
                                    d.amount,
                                    d.incentive,
                                    d.riskLevel || (d.amount > 50000 ? "HIGH" : "LOW"),
                                    d.status,
                                    `"${d.rejectionReason || d.adminComment || ""}"`
                                ].join(","))
                            ].join("\n");

                            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                            const link = document.createElement("a");
                            link.href = URL.createObjectURL(blob);
                            link.download = `deals_export_${new Date().toISOString().slice(0, 10)}.csv`;
                            link.click();
                        }}
                        className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                        title="Export CSV"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </button>
                    <button
                        onClick={fetchDeals}
                        className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-700"
                        title="Refresh List"
                    >
                        <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                </div>

                <div className="flex space-x-4">
                    {/* Sort Order */}
                    <select
                        className="input-modern w-48"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="desc">Recently Done (Newest)</option>
                        <option value="asc">Earlier Deals (Oldest)</option>
                    </select>

                    {/* Sales Person Filter */}
                    <select
                        className="input-modern w-48"
                        value={selectedSalesPerson}
                        onChange={(e) => setSelectedSalesPerson(e.target.value)}
                    >
                        <option value="ALL">All Sales Execs</option>
                        {salesPersons.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        className="input-modern w-48"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="Submitted">Pending (Submitted)</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Draft">Drafts</option>
                    </select>
                </div>
            </div>

            <div className="card-modern overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-2 border-b border-border-subtle">
                        <tr>
                            <th className="p-4 py-3 font-medium text-text-secondary text-sm uppercase tracking-wide">Date</th>
                            <th className="p-4 py-3 font-medium text-text-secondary text-sm uppercase tracking-wide">Sales Exec</th>
                            <th className="p-4 py-3 font-medium text-text-secondary text-sm uppercase tracking-wide">Amount</th>
                            <th className="p-4 py-3 font-medium text-text-secondary text-sm uppercase tracking-wide">Risk Assessment</th>
                            <th className="p-4 py-3 font-medium text-text-secondary text-sm uppercase tracking-wide">Incentive</th>
                            <th className="p-4 py-3 font-medium text-text-secondary text-sm uppercase tracking-wide">Status</th>
                            <th className="p-4 py-3 font-medium text-text-secondary text-right text-sm uppercase tracking-wide">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                        {filteredDeals.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="p-6 text-center text-text-muted">No deals found</td>
                            </tr>
                        ) : (
                            filteredDeals.map((deal) => (
                                <tr key={deal.id} className="border-b border-border-subtle hover:bg-surface-2 transition-colors">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-text-primary">
                                                {new Date(deal.createdAt || deal.date).toLocaleDateString()}
                                            </span>
                                            <span className="text-xs text-text-muted">
                                                {deal.createdAt ? new Date(deal.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-text-primary">
                                        {deal.user ? deal.user.name : "Unknown"}
                                    </td>
                                    <td className="p-4 text-text-primary">₹{deal.amount}</td>
                                    <td className="p-4">
                                        {getRiskBadge(deal.riskLevel, deal.amount)}
                                    </td>
                                    <td className="p-4 text-emerald-600 dark:text-emerald-400 font-medium">₹{deal.incentive.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${deal.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                deal.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                                    deal.status === 'Submitted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                        'bg-surface-2 text-text-secondary'}`}>
                                            {deal.status}
                                        </span>
                                        {deal.adminComment && (
                                            <div className="text-[10px] text-text-muted mt-1 max-w-[120px] leading-tight">
                                                Note: {deal.adminComment}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        {deal.status === 'Submitted' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(deal.id, 'Approved')}
                                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 shadow-sm"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(deal.id, 'Rejected')}
                                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 shadow-sm"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {deal.status === 'Draft' && (
                                            <span className="text-text-muted text-sm italic">Draft</span>
                                        )}
                                        {(deal.status === 'Approved' || deal.status === 'Rejected') && (
                                            <span className="text-text-muted text-sm">Processed</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>


            {/* Reject Deal Modal */}
            {
                isRejectModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="card-modern p-6 max-w-sm w-full shadow-2xl">
                            <h3 className="text-lg font-bold text-text-primary mb-4">Reject Deal</h3>
                            <p className="text-text-secondary mb-4">Please provide a reason for rejecting this deal.</p>
                            <textarea
                                className="input-modern mb-4 focus:ring-2 focus:ring-red-500"
                                placeholder="Reason for rejection..."
                                rows="3"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setIsRejectModalOpen(false)}
                                    className="px-4 py-2 text-text-secondary hover:text-text-primary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmRejection}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium shadow-lg hover:shadow-red-500/30"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Approve Deal Modal */}
            {
                isApproveModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="card-modern p-6 max-w-sm w-full shadow-2xl">
                            <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-4">Approve Deal</h3>
                            <p className="text-text-secondary mb-4">Optional: Add a comment for the sales executive.</p>
                            <textarea
                                className="input-modern mb-4 focus:ring-2 focus:ring-green-500"
                                placeholder="Good job! / Policy exception applied..."
                                rows="3"
                                value={adminComment}
                                onChange={(e) => setAdminComment(e.target.value)}
                            />
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setIsApproveModalOpen(false)}
                                    className="px-4 py-2 text-text-secondary hover:text-text-primary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmApproval}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium shadow-lg hover:shadow-green-500/30"
                                >
                                    Confirm Approval
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </SalesLayout>
    );
};

export default DealApproval;
