import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import PageHeader from "../../components/common/PageHeader";
import { motion, AnimatePresence } from "framer-motion";

const AdminIncentivePolicy = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        commissionRate: "",
        minDealAmount: "",
        maxDealAmount: "",
        bonusThreshold: "",
        bonusAmount: "",
        active: true
    });

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/api/policy/admin?type=INCENTIVE");
            setPolicies(response.data);
        } catch (error) {
            console.error("Error fetching incentive policies:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/policy", {
                ...formData,
                type: 'INCENTIVE',
                active: formData.active
            });
            setShowCreateForm(false);
            resetForm();
            fetchPolicies();
        } catch (error) {
            console.error("Error creating policy:", error);
            alert("❌ Failed to create policy: " + (error.response?.data || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this incentive policy?")) return;

        try {
            await axios.delete(`http://localhost:8080/api/policy/${id}`);
            fetchPolicies();
        } catch (error) {
            console.error("Error deleting policy:", error);
            alert("❌ Failed to delete policy");
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            commissionRate: "",
            minDealAmount: "",
            maxDealAmount: "",
            bonusThreshold: "",
            bonusAmount: "",
            active: true
        });
        setEditingPolicy(null);
    };

    return (
        <AdminLayout>
            <PageHeader
                heading="Incentive Policies"
                subtitle="Design and manage commission structures for your sales team."
                actions={
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="btn-primary flex items-center gap-2 group"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Policy
                    </button>
                }
            />

            {/* Create Policy Modal / Panel */}
            <AnimatePresence>
                {showCreateForm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            onClick={() => setShowCreateForm(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, x: "100%" }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-xl bg-[#0f172a] border-l border-white/10 shadow-2xl z-50 p-6 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-white">Create New Policy</h2>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Policy Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., Q1 Standard Commission"
                                            className="input-field bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-primary-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="3"
                                            placeholder="Details about this policy..."
                                            className="input-field bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-primary-500"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-white/10">
                                        <h3 className="text-lg font-semibold text-white mb-4">Commission Structure</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Commission Rate (%)</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        name="commissionRate"
                                                        value={formData.commissionRate}
                                                        onChange={handleChange}
                                                        required
                                                        min="0"
                                                        max="100"
                                                        step="0.1"
                                                        className="input-field bg-white/5 border-white/10 text-white pl-4 pr-12 text-lg font-semibold"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Min Deal Size (₹)</label>
                                                <input
                                                    type="number"
                                                    name="minDealAmount"
                                                    value={formData.minDealAmount}
                                                    onChange={handleChange}
                                                    className="input-field bg-white/5 border-white/10 text-white"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Max Deal Size (₹)</label>
                                                <input
                                                    type="number"
                                                    name="maxDealAmount"
                                                    value={formData.maxDealAmount}
                                                    onChange={handleChange}
                                                    className="input-field bg-white/5 border-white/10 text-white"
                                                    placeholder="Unlimited"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/10">
                                        <h3 className="text-lg font-semibold text-white mb-4">Bonus Incentives</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Threshold (₹)</label>
                                                <input
                                                    type="number"
                                                    name="bonusThreshold"
                                                    value={formData.bonusThreshold}
                                                    onChange={handleChange}
                                                    className="input-field bg-white/5 border-white/10 text-white"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Bonus Amount (₹)</label>
                                                <input
                                                    type="number"
                                                    name="bonusAmount"
                                                    value={formData.bonusAmount}
                                                    onChange={handleChange}
                                                    className="input-field bg-white/5 border-white/10 text-white"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <label className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="active"
                                                    checked={formData.active}
                                                    onChange={handleChange}
                                                    className="peer sr-only"
                                                />
                                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                            </div>
                                            <div>
                                                <span className="block text-sm font-medium text-white">Active Policy</span>
                                                <span className="block text-xs text-slate-400">Visible to sales team immediately</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="btn-secondary flex-1 border-white/10 text-white hover:bg-white/5"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary flex-1 shadow-lg shadow-primary-500/20">
                                        Create Policy
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Policy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <motion.div
                                key={`skeleton-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-64 rounded-2xl bg-white/5 animate-pulse"
                            />
                        ))
                    ) : policies.length === 0 ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                                <svg className="w-12 h-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Policies Found</h3>
                            <p className="text-slate-400 mb-8 max-w-sm mx-auto">Get started by creating your first incentive policy to motivate your sales team.</p>
                            <button onClick={() => setShowCreateForm(true)} className="btn-primary">
                                Create New Policy
                            </button>
                        </div>
                    ) : (
                        policies.map((policy, index) => (
                            <motion.div
                                key={policy.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="glass-panel group relative overflow-hidden rounded-3xl border border-white/10 hover:border-primary-500/50 transition-colors"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-32 h-32 text-primary-500 transform translate-x-8 -translate-y-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    </svg>
                                </div>

                                <div className="relative p-6 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${policy.isActive
                                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                                                : "bg-slate-700/50 text-slate-400 border border-slate-600/50"
                                            }`}>
                                            {policy.isActive ? "Active" : "Inactive"}
                                        </div>
                                        <button
                                            onClick={() => handleDelete(policy.id)}
                                            className="p-2 -mr-2 -mt-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors"
                                            title="Delete Policy"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1" title={policy.title}>
                                        {policy.title}
                                    </h3>
                                    <p className="text-sm text-slate-400 mb-6 line-clamp-2 min-h-[2.5em]">
                                        {policy.description || "No description provided."}
                                    </p>

                                    <div className="mt-auto space-y-4">
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                            <span className="text-sm text-slate-400 block mb-1">Commission Rate</span>
                                            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">
                                                {policy.commissionRate}%
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Deal Range</span>
                                                <span className="text-sm font-medium text-slate-300">
                                                    {policy.minDealAmount ? `₹${(policy.minDealAmount / 1000).toFixed(0)}k+` : "Any"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Bonus</span>
                                                <span className="text-sm font-medium text-emerald-400">
                                                    {policy.bonusAmount ? `+₹${(policy.bonusAmount / 1000).toFixed(0)}k` : "-"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </AdminLayout>
    );
};

export default AdminIncentivePolicy;
