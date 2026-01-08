import SalesLayout from "../../layouts/SalesLayout";
import { useEffect, useState } from "react";
import axios from "axios";

const DealApproval = () => {
    const [deals, setDeals] = useState([]);
    const [filter, setFilter] = useState("ALL"); // ALL, Submitted, Approved, Rejected
    const [selectedSalesPerson, setSelectedSalesPerson] = useState("ALL");
    const [sortOrder, setSortOrder] = useState("desc"); // desc = Newest First

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            const res = await axios.get("http://localhost:8080/deals");
            setDeals(res.data);
        } catch (err) {
            console.error("Failed to fetch deals", err);
        }
    };

    const processStatusUpdate = async (dealId, status, reason) => {
        try {
            const payload = { status };
            if (reason) payload.reason = reason;

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
        // For 'Approved' status, directly process the update
        if (!window.confirm(`Are you sure you want to ${newStatus} this deal?`)) return;
        await processStatusUpdate(dealId, newStatus, null);
    };

    const confirmRejection = async () => {
        if (!rejectReason.trim()) {
            alert("Please provide a rejection reason.");
            return;
        }
        await processStatusUpdate(rejectDealId, "Rejected", rejectReason);
        setIsRejectModalOpen(false);
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

    return (
        <SalesLayout>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-semibold">Deal Approvals</h1>
                    <button
                        onClick={fetchDeals}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        title="Refresh List"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                </div>

                <div className="flex space-x-4">
                    {/* Sort Order */}
                    <select
                        className="border p-2 rounded w-48"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="desc">Recently Done (Newest)</option>
                        <option value="asc">Earlier Deals (Oldest)</option>
                    </select>

                    {/* Sales Person Filter */}
                    <select
                        className="border p-2 rounded w-48"
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
                        className="border p-2 rounded w-48"
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

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-4 py-3 font-medium text-gray-600">Date</th>
                            <th className="p-4 py-3 font-medium text-gray-600">Sales Exec</th>
                            <th className="p-4 py-3 font-medium text-gray-600">Amount</th>
                            <th className="p-4 py-3 font-medium text-gray-600">Incentive</th>
                            <th className="p-4 py-3 font-medium text-gray-600">Status</th>
                            <th className="p-4 py-3 font-medium text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDeals.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-gray-500">No deals found</td>
                            </tr>
                        ) : (
                            filteredDeals.map((deal) => (
                                <tr key={deal.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">
                                                {new Date(deal.createdAt || deal.date).toLocaleDateString()}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {deal.createdAt ? new Date(deal.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-gray-900">
                                        {deal.user ? deal.user.name : "Unknown"}
                                    </td>
                                    <td className="p-4">₹{deal.amount}</td>
                                    <td className="p-4 text-green-600 font-medium">₹{deal.incentive.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${deal.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                deal.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    deal.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'}`}>
                                            {deal.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        {deal.status === 'Submitted' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(deal.id, 'Approved')}
                                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(deal.id, 'Rejected')}
                                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {deal.status === 'Draft' && (
                                            <span className="text-gray-400 text-sm italic">Draft (Not Submitted)</span>
                                        )}
                                        {(deal.status === 'Approved' || deal.status === 'Rejected') && (
                                            <span className="text-gray-400 text-sm">Processed</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </SalesLayout>
    );
};

export default DealApproval;
