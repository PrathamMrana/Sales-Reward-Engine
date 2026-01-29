import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const { auth, logout } = useAuth();
  const isAdmin = auth?.user?.role === "ADMIN";
  const location = useLocation();

  const salesItems = [
    { path: "/sales", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { path: "/sales/my-deals", label: "My Assigned Deals", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { path: "/sales/performance", label: "Performance", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
    { path: "/sales/targets", label: "Targets & Progress", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { path: "/sales/leaderboard", label: "Leaderboard", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
    { path: "/sales/reports", label: "Reports", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" },
    { path: "/sales/history", label: "Deal History", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { path: "/sales/simulator", label: "Incentive Simulator", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
    { path: "/sales/policy", label: "My Incentives Policy", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { path: "/sales/policies", label: "Company Policies", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { path: "/sales/payouts", label: "My Earnings", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  const adminItems = [
    { path: "/admin", label: "Overview", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
    { path: "/admin/deals", label: "Manage Deals", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
    { path: "/admin/approvals", label: "Deal Approvals", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { path: "/admin/users", label: "User Management", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { path: "/admin/incentive-policies", label: "Incentive Policies", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { path: "/admin/policy", label: "General Policies", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { path: "/admin/performance", label: "Performance Audit", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { path: "/admin/audit-logs", label: "System Logs", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
    { path: "/admin/settings", label: "Platform Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  ];

  const navItems = isAdmin ? adminItems : salesItems;

  return (
    <aside className="w-72 h-[calc(100vh-2rem)] flex flex-col relative z-20 m-4 rounded-3xl overflow-hidden glass-panel transition-all duration-300 shadow-2xl">
      {/* Dynamic Background: Lighter for Light Mode, Deep for Dark Mode */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/10 dark:from-slate-800/50 dark:to-slate-900/50 pointer-events-none opacity-50"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[80px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50"></div>

      {/* Header Profile Section */}
      <div className="p-6 pb-4 relative z-10">
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 border border-white/20 dark:border-white/10 shadow-lg group transition-all duration-300"
        >
          <div className="relative">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-inner ${isAdmin
              ? "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/20"
              : "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/20"
              }`}>
              {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : (isAdmin ? "A" : "S")}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white/50 dark:border-slate-900 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
            </div>
          </div>

          <div className="flex-1 text-left overflow-hidden">
            <h1 className="font-bold text-slate-800 dark:text-white text-base tracking-tight truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {auth?.user?.name || (isAdmin ? "Administrator" : "Sales Executive")}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate uppercase tracking-wider font-semibold">
              {isAdmin ? "Admin Portal" : "Sales Portal"}
            </p>
          </div>

          <div className="text-slate-400 dark:text-slate-500 group-hover:text-rose-500 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </div>
        </motion.button>
      </div>

      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2"></div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar relative z-10">
        <AnimatePresence mode='wait'>
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <NavLink
                to={item.path}
                end={item.path === "/sales" || item.path === "/admin"}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${isActive
                    ? "text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-indigo-600/90"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    <span className="relative z-10 flex items-center justify-center w-6 h-6">
                      <svg className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </span>

                    <span className="relative z-10 font-medium tracking-wide truncate">{item.label}</span>

                    {isActive && (
                      <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse relative z-10"></div>
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </AnimatePresence>
      </nav>

      {/* Footer System Status */}
      <div className="p-5 mt-auto relative z-10">
        <div className="relative overflow-hidden rounded-2xl bg-[var(--surface-2)] border border-[var(--border-subtle)] p-4 text-center group backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Online</span>
            </div>

            <p className="text-[10px] text-slate-500 font-medium group-hover:text-slate-400 transition-colors">
              Enterprise Suite v3.0
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
