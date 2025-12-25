import { NavLink } from "react-router-dom";
import AppIcon from "./AppIcon";

const Sidebar = () => {
  const navItems = [
    { path: "/sales", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { path: "/sales/history", label: "Deal History", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { path: "/sales/calculator", label: "Calculator", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r-2 border-slate-700 h-screen flex flex-col relative shadow-xl">
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-primary-500 to-accent-500 opacity-20"></div>
      
      <nav className="flex-1 p-6 space-y-2 mt-8">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-4 px-4 py-3 text-sm transition-all relative group rounded-lg ${
                isActive
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-slate-700/50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                )}
                <div className={`w-5 h-5 flex items-center justify-center ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <span className="tracking-wide">{item.label}</span>
                {isActive && (
                  <div className="ml-auto text-white font-light">→</div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-700">
        <div className="bg-gradient-to-r from-primary-600/20 to-accent-600/20 border border-primary-500/30 rounded-lg p-4 flex flex-col items-center">
          <AppIcon size="w-10 h-10" />
          <div className="text-xs text-gray-300 uppercase tracking-widest text-center mt-3 mb-1">Track & Earn</div>
          <div className="h-px bg-gradient-to-r from-primary-500 to-accent-500 w-12"></div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
