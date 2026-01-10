import SalesLayout from "../../layouts/SalesLayout";
import { useState, useEffect } from "react";
import axios from "axios";

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/audit-logs");
            setLogs(response.data);
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = filter === "ALL" ? logs : logs.filter(log => log.entityType === filter);

    const getActionColor = (action) => {
        switch (action) {
            case "LOGIN_SUCCESS": return "text-green-600 bg-green-50";
            case "LOGIN_FAIL": return "text-red-600 bg-red-50";
            case "APPROVE": return "text-green-600 bg-green-50";
            case "REJECT": return "text-red-600 bg-red-50";
            case "UPDATE_STATUS": return "text-blue-600 bg-blue-50";
            case "BROADCAST": return "text-purple-600 bg-purple-50";
            default: return "text-gray-600 bg-gray-50";
        }
    };

    return (
        <SalesLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Audit Logs</h1>
                    <select
                        className="px-4 py-2 border rounded-lg text-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">All Entities</option>
                        <option value="DEAL">Deals</option>
                        <option value="USER">Users</option>
                        <option value="NOTIFICATION">Notifications</option>
                        <option value="POLICY">Policies</option>
                    </select>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                                    <th className="px-6 py-4">Timestamp</th>
                                    <th className="px-6 py-4">Actor</th>
                                    <th className="px-6 py-4">Action</th>
                                    <th className="px-6 py-4">Entity</th>
                                    <th className="px-6 py-4">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            Loading logs...
                                        </td>
                                    </tr>
                                ) : filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            No audit logs found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {log.email || "System"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {log.entityType} <span className="text-gray-400">#{log.entityId}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs break-words">
                                                {log.details}
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

export default AuditLogs;
