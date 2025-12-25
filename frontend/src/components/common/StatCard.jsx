const StatCard = ({ title, value, gradient = "from-primary-500 to-primary-600" }) => {
  return (
    <div className="card-modern p-6 group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity" style={{
        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
        '--tw-gradient-from': gradient.includes('primary') ? '#3b82f6' : '#14b8a6',
        '--tw-gradient-to': gradient.includes('primary') ? '#2563eb' : '#0d9488',
      }}></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">{title}</p>
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <p className="text-3xl font-semibold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent tracking-tight">{value}</p>
          <div className={`h-0.5 bg-gradient-to-r ${gradient} flex-1 mt-4 opacity-30 group-hover:opacity-60 transition-opacity`}></div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
