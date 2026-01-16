import React, { useState, useEffect } from "react";
import SalesLayout from "../../layouts/SalesLayout";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const SalesPayouts = () => {
    const { auth } = useAuth();
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Summary Stats
    const [totalEarned, setTotalEarned] = useState(0);
    const [totalPending, setTotalPending] = useState(0);

    const fetchPayouts = async () => {
        try {
            // Reusing existing endpoint: GET /deals?userId=...
            // Only 'Approved' deals are eligible for payouts
            const res = await axios.get(`http://localhost:8080/deals?userId=${auth.user.id}`);

            const approvedDeals = res.data.filter(d => d.status === "Approved");

            // Sort by payout date (recent first) or deal date
            approvedDeals.sort((a, b) => new Date(b.date) - new Date(a.date));

            setPayouts(approvedDeals);

            // Calculate Totals
            const earned = approvedDeals
                .filter(d => d.payoutStatus === "PAID")
                .reduce((sum, d) => sum + d.incentive, 0);

            const pending = approvedDeals
                .filter(d => !d.payoutStatus || d.payoutStatus === "PENDING")
                .reduce((sum, d) => sum + d.incentive, 0);

            setTotalEarned(earned);
            setTotalPending(pending);

        } catch (err) {
            console.error("Failed to fetch payouts", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.user?.id) {
            fetchPayouts();
        }
    }, [auth]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <SalesLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">My Earnings</h1>
                    <p className="text-text-secondary">Track your commission payouts and status.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="card-modern p-6 bg-gradient-to-br from- emerald-50 to-green-50 border-emerald-100">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Total Paid</p>
                    <p className="text-3xl font-bold text-emerald-800">{formatCurrency(totalEarned)}</p>
                    <p className="text-xs text-emerald-600 mt-1">Deposited to bank</p>
                </div>
                <div className="card-modern p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Pending Payout</p>
                    <p className="text-3xl font-bold text-amber-800">{formatCurrency(totalPending)}</p>
                    <p className="text-xs text-amber-600 mt-1">Processing / Approval Pending</p>
                </div>
            </div>

            {/* Payouts Table */}
            <div className="card-modern overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-surface-2 text-text-secondary uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Deal Date</th>
                                <th className="px-6 py-4">Deal Amount</th>
                                <th className="px-6 py-4">Commission</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Payout Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-text-muted">Loading payouts...</td>
                                </tr>
                            ) : payouts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-text-muted">
                                        No approved deals found yet.
                                    </td>
                                </tr>
                            ) : (
                                payouts.map((deal) => (
                                    <tr key={deal.id} className="hover:bg-surface-2/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-text-primary">
                                            {formatDate(deal.date)}
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">
                                            {formatCurrency(deal.amount)}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-primary-600">
                                            {formatCurrency(deal.incentive)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {deal.payoutStatus === "PAID" ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></span>
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">
                                            {deal.payoutStatus === "PAID" ? formatDate(deal.payoutDate) : "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </SalesLayout>
    );
};

export default SalesPayouts;
