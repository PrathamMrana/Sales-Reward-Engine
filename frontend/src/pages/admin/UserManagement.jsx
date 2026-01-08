import SalesLayout from "../../layouts/SalesLayout";
import { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/users");
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch users", err);
            setLoading(false);
        }
    };

    const toggleStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
        if (!window.confirm(`Are you sure you want to ${newStatus === 'DISABLED' ? 'Disable' : 'Activate'} this user?`)) return;

        try {
            await axios.patch(`http://localhost:8080/api/users/${userId}/status`, { status: newStatus });
            setUsers(users.map(u => u.id === userId ? { ...u, accountStatus: newStatus } : u));
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (loading) return <SalesLayout>Loading Users...</SalesLayout>;

    const salesUsers = users.filter(u => u.role === "SALES");

    return (
        <SalesLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="section-title">User Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage Sales Executives Access</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
                    Total Sales Execs: {salesUsers.length}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-4 py-3 font-medium text-gray-600">Name</th>
                            <th className="p-4 py-3 font-medium text-gray-600">Email</th>
                            <th className="p-4 py-3 font-medium text-gray-600">Status</th>
                            <th className="p-4 py-3 font-medium text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesUsers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-6 text-center text-gray-500">No sales users found.</td>
                            </tr>
                        ) : (
                            salesUsers.map((user) => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="p-4 text-gray-600">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold
                                            ${user.accountStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {user.accountStatus}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => toggleStatus(user.id, user.accountStatus)}
                                            className={`px-3 py-1 rounded text-sm font-medium transition-colors
                                                ${user.accountStatus === 'ACTIVE'
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'}`}
                                        >
                                            {user.accountStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                        </button>
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

export default UserManagement;
