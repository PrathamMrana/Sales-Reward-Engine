import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";
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
            const res = await axios.get("http://localhost:8080/policies/admin?type=COMPANY");
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

            await axios.post("http://localhost:8080/policies", payload);
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
            await axios.delete(`http://localhost:8080/policies/${id}`);
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
                <div className={`lg:col-span-1 space-y-4 ${isEditing ? 'hidden lg:block' : ''}`}>
                    {policies.length === 0 && (
                        <div className="p-8 text-center text-text-muted border border-border-subtle rounded-lg border-dashed">
                            No policies found. Create one!
                        </div>
                    )}
                    {policies.map(policy => (
                        <div
                            key={policy.id}
                            onClick={() => handleEdit(policy)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all
                                ${selectedPolicy?.id === policy.id
                                    ? 'bg-primary-50 border-primary-500 shadow-md ring-1 ring-primary-200'
                                    : 'bg-surface-1 border-border-subtle hover:border-primary-300 hover:shadow-sm'
                                }
                            `}
                        >
                            <h3 className="font-semibold text-text-primary">{policy.title}</h3>
                            <p className="text-xs text-text-secondary mt-1">
                                Last Updated: {new Date(policy.lastUpdated).toLocaleDateString()}
                            </p>
                            <div className="mt-2 text-sm text-text-muted line-clamp-2">
                                {policy.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Editor Column */}
                <div className={`lg:col-span-2 ${!isEditing ? 'hidden lg:block' : ''}`}>
                    {isEditing ? (
                        <div className="card-modern p-6 h-full flex flex-col">
                            <div className="mb-4">
                                <label className="label-modern">Policy Title</label>
                                <input
                                    type="text"
                                    className="input-modern"
                                    placeholder="e.g. Q1 Commission Structure"
                                    value={formTitle}
                                    onChange={e => setFormTitle(e.target.value)}
                                />
                            </div>
                            <div className="mb-4 flex-grow flex flex-col">
                                <label className="label-modern">Content (Markdown Supported)</label>
                                <textarea
                                    className="input-modern flex-grow min-h-[400px] font-mono text-sm"
                                    placeholder="Write policy details here..."
                                    value={formContent}
                                    onChange={e => setFormContent(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-border-subtle">
                                {selectedPolicy && (
                                    <button
                                        onClick={() => handleDelete(selectedPolicy.id)}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                    >
                                        Delete Policy
                                    </button>
                                )}
                                <div className="flex gap-3 ml-auto">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-text-secondary hover:text-text-primary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="btn-primary"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-text-muted border-2 border-dashed border-border-subtle rounded-xl bg-surface-2/50">
                            Select a policy to edit or create a new one
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminPolicy;
