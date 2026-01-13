import SalesLayout from "../../layouts/SalesLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PerformanceDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSalesUsers();
    }, []);

    const fetchSalesUsers = async () => {
        try {
            // Fetch all users and filter for SALES role
            // Ideally backend should have an endpoint for this, but reusing existing one for now
            const response = await axios.get("http://localhost:8080/api/users");
            const salesUsers = response.data.filter(u => u.role === 'SALES');
            setUsers(salesUsers);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SalesLayout>
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-semibold mb-6 text-text-primary">Sales Performance Leaderboard</h1>

                <div className="card-modern overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-2 border-b border-border-subtle text-xs font-semibold text-text-secondary uppercase">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-text-muted">
                                            Loading sales executives...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-text-muted">
                                            No sales executives found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-surface-2 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-text-primary">
                                                {user.name || user.fullName || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-secondary">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.accountStatus === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {user.accountStatus || 'UNKNOWN'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/admin/performance/${user.id}`)}
                                                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                                                >
                                                    View Performance →
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </SalesLayout>
    );
};

export default PerformanceDashboard;
