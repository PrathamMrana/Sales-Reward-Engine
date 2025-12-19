import { useEffect, useState } from "react";
import axios from "axios";

function DealHistory({ deals }) {
  return (
    <div className="mt-10">
      <h2 className="text-white text-xl font-semibold mb-4">
        Deal History
      </h2>

      {deals.length === 0 ? (
        <p className="text-gray-400">No deals yet</p>
      ) : (
        <table className="w-full border border-gray-700 text-white">
          <thead>
            <tr className="bg-gray-900">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal, index) => (
              <tr key={index} className="text-center">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">₹{deal.amount}</td>
                <td className="p-2 border">{deal.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DealHistory;


