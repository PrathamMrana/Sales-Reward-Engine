import SalesLayout from "../../layouts/SalesLayout";

const IncentivePolicyPage = () => {
  const policyRules = [
    {
      title: "Standard Rate",
      description: "Deals up to ₹50,000",
      rate: "5%",
      example: "₹50,000 deal = ₹2,500 incentive"
    },
    {
      title: "Premium Rate",
      description: "Deals above ₹50,000",
      rate: "10%",
      example: "₹1,00,000 deal = ₹10,000 incentive"
    },
    {
      title: "Approval Process",
      description: "Deal workflow stages",
      stages: ["Draft → Submit → Approval/Rejection"]
    }
  ];

  return (
    <SalesLayout>
      <div className="space-y-10">
        <div>
          <h1 className="section-title">Incentive Policy</h1>
          <div className="h-px bg-black w-24 mt-2"></div>
          <p className="section-subtitle mt-4">Rules & Calculation Methods</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {policyRules.map((rule, index) => (
            <div key={index} className="card-modern p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 opacity-30 rounded-full -mr-12 -mt-12"></div>
              
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{rule.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{rule.description}</p>
                
                {rule.rate && (
                  <div className="mb-4">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-200 rounded-lg">
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent">
                        {rule.rate}
                      </span>
                    </div>
                  </div>
                )}

                {rule.example && (
                  <p className="text-xs text-gray-500 italic">{rule.example}</p>
                )}

                {rule.stages && (
                  <div className="space-y-2">
                    {rule.stages.map((stage, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{stage}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Calculation Example */}
        <div className="card-modern p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Calculation Example</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary-500">
              <p className="text-sm text-gray-700 mb-2"><strong>Example 1:</strong> Deal Amount = ₹30,000</p>
              <p className="text-sm text-gray-600">Rate: 5% (Standard Rate)</p>
              <p className="text-sm font-semibold text-primary-700 mt-2">Incentive = ₹30,000 × 5% = ₹1,500</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-emerald-500">
              <p className="text-sm text-gray-700 mb-2"><strong>Example 2:</strong> Deal Amount = ₹75,000</p>
              <p className="text-sm text-gray-600">Rate: 10% (Premium Rate)</p>
              <p className="text-sm font-semibold text-emerald-700 mt-2">Incentive = ₹75,000 × 10% = ₹7,500</p>
            </div>
          </div>
        </div>
      </div>
    </SalesLayout>
  );
};

export default IncentivePolicyPage;

