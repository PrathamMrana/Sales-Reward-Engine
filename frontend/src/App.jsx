import { useState } from "react";
import Result from "./Result";
import axios from "axios"
function App() {
  const [amount, setAmount] = useState("");
  const [commission, setCommission] = useState(null);
  const [error, setError] = useState("");

  const calculateCommission = () => {
    // Empty input check
    if (!amount) {
      setError("Deal amount is required");
      setCommission(null);
      return;
    }

    // Invalid or zero value check
    if (Number(amount) <= 0) {
      setError("Deal amount must be greater than zero");
      setCommission(null);
      return;
    }

    // Clear previous error
    setError("");

    // Commission logic
    const result =
      Number(amount) <= 50000
        ? Number(amount) * 0.05
        : Number(amount) * 0.1;

    setCommission(result);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md border border-gray-800 p-8 rounded-xl">

        {/* Title */}
        <h1 className="text-white text-2xl font-bold tracking-wide text-center">
          SALES COMMISSION
        </h1>
        <p className="text-gray-400 text-sm text-center mt-2">
          Simple. Clean. Accurate.
        </p>

        {/* Input */}
        <div className="mt-8">
          <label className="block text-gray-400 text-sm mb-2">
            Deal Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setCommission(null);
              setError("");
            }}
            placeholder="Enter deal amount"
            className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:border-white"
          />

          {/* Error Message */}
          {error && (
            <p className="text-red-400 text-sm mt-2">
              {error}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={calculateCommission}
          disabled={!amount}
          className="w-full mt-6 bg-white text-black py-3 rounded-md font-semibold tracking-wide
                     hover:bg-gray-200 transition
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          CALCULATE
        </button>

        {/* Result */}
        {commission !== null && (
          <Result commission={commission} />
        )}

      </div>
    </div>
  );
}

export default App;
