import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import PageHeader from "../../components/common/PageHeader";
import { useNavigate } from "react-router-dom";

const AdminDealManagement = () => {
    const navigate = useNavigate();
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("latest"); // "latest" or "oldest"

    useEffect(() => {
        fetchDeals();
    }, [statusFilter, priorityFilter]);

    const fetchDeals = async () => {
        setLoading(true);
        try {
            let url = "http://localhost:8080/admin/deals?";
            if (statusFilter) url += `status=${statusFilter}&`;
            if (priorityFilter) url += `priority=${priorityFilter}`;

            const response = await axios.get(url);
            setDeals(response.data);
        } catch (error) {
            console.error("Error fetching deals:", error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            HIGH: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            LOW: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        };
        return badges[priority] || badges.MEDIUM;
    };

    const getStatusBadge = (status) => {
        const badges = {
            ASSIGNED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
            PENDING: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
            APPROVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        };
        return badges[status] || badges.DRAFT;
    };

    const filteredDeals = deals.filter(deal =>
        deal.dealName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.organizationName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort deals by date
    const sortedDeals = [...filteredDeals].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date);
        const dateB = new Date(b.createdAt || b.date);
        return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

    return (
        <AdminLayout>
            <PageHeader
                heading="Deal Management Dashboard"
                subtitle="View, manage, and track all deals across sales executives."
                actions={
                    <button
                        onClick={() => navigate("/admin/deals/create")}
                        className="btn-primary flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Deal
                    </button>
                }
            />

            {/* Filters */}
            <div className="card-modern p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="🔍 Search by deal or organization name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field md:col-span-2"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field"
                    >
                        <option value="">All Statuses</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="DRAFT">Draft</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="Pending">Pending Approval</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="input-field"
                    >
                        <option value="">All Priorities</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>

                    {/* Sort Control - Integrated in Grid */}
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider whitespace-nowrap">Sort By:</label>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="input-field py-2 px-3 pr-8 text-sm font-medium bg-white dark:bg-surface-1 border-border-subtle rounded-lg shadow-sm hover:border-primary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer"
                        >
                            <option value="latest">📅 Latest First</option>
                            <option value="oldest">📅 Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Deals Table */}
            <div className="card-modern overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-text-muted">
                        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        Loading deals...
                    </div>
                ) : filteredDeals.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">No Deals Found</h3>
                        <p className="text-text-muted mb-6">Create your first deal to get started</p>
                        <button
                            onClick={() => navigate("/admin/deals/create")}
                            className="btn-primary"
                        >
                            Create New Deal
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface-2 border-b border-border-subtle">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Deal Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Organization</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Assigned To</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Value</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Priority</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Close Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {sortedDeals.map((deal) => (
                                    <tr key={deal.id} className="hover:bg-surface-2 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-text-primary">
                                                {deal.dealName || `Deal #${deal.id}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">
                                            {deal.organizationName || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">
                                            {deal.user?.name || "Unassigned"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-primary-600">
                                                {deal.currency || '₹'}{deal.amount.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(deal.priority)}`}>
                                                {deal.priority || "MEDIUM"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(deal.status)}`}>
                                                {deal.status || "Draft"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary text-sm">
                                            {deal.expectedCloseDate || "Not set"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => navigate(`/admin/deals/${deal.id}`)}
                                                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm"
                                            >
                                                View Details →
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                <div className="card-modern p-6 text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                        {deals.length}
                    </div>
                    <div className="text-sm text-text-muted mt-1">Total Deals</div>
                </div>
                <div className="card-modern p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {deals.filter(d => d.status === "ASSIGNED").length}
                    </div>
                    <div className="text-sm text-text-muted mt-1">Assigned</div>
                </div>
                <div className="card-modern p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {deals.filter(d => d.status === "Pending" || d.status === "Submitted").length}
                    </div>
                    <div className="text-sm text-text-muted mt-1">Pending Approval</div>
                </div>
                <div className="card-modern p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {deals.filter(d => d.status === "APPROVED").length}
                    </div>
                    <div className="text-sm text-text-muted mt-1">Approved</div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDealManagement;
