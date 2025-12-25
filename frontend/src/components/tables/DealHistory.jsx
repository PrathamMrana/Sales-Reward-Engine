import { useState, useMemo } from "react";
import { useSales } from "../../context/SalesContext";
import StatusBadge from "../common/StatusBadge";
import DateFilter from "../common/DateFilter";

const DealHistory = () => {
  const { deals, deleteDeal, updateDealStatus } = useSales();
  const [dateFilter, setDateFilter] = useState("all");

  const filteredDeals = useMemo(() => {
    if (dateFilter === "all") return deals;

    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    return deals.filter(deal => {
      const dealDate = new Date(deal.date);
      if (dateFilter === "thisMonth") {
        return dealDate >= currentMonth && dealDate <= now;
      }
      if (dateFilter === "lastMonth") {
        return dealDate >= lastMonth && dealDate <= lastMonthEnd;
      }
      return true;
    });
  }, [deals, dateFilter]);

  const handleStatusChange = (dealId, newStatus) => {
    updateDealStatus(dealId, newStatus);
  };

  const getNextStatus = (currentStatus) => {
    const workflow = {
      Draft: "Submitted",
      Submitted: "Approved",
      Approved: null,
      Rejected: "Draft"
    };
    return workflow[currentStatus];
  };

  if (deals.length === 0) {
    return (
      <div className="card-modern p-16 text-center relative">
        <div className="absolute top-0 left-0 w-16 h-16 border-b border-r border-gray-200"></div>
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-2 border-gray-300 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-light text-gray-700 mb-2 uppercase tracking-widest">No deals recorded</h3>
          <p className="text-xs text-gray-500">Start calculating your rewards</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-modern relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
      
      <div className="p-8">
        <div className="mb-6">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="section-title">Deal History</h2>
            <span className="text-xs text-gray-500 uppercase tracking-widest">{filteredDeals.length} {filteredDeals.length === 1 ? 'deal' : 'deals'}</span>
          </div>
          <div className="h-px bg-black w-24 mt-2"></div>
        </div>

        <div className="mb-6">
          <DateFilter onFilterChange={setDateFilter} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-primary-200 bg-gradient-to-r from-primary-50 to-accent-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-800 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-800 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-800 uppercase tracking-widest">Rate</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-800 uppercase tracking-widest">Incentive</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-800 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-primary-800 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDeals.map((deal, index) => {
                const nextStatus = getNextStatus(deal.status);
                const originalIndex = deals.findIndex(d => d.id === deal.id);
                
                return (
                  <tr key={deal.id || index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-light text-gray-900">{deal.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{deal.amount.toLocaleString('en-IN')}</div>
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-medium text-primary-700 bg-primary-50 border-2 border-primary-200 px-3 py-1 rounded-lg">
                      {deal.rate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      ₹{deal.incentive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={deal.status || "Draft"} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        {nextStatus && (
                          <button
                            onClick={() => handleStatusChange(deal.id, nextStatus)}
                            className="text-xs uppercase tracking-widest px-3 py-1.5 border-2 border-primary-400 bg-white hover:bg-gradient-to-r hover:from-primary-600 hover:to-primary-700 hover:text-white hover:border-primary-600 transition-all rounded-lg font-medium shadow-sm hover:shadow-md"
                          >
                            {nextStatus === "Submitted" ? "Submit" : nextStatus === "Approved" ? "Approve" : "Resubmit"}
                          </button>
                        )}
                        {deal.status === "Submitted" && (
                          <button
                            onClick={() => handleStatusChange(deal.id, "Rejected")}
                            className="text-xs uppercase tracking-widest px-3 py-1.5 border-2 border-red-400 bg-white hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 hover:text-white hover:border-red-600 transition-all rounded-lg font-medium shadow-sm hover:shadow-md"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => deleteDeal(originalIndex)}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 transition-all rounded-lg shadow-md hover:shadow-lg"
                        >
                          <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DealHistory;
