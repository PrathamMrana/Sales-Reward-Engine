import { createContext, useContext, useState } from "react";

const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const [deals, setDeals] = useState([]);

  const addDeal = (deal) => {
    setDeals((prev) => [...prev, deal]);
  };

  const deleteDeal = (index) => {
    setDeals((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SalesContext.Provider value={{ deals, addDeal, deleteDeal }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => useContext(SalesContext);
