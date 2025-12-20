import { useAuth } from "../../context/AuthContext";

const Topbar = () => {
  const { auth, logout } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-black flex items-center justify-center">
          <span className="text-white font-medium text-xs">
            {(auth?.name || "U").charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{auth?.name || "User"}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{auth?.role || "SALES"}</p>
        </div>
      </div>

      <button
        onClick={logout}
        className="flex items-center space-x-2 bg-black hover:bg-gray-900 text-white px-4 py-1.5 text-xs uppercase tracking-wide transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Logout</span>
      </button>
    </header>
  );
};

export default Topbar;
