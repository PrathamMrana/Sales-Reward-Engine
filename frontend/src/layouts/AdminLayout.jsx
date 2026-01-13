import Navbar from "../components/common/Navbar";
import AppIcon from "../components/common/AppIcon";
import NotificationPanel from "../components/common/NotificationPanel";
import UserMenu from "../components/common/UserMenu";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* App Name at Top */}
      <div className="w-full border-b-2 border-primary-200 bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/30 py-4 px-8 shadow-sm">
        <div className="flex items-center justify-between">
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
          <div className="flex items-center space-x-4">
            <NotificationPanel />
            <div className="h-6 w-px bg-primary-300/50"></div>
            <UserMenu showName={false} />
          </div>
        </div>
      </div>

      <Navbar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
};

export default AdminLayout;
