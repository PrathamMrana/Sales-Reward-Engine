import { useState } from "react";
import SalesLayout from "../layouts/SalesLayout";
import { useSales } from "../context/SalesContext";
import { useNotifications } from "../context/NotificationContext";

const Calculator = () => {
  const { addDeal } = useSales();
  const { addNotification } = useNotifications();

  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const incentive = (Number(amount) * Number(rate)) / 100;
    setResult(incentive);

    const now = new Date();
    const dealDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    
    addDeal({
      amount: Number(amount),
      rate: Number(rate),
      incentive,
      date: dealDate,
      status: "Draft"
    });

    addNotification({
      type: "success",
      title: "Deal Created",
      message: `Deal worth ₹${Number(amount).toLocaleString('en-IN')} created. Incentive: ₹${incentive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}. Status: Draft`
    });

    setAmount("");
    setRate("");
  };

  return (
    <SalesLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <h1 className="section-title">Incentive</h1>
          <div className="h-px bg-black w-24 mt-2"></div>
          <p className="section-subtitle mt-4">Calculator</p>
        </div>

        <div className="card-modern p-10 relative">
          <div className="absolute top-0 right-0 w-16 h-16 border-b border-r border-gray-200"></div>
          
          <div className="space-y-8">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-4 uppercase tracking-widest">
                Deal Amount
              </label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 flex items-center pl-1 pointer-events-none">
                  <span className="text-gray-400 text-lg font-light">₹</span>
                </div>
                <input
                  className="input-modern pl-6 text-lg"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-4 uppercase tracking-widest">
                Incentive Rate
              </label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 flex items-center pl-1 pointer-events-none">
                  <span className="text-gray-400 text-lg font-light">%</span>
                </div>
                <input
                  className="input-modern pl-6 text-lg"
                  type="number"
                  placeholder="0"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  step="0.1"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={calculate}
                disabled={!amount || !rate}
                className="w-full btn-primary py-4 text-sm uppercase tracking-widest font-medium disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Calculate & Save Deal →
              </button>
            </div>

            {result !== null && (
              <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 text-white p-8 relative mt-6 rounded-lg shadow-xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
                <div className="relative">
                  <p className="text-xs font-semibold text-emerald-100 uppercase tracking-widest mb-3">Incentive Amount</p>
                  <div className="flex items-baseline space-x-3">
                    <p className="text-4xl font-bold tracking-tight">
                      ₹{result.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </p>
                    <div className="h-0.5 bg-white opacity-40 flex-1 mt-6"></div>
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
