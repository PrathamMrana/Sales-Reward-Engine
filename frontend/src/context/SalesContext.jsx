import { createContext, useContext, useState } from "react";

const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const [deals, setDeals] = useState(() => {
    const stored = localStorage.getItem("salesDeals");
    return stored ? JSON.parse(stored) : [];
  });

  const [monthlyTarget, setMonthlyTarget] = useState(() => {
    const stored = localStorage.getItem("monthlyTarget");
    return stored ? parseFloat(stored) : 100000;
  });

  // Save to localStorage whenever deals change
  const saveDeals = (newDeals) => {
    setDeals(newDeals);
    localStorage.setItem("salesDeals", JSON.stringify(newDeals));
  };

  const addDeal = (deal) => {
    const newDeal = {
      ...deal,
      status: deal.status || "Draft",
      id: Date.now().toString()
    };
    saveDeals([...deals, newDeal]);
  };

  const deleteDeal = (index) => {
    saveDeals(deals.filter((_, i) => i !== index));
  };

  const updateDealStatus = (id, newStatus) => {
    saveDeals(deals.map(deal => 
      deal.id === id ? { ...deal, status: newStatus } : deal
    ));
  };

  const updateMonthlyTarget = (target) => {
    setMonthlyTarget(target);
    localStorage.setItem("monthlyTarget", target.toString());
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
