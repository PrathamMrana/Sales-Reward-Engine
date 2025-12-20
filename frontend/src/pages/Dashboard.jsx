import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Dashboard() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/deals")
      .then(res => setDeals(res.data))
      .catch(console.error);
  }, []);

  const totalDeals = deals.length;
  const totalRevenue = deals.reduce((sum, d) => sum + d.amount, 0);
  const totalCommission = deals.reduce(
    (sum, d) => sum + (d.amount <= 50000 ? d.amount * 0.05 : d.amount * 0.10),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-2">Analytics Dashboard</h1>
      <p className="text-gray-400 mb-8">
        System-level insights & sales performance
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: "Total Deals", value: totalDeals },
          { label: "Total Revenue", value: `₹${totalRevenue}` },
          { label: "Total Commission", value: `₹${totalCommission}` }
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="border border-gray-800 rounded-xl p-6 bg-gradient-to-br from-black to-gray-900"
          >
            <p className="text-gray-400 text-sm">{card.label}</p>
            <h2 className="text-2xl font-bold mt-2">{card.value}</h2>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
