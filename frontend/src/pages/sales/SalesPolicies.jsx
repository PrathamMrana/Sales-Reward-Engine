import React, { useState, useEffect } from "react";
import SalesLayout from "../../layouts/SalesLayout";
import axios from "axios";

const SalesPolicies = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                // Public endpoint for active policies only
                const res = await axios.get("http://localhost:8080/policies");
                setPolicies(res.data);
                if (res.data.length > 0) setSelectedPolicy(res.data[0]);
            } catch (err) {
                console.error("Failed to fetch policies");
            } finally {
                setLoading(false);
            }
        };
        fetchPolicies();
    }, []);

    return (
        <SalesLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Company Policies</h1>
                    <p className="text-text-secondary">Guidelines, Terms & Commission Structures.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar List */}
                <div className="lg:col-span-1 space-y-2">
                    {loading ? (
                        <div className="animate-pulse space-y-3">
                            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-surface-2 rounded-lg"></div>)}
                        </div>
                    ) : policies.length === 0 ? (
                        <div className="p-4 text-sm text-text-muted border border-dashed rounded-lg">
                            No active policies found.
                        </div>
                    ) : (
                        policies.map(policy => (
                            <button
                                key={policy.id}
                                onClick={() => setSelectedPolicy(policy)}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm font-medium
                                    ${selectedPolicy?.id === policy.id
                                        ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-sm'
                                        : 'bg-surface-1 text-text-secondary hover:bg-surface-2 border border-transparent'
                                    }
                                `}
                            >
                                {policy.title}
                            </button>
                        ))
                    )}
                </div>

                {/* Content Viewer */}
                <div className="lg:col-span-3">
                    {selectedPolicy ? (
                        <div className="card-modern p-8 min-h-[500px]">
                            <h2 className="text-xl font-bold text-text-primary mb-2">{selectedPolicy.title}</h2>
                            <p className="text-xs text-text-muted mb-6 border-b border-border-subtle pb-4">
                                Last Updated: {new Date(selectedPolicy.lastUpdated).toLocaleDateString()}
                            </p>

                            <div className="prose prose-sm dark:prose-invert max-w-none text-text-secondary whitespace-pre-wrap">
                                {selectedPolicy.content}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 card-modern text-text-muted">
                            <svg className="w-16 h-16 mb-4 text-border-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p>Select a policy to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </SalesLayout>
    );
};

export default SalesPolicies;
