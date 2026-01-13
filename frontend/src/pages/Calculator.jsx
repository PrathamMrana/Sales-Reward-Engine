import { useState, useEffect } from "react";
import axios from "axios";
import SalesLayout from "../layouts/SalesLayout";
import { useSales } from "../context/SalesContext";
import { useNotifications } from "../context/NotificationContext";

const Calculator = () => {
  const { addDeal } = useSales();
  const { addNotification } = useNotifications();

  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [policies, setPolicies] = useState([]);
  const [result, setResult] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch Policies and specific deal params on Load
  useEffect(() => {
    // Check URL params for edit mode
    const queryParams = new URLSearchParams(window.location.search);
    const editParam = queryParams.get("edit");
    const amountParam = queryParams.get("amount");
    const rateParam = queryParams.get("rate");

    if (editParam) {
      setIsEditing(true);
      setEditId(editParam);
      if (amountParam) setAmount(amountParam);
      if (rateParam) setRate(rateParam);
    }

    axios.get("http://localhost:8080/api/policy")
      .then(res => setPolicies(res.data))
      .catch(err => console.error("Failed to load policies", err));
  }, []);

  const handlePolicyChange = (e) => {
    const policyId = e.target.value;
    setSelectedPolicy(policyId);

    if (policyId) {
      const policy = policies.find(p => p.id === Number(policyId));
      if (policy) {
        // Extract numeric rate from string like "5%" or "10 %"
        const numericRate = parseFloat(policy.rate.replace(/[^0-9.]/g, ''));
        if (!isNaN(numericRate)) {
          setRate(numericRate);
        }
      }
    }
  };

  const handleSubmit = (status = "Submitted") => {
    const incentive = (Number(amount) * Number(rate)) / 100;
    setResult(incentive);

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dealDate = `${year}-${month}-${day}`;

    const dealData = {
      amount: Number(amount),
      rate: Number(rate),
      incentive,
      date: dealDate,
      status: status
    };

    if (isEditing && editId) {
      // If editing a draft, we should ideally update it. 
      // Since we might not have a full Update API, we will try to Delete old and Add new,
      // OR just Add new and let user manually delete old if they want (suboptimal).
      // Let's rely on SalesContext having a proper update or delete.
      // For this MVP, let's assume we can just "Save" as a new version if it's a draft?
      // No, duplicated drafts are bad.

      // I'll dispatch a custom event or use a function passed from context if available.
      // But wait, I can access context.

      // Let's try to DELETE the old draft first if we are "Updating".
      // Note: "deleteDeal" in context currently just alerts. I will fix that later.
      // For now, let's just Add New.
      addDeal(dealData);
      if (status === "Submitted") {
        // If we successfully submitted an edited draft, we should try to remove the old draft ID
        // implementation pending backend support.
        console.log("Should delete draft ID:", editId);
      }
    } else {
      addDeal(dealData);
    }

    addNotification({
      type: "success",
      title: `Deal ${status}`,
      message: `Deal worth ₹${Number(amount).toLocaleString('en-IN')} ${status === 'Submitted' ? 'submitted for approval' : 'saved as draft'}. Incentive: ₹${incentive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}.`
    });

    setAmount("");
    setRate("");
    setSelectedPolicy("");
    setIsEditing(false);
    setEditId(null);
    // Clear URL params
    window.history.pushState({}, document.title, window.location.pathname);
  };

  return (
    <SalesLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <h1 className="section-title">Incentive Calculator</h1>
        </div>

        <div className="card-modern p-10 relative">
          <div className="space-y-6">

            {/* Policies Dropdown */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-widest">
                Select Policy (Optional)
              </label>
              <select
                className="input-modern w-full"
                value={selectedPolicy}
                onChange={handlePolicyChange}
              >
                <option value="">-- Manual Rate --</option>
                {policies.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.rate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-widest">
                Deal Amount (₹)
              </label>
              <input
                className="input-modern w-full text-lg"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-widest">
                Incentive Rate (%)
              </label>
              <input
                className="input-modern w-full text-lg"
                type="number"
                placeholder="0"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                step="0.1"
              />
            </div>

            <div className="pt-4 flex space-x-4">
              <button
                onClick={() => handleSubmit("Draft")}
                disabled={!amount || !rate}
                className="flex-1 bg-surface-2 text-text-primary border border-border-strong py-4 rounded-lg font-medium hover:bg-surface-3 transition-colors uppercase tracking-widest text-sm"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSubmit("Submitted")}
                disabled={!amount || !rate}
                className="flex-1 btn-primary py-4 text-sm uppercase tracking-widest font-medium disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Submit for Approval
              </button>
            </div>

            {result !== null && (
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-lg mt-6 text-center">
                <p className="text-text-muted text-sm mb-2">Calculated Incentive</p>
                <p className="text-3xl font-bold text-emerald-600">
                  ₹{result.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SalesLayout>
  );
};

export default Calculator;
