import SalesLayout from "../../layouts/SalesLayout";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const IncentivePolicyPage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();
  const isAdmin = auth?.user?.role === "ADMIN";

  // Form State for Admin
  const [newPolicy, setNewPolicy] = useState({ title: "", description: "", rate: "", example: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/policy");
      setPolicies(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch policies");
      setLoading(false);
    }
  };

  const handleAddPolicy = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/policy", {
        ...newPolicy,
        displayOrder: policies.length + 1
      });
      setNewPolicy({ title: "", description: "", rate: "", example: "" });
      setIsEditing(false);
      fetchPolicies();
    } catch (err) {
      alert("Failed to save policy");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this policy rule?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/policy/${id}`);
      fetchPolicies();
    } catch (err) {
      alert("Failed to delete policy");
    }
  };

  return (
    <SalesLayout>
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="section-title">Incentive Policy</h1>
            <div className="h-px bg-black w-24 mt-2"></div>
            <p className="section-subtitle mt-4">Rules & Calculation Methods</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              {isEditing ? "Cancel" : "+ Add Rule"}
            </button>
          )}
        </div>

        {/* ADMIN EDIT FORM */}
        {isAdmin && isEditing && (
          <div className="bg-white p-6 rounded shadow-lg border border-blue-200 mb-6">
            <h3 className="font-semibold mb-4">Add New Policy Rule</h3>
            <form onSubmit={handleAddPolicy} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input className="border p-2 w-full rounded" required value={newPolicy.title} onChange={e => setNewPolicy({ ...newPolicy, title: e.target.value })} placeholder="e.g. Standard Commission" />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <input className="border p-2 w-full rounded" required value={newPolicy.description} onChange={e => setNewPolicy({ ...newPolicy, description: e.target.value })} placeholder="Short description" />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium">Rate Display</label>
                  <input className="border p-2 w-full rounded" required value={newPolicy.rate} onChange={e => setNewPolicy({ ...newPolicy, rate: e.target.value })} placeholder="e.g. 5%" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium">Example Text</label>
                  <input className="border p-2 w-full rounded" value={newPolicy.example} onChange={e => setNewPolicy({ ...newPolicy, example: e.target.value })} placeholder="Optional example" />
                </div>
              </div>
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Save Rule</button>
            </form>
          </div>
        )}

        {/* POLICY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {policies.length === 0 && !loading && (
            <p className="text-gray-500">No active policies found currently.</p>
          )}

          {policies.map((rule) => (
            <div key={rule.id} className="card-modern p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 opacity-30 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{rule.title}</h3>
                  {isAdmin && (
                    <button onClick={() => handleDelete(rule.id)} className="text-red-400 hover:text-red-600 text-sm">Delete</button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">{rule.description}</p>

                {rule.rate && (
                  <div className="mb-4">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-200 rounded-lg">
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent">
                        {rule.rate}
                      </span>
                    </div>
                  </div>
                )}

                {rule.example && (
                  <p className="text-xs text-gray-500 italic">Example: {rule.example}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SalesLayout>
  );
};

export default IncentivePolicyPage;
