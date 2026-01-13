import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const { auth } = useAuth();
  const [deals, setDeals] = useState([]);
  const [monthlyTarget, setMonthlyTarget] = useState(100000);

  const userId = auth?.user?.id || auth?.id;

  useEffect(() => {
    if (userId) {
      fetchDeals(userId);
      fetchPerformance(userId);
    } else {
      setDeals([]);
    }
  }, [userId]);

  const fetchPerformance = async (targetUserId) => {
    try {
      const res = await axios.get(`http://localhost:8080/performance?userId=${targetUserId}`);
      if (res.data && res.data.currentMonthTarget) {
        setMonthlyTarget(res.data.currentMonthTarget);
      }
    } catch (err) {
      console.error("Failed to fetch performance", err);
    }
  };

  const fetchDeals = async (targetUserId) => {
    const idToFetch = targetUserId || userId;
    if (!idToFetch) {
      setDeals([]);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8080/deals?userId=${idToFetch}`);
      setDeals(res.data);
    } catch (err) {
      console.error("Failed to fetch deals", err);
      setDeals([]);
    }
  };

  const addDeal = async (deal) => {
    if (!userId) {
      alert("Please login again to save deals.");
      return;
    }

    try {
      const payload = { ...deal, user: { id: userId } };
      const res = await axios.post("http://localhost:8080/deals", payload);
      setDeals([...deals, res.data]);
    } catch (err) {
      console.error("Failed to save deal", err);
      // Alert user if the error is likely due to stale session (User not found)
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to save deal. Please try logging out and in again.";
      alert("Error: " + msg);

      if (msg.includes("not found")) {
        // Optional: Could logout automatically here
      }
    }
  };

  const deleteDeal = (index) => {
    // Backend doesn't have delete endpoint yet!
    // For now, filter local state to simulate helper
    alert("Delete not supported on backend yet");
  };

  const updateDealStatus = async (id, newStatus) => {
    // Optimistic Update
    setDeals(deals.map(deal =>
      deal.id === id ? { ...deal, status: newStatus } : deal
    ));

    try {
      await axios.patch(`http://localhost:8080/deals/${id}/status`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
      // Revert on failure? For MVP, we just log.
    }
  };

  const updateMonthlyTarget = async (target) => {
    setMonthlyTarget(target);
    localStorage.setItem("monthlyTarget", target.toString());

    if (userId) {
      try {
        await axios.put("http://localhost:8080/performance/target", { userId, target });
      } catch (err) {
        console.error("Failed to save target", err);
      }
    }
  };

  return (
    <SalesContext.Provider value={{
      deals,
      addDeal,
      deleteDeal,
      updateDealStatus,
      monthlyTarget,
      updateMonthlyTarget
    }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => useContext(SalesContext);
