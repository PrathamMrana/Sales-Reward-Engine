import Sidebar from "../components/common/Sidebar";
import AppIcon from "../components/common/AppIcon";
import NotificationPanel from "../components/common/NotificationPanel";
import UserMenu from "../components/common/UserMenu";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface-1 flex flex-col">
      {/* Top Header */}
      <div className="w-full border-b border-border-subtle bg-surface-2 py-3 px-6 shadow-sm z-30 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary-500 to-indigo-600 text-white p-2 rounded-lg shadow-lg shadow-primary-500/30">
              <AppIcon size="w-6 h-6" />
            </div>
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Sales Reward Engine
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationPanel />
            <div className="h-6 w-px bg-border-subtle"></div>
            <UserMenu />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative z-10 p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
