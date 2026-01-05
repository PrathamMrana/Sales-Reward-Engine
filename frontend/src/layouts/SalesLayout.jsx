import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
import AppIcon from "../components/common/AppIcon";
import { useAuth } from "../context/AuthContext";

const SalesLayout = ({ children }) => {
  const { auth } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col">
      {/* App Name at Top */}
      <div className="w-full border-b-2 border-primary-200 bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/30 py-4 px-8 shadow-sm">
        <div className="flex items-center space-x-3">
          <AppIcon size="w-12 h-12" />
          <h1 className="font-semibold text-lg uppercase tracking-widest" style={{
            background: 'linear-gradient(to right, #1e40af, #0d9488)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Sales Reward Engine
          </h1>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
      <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden" style={{ position: 'relative' }}>
          {/* User Name and Role - Leftmost corner below app name */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-primary-100 px-8 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 tracking-wide">{auth?.name || "User"}</p>
                  <p className="text-xs text-primary-600 uppercase tracking-widest font-medium">{auth?.role || "SALES"}</p>
                </div>
              </div>
        <Topbar />
            </div>
          </div>
          
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default SalesLayout;
