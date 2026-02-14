import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import api, { API_URL } from "../../api";
import PageHeader from "../../components/common/PageHeader";

const AdminPolicy = () => {
    const [policies, setPolicies] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formTitle, setFormTitle] = useState("");
    const [formContent, setFormContent] = useState("");

    const fetchPolicies = async () => {
        try {
            const res = await api.get("/policies/admin?type=COMPANY");
            setPolicies(res.data);
        } catch (err) {
            console.error("Failed to fetch policies");
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, []);

    const handleEdit = (policy) => {
        setSelectedPolicy(policy);
        setFormTitle(policy.title);
        setFormContent(policy.content);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setSelectedPolicy(null);
        setFormTitle("");
        setFormContent("");
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const payload = {
                title: formTitle,
                content: formContent,
                type: 'COMPANY',
                active: true
            };
            if (selectedPolicy) {
                payload.id = selectedPolicy.id;
            }

            await api.post("/policies", payload);
            setIsEditing(false);
            fetchPolicies();
            alert("Policy Saved!");
        } catch (err) {
            alert("Failed to save policy");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await axios.delete(`${API_URL}/policies/${id}`);
            fetchPolicies();
            if (selectedPolicy?.id === id) {
                setIsEditing(false);
                setSelectedPolicy(null);
            }
        } catch (err) {
            alert("Failed to delete");
        }
    };

    return (
        <AdminLayout>
            <PageHeader
                heading="Policy Document Management"
                subtitle="Create, edit, and maintain company policies and guidelines."
                actions={
                    !isEditing && (
                        <button
                            onClick={handleCreate}
                            className="btn-primary flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            New Policy
                        </button>
                    )
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List Column */}
                <div className={`lg:col-span-1 space-y-4 ${isEditing ? `hidden lg:block' : ''}`}>
                    {policies.length === 0 && (
                        <div className="p-8 text-center text-slate-500 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                            No policies found. Create one!
                        </div>
                    )}
                    {policies.map(policy => (
                        <div
                            key={policy.id}
                            onClick={() => handleEdit(policy)}
                            className={`group p-5 rounded-xl border cursor-pointer transition-all duration-300
                                ${selectedPolicy?.id === policy.id
                                    ? 'bg-blue-50/50 border-blue-200 shadow-md ring-1 ring-blue-100 dark:bg-primary-900/20 dark:border-primary-500 dark:ring-primary-500/50'
                                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 dark:bg-surface-1 dark:border-border-subtle dark:hover:border-primary-400'
                                }
                            `}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`font-bold text-lg ${selectedPolicy?.id === policy.id ? 'text-blue-700 dark:text-primary-400' : 'text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-primary-300'}`}>
                                    {policy.title}
                                </h3>
                                {selectedPolicy?.id === policy.id && (
                                    <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                                )}
                            </div>

                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                                Updated: {new Date(policy.lastUpdated).toLocaleDateString()}
                            </p>

                            <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                {policy.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Editor Column */}
                <div className={`lg:col-span-2 ${!isEditing ? 'hidden lg:block' : ''}`}>
                    {isEditing ? (
                        <div className="bg-white dark:bg-surface-1 p-8 rounded-2xl border border-slate-200 dark:border-border-subtle shadow-xl h-full flex flex-col">
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                                    Policy Title
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-semibold text-lg dark:bg-slate-900/50 dark:border-slate-700 dark:text-white"
                                    placeholder="e.g. Q1 Commission Structure"
                                    value={formTitle}
                                    onChange={e => setFormTitle(e.target.value)}
                                />
                            </div>
                            <div className="mb-6 flex-grow flex flex-col">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                        Content
                                    </label>
                                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded dark:bg-slate-800">
                                        Markdown Supported
                                    </span>
                                </div>
                                <textarea
                                    className="w-full flex-grow p-6 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono text-sm leading-relaxed focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-300"
                                    placeholder="# Policy Details\n\nWrite your policy content here..."
                                    value={formContent}
                                    onChange={e => setFormContent(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
                                {selectedPolicy && (
                                    <button
                                        onClick={() => handleDelete(selectedPolicy.id)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-semibold transition-all dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                    >
                                        Delete Policy
                                    </button>
                                )}
                                <div className="flex gap-4 ml-auto">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/30 dark:text-slate-500">
                            <div className="p-6 bg-white rounded-full shadow-sm mb-4 dark:bg-slate-800 dark:shadow-none">
                                <svg className="w-12 h-12 text-blue-200 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <p className="font-medium text-xl text-slate-600 dark:text-slate-300 mb-2">Policy Editor</p>
                            <p className="text-sm text-slate-400">Select a policy to edit or create a new one</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminPolicy;
