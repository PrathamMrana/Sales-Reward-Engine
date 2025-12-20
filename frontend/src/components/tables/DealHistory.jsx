import { useSales } from "../../context/SalesContext";

const DealHistory = () => {
  const { deals, deleteDeal } = useSales();

  if (deals.length === 0) {
    return (
      <div className="card-modern p-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-sm font-medium text-gray-700 mb-1">No deals recorded yet</h3>
          <p className="text-xs text-gray-500">Start calculating your rewards to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-modern p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-0.5">
            Deal History
          </h2>
          <p className="text-xs text-gray-500">{deals.length} {deals.length === 1 ? 'deal' : 'deals'} recorded</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rate</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Incentive</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {deals.map((deal, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{deal.date}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">₹{deal.amount.toLocaleString('en-IN')}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-xs font-medium text-gray-700">
                    {deal.rate}%
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    ₹{deal.incentive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <button
                    onClick={() => deleteDeal(index)}
                    className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-white bg-black hover:bg-gray-900 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealHistory;
