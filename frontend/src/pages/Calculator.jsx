import { useState } from "react";
import SalesLayout from "../layouts/SalesLayout";
import { useSales } from "../context/SalesContext";

const Calculator = () => {
  const { addDeal } = useSales();

  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const incentive = (Number(amount) * Number(rate)) / 100;
    setResult(incentive);

    addDeal({
      amount: Number(amount),
      rate: Number(rate),
      incentive,
      date: new Date().toLocaleDateString()
    });

    setAmount("");
    setRate("");
  };

  return (
    <SalesLayout>
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Incentive Calculator
          </h1>
          <p className="text-sm text-gray-600">Calculate your reward amount</p>
        </div>

        <div className="card-modern p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
                Deal Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">₹</span>
                </div>
                <input
                  className="input-modern pl-7"
                  type="number"
                  placeholder="Enter deal amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
                Incentive Rate
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">%</span>
                </div>
                <input
                  className="input-modern pl-7"
                  type="number"
                  placeholder="Enter incentive rate"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  step="0.1"
                />
              </div>
            </div>

            <button
              onClick={calculate}
              disabled={!amount || !rate}
              className="w-full btn-primary py-2.5 text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Calculate & Save Deal
            </button>

            {result !== null && (
              <div className="bg-gray-50 border border-gray-300 p-5 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Incentive Amount</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      ₹{result.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SalesLayout>
  );
};

export default Calculator;
