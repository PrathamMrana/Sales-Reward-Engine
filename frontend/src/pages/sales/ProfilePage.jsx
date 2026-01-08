import SalesLayout from "../../layouts/SalesLayout";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import StatCard from "../../components/common/StatCard";

const ProfilePage = () => {
  const { auth } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth?.user?.id) {
      fetchProfile();
    }
  }, [auth]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/profile/me?userId=${auth.user.id}`);
      setProfileData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load profile", err);
      setLoading(false);
    }
  };

  if (!profileData && !loading) return <p>Failed to load.</p>;
  if (loading) return <SalesLayout>Loading...</SalesLayout>;

  const { user, salesProfile, systemStats, totalDeals, approvedDeals, totalIncentive } = profileData;
  const isSales = user.role === "SALES";

  return (
    <SalesLayout>
      <div className="space-y-10">
        <div>
          <h1 className="section-title">My Profile</h1>
          <div className="h-px bg-black w-24 mt-2"></div>
          <p className="section-subtitle mt-4">
            {isSales ? "Performance & Personal Details" : "Administrator Overview"}
          </p>
        </div>

        {/* Profile Header */}
        <div className="card-modern p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100 to-accent-100 opacity-30 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
              <span className="text-white text-4xl font-bold">
                {(user.name || "U").charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-primary-600 font-medium uppercase tracking-widest text-sm mt-1">{user.role}</p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  ID: {user.id}
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                  {user.email}
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                  Status: Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SALES VIEW */}
        {isSales && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Lifetime Incentive"
                value={`₹${(totalIncentive || 0).toLocaleString('en-IN')}`}
                gradient="emerald"
              />
              <StatCard
                title="Total Deals"
                value={totalDeals || 0}
                gradient="primary"
              />
              <StatCard
                title="Approved Rate"
                value={`${totalDeals > 0 ? ((approvedDeals / totalDeals) * 100).toFixed(0) : 0}%`}
                gradient="accent"
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </span>
                Personal Details
              </h3>

              {salesProfile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Department</label>
                    <p className="text-gray-900 font-medium">{salesProfile.department || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Employee Code</label>
                    <p className="text-gray-900 font-medium">{salesProfile.employeeCode || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Mobile</label>
                    <p className="text-gray-900 font-medium">{salesProfile.mobile || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Joining Date</label>
                    <p className="text-gray-900 font-medium">{salesProfile.joiningDate || "N/A"}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-orange-50 text-orange-800 p-4 rounded-lg">
                  Profile details not set. Please contact Admin.
                </div>
              )}
            </div>
          </>
        )}

        {/* ADMIN VIEW */}
        {!isSales && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">System Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Total Users</span>
                  <span className="font-bold text-gray-900">{systemStats?.totalUsers || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Pending Approvals</span>
                  <span className="font-bold text-orange-600">{systemStats?.pendingApprovals || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">Admin Privileges</h3>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>✅ Full Access to Deal History</li>
                <li>✅ User Management</li>
                <li>✅ Policy Configuration</li>
                <li>✅ System Audit Logs</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </SalesLayout>
  );
};

export default ProfilePage;
